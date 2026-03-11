import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import "./MeetingFooter.css";

const ControlDock = (props) => {
  const [controlState, setControlState] = useState({
    micEnabled: true,
    videoVisible: false,
    screenSharing: false,
  });

  const handleMicToggle = () => {
    setControlState((previousState) => ({
      ...previousState,
      micEnabled: !previousState.micEnabled,
    }));
  };

  const handleVideoToggle = () => {
    setControlState((previousState) => ({
      ...previousState,
      videoVisible: !previousState.videoVisible,
    }));
  };

  const handleScreenShareClick = () => {
    props.onScreenClick(setScreenSharingState);
  };

  const setScreenSharingState = (isEnabled) => {
    setControlState((previousState) => ({
      ...previousState,
      screenSharing: isEnabled,
    }));
  };

  useEffect(() => {
    props.onMicClick(controlState.micEnabled);
  }, [controlState.micEnabled]);

  useEffect(() => {
    props.onVideoClick(controlState.videoVisible);
  }, [controlState.videoVisible]);

  return (
    <div className="meeting-footer">
      <div
        className={
          "meeting-icons " + (!controlState.micEnabled ? "active" : "")
        }
        data-tip={controlState.micEnabled ? "Mute Audio" : "Unmute Audio"}
        onClick={handleMicToggle}
      >
        <FontAwesomeIcon
          icon={!controlState.micEnabled ? faMicrophoneSlash : faMicrophone}
          title="Mute"
        />
      </div>
      <div
        className={
          "meeting-icons " + (!controlState.videoVisible ? "active" : "")
        }
        data-tip={
          controlState.videoVisible ? "Hide Video" : "Show Video"
        }
        onClick={handleVideoToggle}
      >
        <FontAwesomeIcon
          icon={!controlState.videoVisible ? faVideoSlash : faVideo}
        />
      </div>
      <div
        className="meeting-icons"
        data-tip="Share Screen"
        onClick={handleScreenShareClick}
        disabled={controlState.screenSharing}
      >
        <FontAwesomeIcon icon={faDesktop} />
      </div>
      <ReactTooltip />
    </div>
  );
};

export default ControlDock;
