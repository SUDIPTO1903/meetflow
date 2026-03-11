import React from "react";
import SurfaceCard from "../../Shared/Card/SurfaceCard.component";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Participant.css";

export const AudienceTile = (props) => {
  const {
    tileIndex,
    currentParticipant,
    hideVideo,
    videoRef,
    showAvatar,
    currentUser,
  } = props;

  if (!currentParticipant) return <></>;

  return (
    <div className={`participant ${hideVideo ? "hide" : ""}`}>
      <SurfaceCard>
        <video
          ref={videoRef}
          className="video"
          id={`participantVideo${tileIndex}`}
          autoPlay
          playsInline
        ></video>
        {!currentParticipant.audio && (
          <FontAwesomeIcon
            className="muted"
            icon={faMicrophoneSlash}
            title="Muted"
          />
        )}
        {showAvatar && (
          <div
            style={{ background: currentParticipant.avatarColor }}
            className="avatar"
          >
            {currentParticipant.name[0]}
          </div>
        )}
        <div className="name">
          {currentParticipant.name}
          {currentUser ? "(You)" : ""}
        </div>
      </SurfaceCard>
    </div>
  );
};
