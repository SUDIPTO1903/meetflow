## Realtime Meeting Room

Modern browser‑based video meeting app with multi‑participant tiles, screen sharing, and basic media controls, built on WebRTC, Firebase Realtime Database, and React/Redux.

### Features

- **Multi‑participant grid**: Dynamic `AudienceGrid` layout that adapts to the number of participants and highlights screen‑sharing.
- **Media controls**: `ControlDock` lets you toggle microphone, camera, and screen sharing in real time.
- **Per‑user preferences**: Audio/video/screen preferences are stored in Firebase and synced for all connected peers.
- **WebRTC mesh signaling**: `mediaSession` and `realtimeBackend` coordinate peer connections and ICE candidates through Firebase.
- **Redux state management**: Centralized meeting state handled by `meetingReducer`, `meetingActions`, and `meetingActionTypes`.

### Project Structure (Key Files)

- **Entry & shell**
  - `src/index.js` – Bootstraps React, Redux store, and mounts the app.
  - `src/RootShell.js` – Top‑level container that acquires local media, manages Firebase presence, and wires Redux to the UI.
- **UI components**
  - `src/components/MainScreen/ConferenceLayout.component.js` – Main layout that combines the audience grid and control dock.
  - `src/components/MeetingFooter/ControlDock.component.js` – Bottom control bar for mic, camera, and screen sharing.
  - `src/components/Participants/AudienceGrid.component.js` – Responsive grid of participants.
  - `src/components/Participants/Participant/AudienceTile.component.js` – Individual participant tile with avatar, name, and mute indicator.
  - `src/components/Shared/Card/SurfaceCard.component.js` – Simple surface wrapper used around tiles.
- **Signaling & backend**
  - `src/server/realtimeBackend.js` – Firebase initialization, room selection, and presence root reference.
  - `src/server/mediaSession.js` – WebRTC signaling helpers (offers, answers, ICE candidates, and preference updates).
- **State management**
  - `src/store/meetingActionTypes.js` – String constants for Redux actions.
  - `src/store/meetingActions.js` – Action creators for streams and participants.
  - `src/store/meetingReducer.js` – `meetingStateReducer` that holds `primaryMediaStream`, `participantDirectory`, and `loggedInParticipant`.

### Setup & Configuration

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Open `src/server/realtimeBackend.js`.
   - Fill in your Firebase project details:
     - `apiKey`
     - `databaseURL`
   - Ensure the Realtime Database is enabled in your Firebase console and security rules allow read/write for your testing scenario.

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Join a room**
   - When the app loads, it will prompt for a display name.
   - A unique room id is encoded in the URL query parameter `?id=...`.
   - Share that URL with others so they can join the same meeting.

### Scripts

- **`npm start`** – Run the React development server.
- **`npm test`** – Run the default CRA test runner (if you add tests).
- **`npm run build`** – Build the production bundle.

### Screenshots

- **Desktop view**
  - `screenshots/Desktop View.jpg`
- **Screen sharing view**
  - `screenshots/Screenshare.jpg`
- **Mobile view**
  - `screenshots/Mobile View.jpg`

### Notes & Limitations

- The current mesh approach is ideal for small meetings (roughly 8–12 participants) before bandwidth/CPU limits become noticeable.
- This project is intended as a learning/reference implementation and does not include production‑grade authentication or TURN servers.

### License & Attribution

You are free to modify and extend this project for personal or educational use. Replace Firebase credentials and branding as needed for your own deployments.
