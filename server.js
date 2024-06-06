// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle drawing activity
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//sometimes dumb people can code too :) 