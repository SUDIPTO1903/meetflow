import ConferenceLayout from "./components/MainScreen/ConferenceLayout.component";
import presenceRef, { realtimeDb, displayName } from "./server/realtimeBackend";
import "./App.css";
import { useEffect } from "react";
import {
  setPrimaryStream,
  registerParticipant,
  setLocalParticipant,
  unregisterParticipant,
  refreshParticipant,
} from "./store/meetingActions";
import { connect } from "react-redux";

function RootShell(props) {
  const requestUserMediaStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };
  useEffect(async () => {
    const mediaStream = await requestUserMediaStream();
    mediaStream.getVideoTracks()[0].enabled = false;
    props.setPrimaryStream(mediaStream);

    connectivityRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        const defaultMediaPreferences = {
          audio: true,
          video: false,
          screen: false,
        };
        const userPresenceRef = participantsCollectionRef.push({
          userName: displayName,
          preferences: defaultMediaPreferences,
        });
        props.setLocalParticipant({
          [userPresenceRef.key]: { name: displayName, ...defaultMediaPreferences },
        });
        userPresenceRef.onDisconnect().remove();
      }
    });
  }, []);

  const connectivityRef = realtimeDb.database().ref(".info/connected");
  const participantsCollectionRef = presenceRef.child("participants");

  const isUserInitialized = !!props.user;
  const isStreamInitialized = !!props.stream;

  useEffect(() => {
    if (isStreamInitialized && isUserInitialized) {
      participantsCollectionRef.on("child_added", (snapshot) => {
        const preferenceUpdateEvent = participantsCollectionRef
          .child(snapshot.key)
          .child("preferences");
        preferenceUpdateEvent.on("child_changed", (preferenceSnapshot) => {
          props.refreshParticipant({
            [snapshot.key]: {
              [preferenceSnapshot.key]: preferenceSnapshot.val(),
            },
          });
        });
        const { userName: name, preferences = {} } = snapshot.val();
        props.registerParticipant({
          [snapshot.key]: {
            name,
            ...preferences,
          },
        });
      });
      participantsCollectionRef.on("child_removed", (snapshot) => {
        props.unregisterParticipant(snapshot.key);
      });
    }
  }, [isStreamInitialized, isUserInitialized]);

  return (
    <div className="App">
      <ConferenceLayout />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stream: state.primaryMediaStream,
    user: state.loggedInParticipant,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPrimaryStream: (stream) => dispatch(setPrimaryStream(stream)),
    registerParticipant: (participant) => dispatch(registerParticipant(participant)),
    setLocalParticipant: (participant) => dispatch(setLocalParticipant(participant)),
    unregisterParticipant: (participantId) => dispatch(unregisterParticipant(participantId)),
    refreshParticipant: (participant) => dispatch(refreshParticipant(participant)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootShell);
