require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');
const routes = require('./routes/index');  // Importing the routes

// Connect to MongoDB using environment variable
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema definitions
const Schema = mongoose.Schema;

const pointSchema = new Schema({
    x: Number,
    y: Number,
    color: String,
    size: Number
});

const drawingSchema = new Schema({
    name: { type: String, default: "Untitled Drawing" },
    data: [pointSchema],  // Array of points
    createdAt: {
      type: Date,
      default: Date.now
    }
});

const Drawing = mongoose.model('Drawing', drawingSchema);

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' dir
app.use(express.static('public'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret', //session id cookie
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id); // Save user id to the session
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user); // Retrieve user from the session using the stored id
    });
});

// Apply routes from the routes module
app.use('/', routes);

// Real-time connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('cursorMove', (data) => {
        socket.broadcast.emit('showCursor', {
            userId: socket.id,
            position: data.position,
            color: data.color
        });
    });

    socket.on('startDrawing', (data) => {
        socket.broadcast.emit('userDrawing', {
            userId: socket.id,
            drawing: true
        });
    });

    socket.on('stopDrawing', () => {
        socket.broadcast.emit('userDrawing', {
            userId: socket.id,
            drawing: false
        });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
