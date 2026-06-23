import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './index.css';

// Connect to the backend server
// Use environment variable for production, fallback to localhost for dev
const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');

// ICE servers used for the WebRTC connection.
// STUN alone only works for ~80% of networks (same Wi-Fi / simple NAT).
// A TURN server is REQUIRED to relay media when both peers are behind
// firewalls / symmetric NAT / mobile data — without it the call shows
// "Connected" but no audio flows in either direction.
//
// The defaults below use Open Relay's free public TURN servers so the app
// works out of the box. For production, replace these with your own
// (e.g. Twilio Network Traversal or metered.ca) for reliability.
const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
    },
    {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
    },
    {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
    },
];

const PEER_CONFIG = { iceServers: ICE_SERVERS };

function App() {
    const [me, setMe] = useState('');
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState('');
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [callerName, setCallerName] = useState('');
    const [status, setStatus] = useState('Idle');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        // Get user media (audio only for voice call)
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch(err => console.error("Error accessing media devices:", err));

        socket.on('connect', () => {
            setMe(socket.id);
        });

        socket.on('call-made', (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerName(data.name);
            setCallerSignal(data.signal);
            setStatus('Incoming Call...');
        });

        socket.on('call-ended', () => {
            leaveCall();
        });

        // Clean up listeners so they don't stack up (React StrictMode mounts
        // the component twice in dev, which would otherwise duplicate them).
        return () => {
            socket.off('connect');
            socket.off('call-made');
            socket.off('call-ended');
        };
    }, []);

    const callUser = (id) => {
        if (!id) return;
        if (!stream) {
            alert("Microphone is not ready yet. Please allow mic access and try again.");
            return;
        }
        setStatus('Calling...');
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
            config: PEER_CONFIG,
        });

        peer.on('signal', (data) => {
            socket.emit('call-user', {
                userToCall: id,
                signalData: data,
                from: me,
                name: name,
            });
        });

        peer.on('stream', (currentStream) => {
            playRemoteStream(currentStream);
        });

        // Reflect the *real* connection state rather than just signal exchange.
        peer.on('connect', () => setStatus('Connected'));
        peer.on('error', (err) => {
            console.error("Peer connection error:", err);
            setStatus('Connection failed');
        });

        socket.on('call-answered', (data) => {
            setCallAccepted(true);
            peer.signal(data.signal);
        });

        peer.on('close', () => {
            socket.off('call-answered');
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        if (!stream) {
            alert("Microphone is not ready yet. Please allow mic access and try again.");
            return;
        }
        setCallAccepted(true);
        setStatus('Connecting...');
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
            config: PEER_CONFIG,
        });

        peer.on('signal', (data) => {
            socket.emit('answer-call', { signal: data, to: caller });
        });

        peer.on('stream', (currentStream) => {
            playRemoteStream(currentStream);
        });

        peer.on('connect', () => setStatus('Connected'));
        peer.on('error', (err) => {
            console.error("Peer connection error:", err);
            setStatus('Connection failed');
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    // Attach the remote audio stream and explicitly start playback.
    // Browsers can block autoplay; calling play() inside the user-gesture
    // chain (Call/Answer click) and catching errors surfaces the problem
    // instead of failing silently.
    const playRemoteStream = (currentStream) => {
        if (!userVideo.current) return;
        userVideo.current.srcObject = currentStream;
        userVideo.current.play().catch((err) => {
            console.error("Autoplay blocked / playback error:", err);
            setStatus('Tap anywhere to enable audio');
        });
    };

    const leaveCall = () => {
        setCallEnded(true);
        setStatus('Call Ended');

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }

        // Notify other user
        if (callAccepted && !callEnded) {
            socket.emit('end-call', { to: caller || idToCall }); // simple logic, might need refinement for exact peer
        }

        // Reset state after a delay
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(me);
        alert("ID copied to clipboard!");
    };

    return (
        <div className="container">
            <div className="avatar">
                {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1>Voice Call App</h1>
            <p className="subtitle">Crystal clear internet calls</p>

            {/* Hidden Audio Elements */}
            <audio ref={myVideo} autoPlay muted style={{ display: 'none' }} />
            <audio ref={userVideo} autoPlay style={{ display: 'none' }} />

            {!callAccepted && !receivingCall && (
                <>
                    <div className="input-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            maxLength={20}
                            onChange={(e) => {
                                // Allow only alphanumeric and spaces
                                const val = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '');
                                setName(val);
                            }}
                        />
                    </div>
                    <div className="input-group">
                        <label>Your ID (Share this)</label>
                        <div className="user-id-display" onClick={copyToClipboard} title="Click to copy">
                            {me || "Connecting..."}
                        </div>
                    </div>
                    <div className="input-group">
                        <label>ID to Call</label>
                        <input
                            type="text"
                            placeholder="Paste ID here"
                            value={idToCall}
                            maxLength={20}
                            onChange={(e) => {
                                // Allow only valid socket ID chars (alphanumeric, -, _)
                                const val = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '');
                                setIdToCall(val);
                            }}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => callUser(idToCall)}>
                        Call Now
                    </button>
                </>
            )}

            {receivingCall && !callAccepted && (
                <div className="incoming-call-card">
                    <div className="avatar pulse">
                        {callerName ? callerName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <h2>{callerName || "Unknown"} is calling...</h2>
                    <div className="action-buttons">
                        <button className="btn btn-success" onClick={answerCall}>
                            Answer
                        </button>
                        <button className="btn btn-danger" onClick={() => { setReceivingCall(false); }}>
                            Decline
                        </button>
                    </div>
                </div>
            )}

            {callAccepted && !callEnded && (
                <div className="active-call-ui">
                    <h2 className="pulse" style={{ color: '#00d2ff' }}>On Call</h2>
                    <p>Connected with {callerName || idToCall}</p>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-danger" onClick={leaveCall}>
                            End Call
                        </button>
                    </div>
                </div>
            )}

            <div className="call-status">
                Status: {status}
            </div>
        </div>
    );
}

export default App;
