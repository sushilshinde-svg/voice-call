# Voice Call App Walkthrough

## Overview
You have successfully built a voice calling application using React, WebRTC, and Socket.io. This app allows two users to connect via audio call using their browser.

## Prerequisites
- Node.js installed.
- Microphone access allowed in the browser.

## How to Run
The application consists of two parts: the Server and the Client.

### 1. Start the Server
Open a terminal in the `server` directory and run:
```bash
npm start
```
*The server will run on port 5000.*

### 2. Start the Client
Open a terminal in the `client` directory and run:
```bash
npm run dev
```
*The client will run on http://localhost:5173.*

## How to Use
1.  **Open the App**: Open [http://localhost:5173](http://localhost:5173) in two separate browser tabs or windows.
2.  **Copy ID**: In the first tab, click on the "Your ID" box to copy your unique Socket ID.
3.  **Make a Call**:
    -   Go to the second tab.
    -   Paste the ID into the "ID to Call" field.
    -   Click "Call Now".
4.  **Answer Call**:
    -   Back in the first tab, you will see an incoming call notification.
    -   Click "Answer".
5.  **Talk**: You should now be connected!
6.  **End Call**: Click "End Call" to hang up.
