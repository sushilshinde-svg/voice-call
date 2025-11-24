const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // SECURITY: Only allow connections from your frontend
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Store connected users: { socketId: username }
const users = {};

// Rate Limiting Map: { socketId: { count: number, lastReset: timestamp } }
const rateLimits = {};

const isRateLimited = (socketId) => {
    const now = Date.now();
    if (!rateLimits[socketId]) {
        rateLimits[socketId] = { count: 0, lastReset: now };
    }

    // Reset every 10 seconds
    if (now - rateLimits[socketId].lastReset > 10000) {
        rateLimits[socketId] = { count: 0, lastReset: now };
    }

    rateLimits[socketId].count++;

    // Limit: 10 events per 10 seconds
    if (rateLimits[socketId].count > 10) {
        return true;
    }
    return false;
};

const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    // Allow alphanumeric and spaces, max 20 chars
    return str.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 20);
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (username) => {
        if (isRateLimited(socket.id)) return;

        const cleanName = sanitize(username);
        if (!cleanName) return;

        users[socket.id] = cleanName;
        console.log(`User registered: ${cleanName} (${socket.id})`);
        io.emit('user-list', Object.values(users));
    });

    socket.on('call-user', ({ userToCall, signalData, from, name }) => {
        if (isRateLimited(socket.id)) {
            console.warn(`Rate limit exceeded for ${socket.id}`);
            return;
        }

        // Validation
        if (!userToCall || typeof userToCall !== 'string' || userToCall.length > 50) return;
        if (!signalData) return; // Basic check, signalData is complex object

        const cleanName = sanitize(name);

        console.log(`Call initiated from ${from} to ${userToCall}`);
        io.to(userToCall).emit('call-made', { signal: signalData, from, name: cleanName });
    });

    socket.on('answer-call', (data) => {
        if (isRateLimited(socket.id)) return;
        if (!data.to || !data.signal) return;

        io.to(data.to).emit('call-answered', { signal: data.signal });
    });

    socket.on('end-call', ({ to }) => {
        if (to) io.to(to).emit('call-ended');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        delete rateLimits[socket.id]; // Cleanup
        io.emit('user-list', Object.values(users));
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
