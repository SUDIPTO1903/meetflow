import React, { useEffect, useRef } from "react";
import "./Participants.css";
import { connect } from "react-redux";
import { AudienceTile } from "./Participant/AudienceTile.component";

const AudienceGrid = (props) => {
  const localPreviewRef = useRef(null);
  const participantIds = Object.keys(props.participantDirectory);

  useEffect(() => {
    if (localPreviewRef.current) {
      localPreviewRef.current.srcObject = props.stream;
      localPreviewRef.current.muted = true;
    }
  }, [props.currentUser, props.stream]);

  const activeUser =
    props.currentUserSnapshot && Object.values(props.currentUserSnapshot)[0]
      ? Object.values(props.currentUserSnapshot)[0]
      : null;

  let gridColumns =
    participantIds.length === 1 ? 1 : participantIds.length <= 4 ? 2 : 4;
  const gridColumnSpan = participantIds.length <= 4 ? 1 : 2;
  let gridRows =
    participantIds.length <= 4
      ? participantIds.length
      : Math.ceil(participantIds.length / 2);

  const screenPresenterId = participantIds.find((participantId) => {
    const participant = props.participantDirectory[participantId];
    return participant.screen;
  });

  if (screenPresenterId) {
    gridColumns = 1;
    gridRows = 2;
  }

  const audienceTiles = participantIds.map((participantId, index) => {
    const participant = props.participantDirectory[participantId];
    const isSelf = participant.currentUser;

    if (isSelf) {
      return null;
    }

    const peerConnection = participant.peerConnection;
    const remoteStream = new MediaStream();
    const tileIndex = index;

    if (peerConnection) {
      peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        const videoElement = document.getElementById(
          `participantVideo${tileIndex}`
        );
        if (videoElement) videoElement.srcObject = remoteStream;
      };
    }

    return (
      <AudienceTile
        key={tileIndex}
        currentParticipant={participant}
        tileIndex={tileIndex}
        hideVideo={
          screenPresenterId && screenPresenterId !== participantId
        }
        showAvatar={
          !participant.video && !participant.screen && participant.name
        }
      />
    );
  });

  return (
    <div
      style={{
        "--grid-size": gridColumns,
        "--grid-col-size": gridColumnSpan,
        "--grid-row-size": gridRows,
      }}
      className={`participants`}
    >
      {audienceTiles}
      <AudienceTile
        currentParticipant={activeUser}
        tileIndex={participantIds.length}
        hideVideo={screenPresenterId && !activeUser.screen}
        videoRef={localPreviewRef}
        showAvatar={
          activeUser && !activeUser.video && !activeUser.screen
        }
        currentUser={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    participantDirectory: state.participantDirectory,
    currentUserSnapshot: state.loggedInParticipant,
    stream: state.primaryMediaStream,
  };
};

export default connect(mapStateToProps)(AudienceGrid);
