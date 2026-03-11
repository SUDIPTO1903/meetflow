import {
  SET_PRIMARY_STREAM,
  REGISTER_PARTICIPANT,
  SET_LOCAL_PARTICIPANT,
  UNREGISTER_PARTICIPANT,
  UPDATE_LOCAL_PARTICIPANT,
  REFRESH_PARTICIPANT,
} from "./meetingActionTypes";

export const setPrimaryStream = (stream) => {
  return {
    type: SET_PRIMARY_STREAM,
    payload: {
      primaryMediaStream: stream,
    },
  };
};

export const setLocalParticipant = (participant) => {
  return {
    type: SET_LOCAL_PARTICIPANT,
    payload: {
      loggedInParticipant: participant,
    },
  };
};

export const registerParticipant = (participant) => {
  return {
    type: REGISTER_PARTICIPANT,
    payload: {
      participantRecord: participant,
    },
  };
};

export const updateLocalParticipant = (participant) => {
  return {
    type: UPDATE_LOCAL_PARTICIPANT,
    payload: {
      loggedInParticipant: participant,
    },
  };
};

export const refreshParticipant = (participant) => {
  return {
    type: REFRESH_PARTICIPANT,
    payload: {
      participantRecord: participant,
    },
  };
};

export const unregisterParticipant = (participantId) => {
  return {
    type: UNREGISTER_PARTICIPANT,
    payload: {
      id: participantId,
    },
  };
};
