import React, { useRef, useEffect } from "react";
import ControlDock from "../MeetingFooter/ControlDock.component";
import AudienceGrid from "../Participants/AudienceGrid.component";
import "./MainScreen.css";
import { connect } from "react-redux";
import { setPrimaryStream, updateLocalParticipant } from "../../store/meetingActions";

const ConferenceLayout = (props) => {
  const participantConnectionsRef = useRef(props.participants);

  const onMicClick = (micEnabled) => {
    if (props.stream) {
      props.stream.getAudioTracks()[0].enabled = micEnabled;
      props.updateLocalParticipant({ audio: micEnabled });
    }
  };
  const onVideoClick = (videoEnabled) => {
    if (props.stream) {
      props.stream.getVideoTracks()[0].enabled = videoEnabled;
      props.updateLocalParticipant({ video: videoEnabled });
    }
  };

  useEffect(() => {
    participantConnectionsRef.current = props.participants;
  }, [props.participants]);

  const updateStream = (stream) => {
    for (let key in participantConnectionsRef.current) {
      const sender = participantConnectionsRef.current[key];
      if (sender.currentUser) continue;
      const peerConnection = sender.peerConnection
        .getSenders()
        .find((s) => (s.track ? s.track.kind === "video" : false));
      peerConnection.replaceTrack(stream.getVideoTracks()[0]);
    }
    props.setPrimaryStream(stream);
  };

  const onScreenShareEnd = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localStream.getVideoTracks()[0].enabled = Object.values(
      props.currentUser
    )[0].video;

    updateStream(localStream);

    props.updateLocalParticipant({ screen: false });
  };

  const onScreenClick = async () => {
    let mediaStream;
    if (navigator.getDisplayMedia) {
      mediaStream = await navigator.getDisplayMedia({ video: true });
    } else if (navigator.mediaDevices.getDisplayMedia) {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
    } else {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { mediaSource: "screen" },
      });
    }

    mediaStream.getVideoTracks()[0].onended = onScreenShareEnd;

    updateStream(mediaStream);

    props.updateLocalParticipant({ screen: true });
  };
  return (
    <div className="wrapper">
      <div className="main-screen">
        <AudienceGrid />
      </div>

      <div className="footer">
        <ControlDock
          onScreenClick={onScreenClick}
          onMicClick={onMicClick}
          onVideoClick={onVideoClick}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    stream: state.primaryMediaStream,
    participants: state.participantDirectory,
    currentUser: state.loggedInParticipant,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPrimaryStream: (stream) => dispatch(setPrimaryStream(stream)),
    updateLocalParticipant: (user) => dispatch(updateLocalParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceLayout);
