import {
  SET_PRIMARY_STREAM,
  REGISTER_PARTICIPANT,
  SET_LOCAL_PARTICIPANT,
  UNREGISTER_PARTICIPANT,
  UPDATE_LOCAL_PARTICIPANT,
  REFRESH_PARTICIPANT,
} from "./meetingActionTypes";

import {
  createOffer,
  initializeListensers,
  updatePreference,
} from "../server/mediaSession";

let defaultUserState = {
  primaryMediaStream: null,
  participantDirectory: {},
  loggedInParticipant: null,
};

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
        "stun:stun.services.mozilla.com",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

const generateColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export const meetingStateReducer = (state = defaultUserState, action) => {
  if (action.type === SET_PRIMARY_STREAM) {
    const payload = action.payload;
    state = { ...state, ...payload };
    return state;
  } else if (action.type === REGISTER_PARTICIPANT) {
    const payload = action.payload;
    const currentUserId = Object.keys(state.loggedInParticipant)[0];
    const newParticipantId = Object.keys(payload.participantRecord)[0];
    if (
      state.primaryMediaStream &&
      currentUserId !== newParticipantId
    ) {
      payload.participantRecord = addConnection(
        payload.participantRecord,
        state.loggedInParticipant,
        state.primaryMediaStream
      );
    }

    if (currentUserId === newParticipantId)
      payload.participantRecord[newParticipantId].currentUser = true;

    payload.participantRecord[newParticipantId].avatarColor = generateColor();
    const participantDirectory = {
      ...state.participantDirectory,
      ...payload.participantRecord,
    };
    state = { ...state, participantDirectory };
    return state;
  } else if (action.type === SET_LOCAL_PARTICIPANT) {
    const payload = action.payload;
    const participantDirectory = { ...state.participantDirectory };
    const userId = Object.keys(payload.loggedInParticipant)[0];
    payload.loggedInParticipant[userId].avatarColor = generateColor();
    initializeListensers(userId);
    state = {
      ...state,
      loggedInParticipant: { ...payload.loggedInParticipant },
      participantDirectory,
    };
    return state;
  } else if (action.type === UNREGISTER_PARTICIPANT) {
    const payload = action.payload;
    const participantDirectory = { ...state.participantDirectory };
    delete participantDirectory[payload.id];
    state = { ...state, participantDirectory };
    return state;
  } else if (action.type === UPDATE_LOCAL_PARTICIPANT) {
    const payload = action.payload;
    const userId = Object.keys(state.loggedInParticipant)[0];
    updatePreference(userId, payload.loggedInParticipant);
    state.loggedInParticipant[userId] = {
      ...state.loggedInParticipant[userId],
      ...payload.loggedInParticipant,
    };
    state = {
      ...state,
      loggedInParticipant: { ...state.loggedInParticipant },
    };
    return state;
  } else if (action.type === REFRESH_PARTICIPANT) {
    const payload = action.payload;
    const participantId = Object.keys(payload.participantRecord)[0];

    payload.participantRecord[participantId] = {
      ...state.participantDirectory[participantId],
      ...payload.participantRecord[participantId],
    };
    const participantDirectory = {
      ...state.participantDirectory,
      ...payload.participantRecord,
    };
    state = { ...state, participantDirectory };
    return state;
  }
  return state;
};

const addConnection = (newUser, currentUser, stream) => {
  const peerConnection = new RTCPeerConnection(servers);
  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });
  const newUserId = Object.keys(newUser)[0];
  const currentUserId = Object.keys(currentUser)[0];

  const offerIds = [newUserId, currentUserId].sort((a, b) =>
    a.localeCompare(b)
  );

  newUser[newUserId].peerConnection = peerConnection;
  if (offerIds[0] !== currentUserId)
    createOffer(peerConnection, offerIds[0], offerIds[1]);
  return newUser;
};
