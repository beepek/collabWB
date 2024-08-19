require('dotenv').config();
console.log('DB_URI:', process.env.DB_URI);
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const routes = require('./routes/index');  // Importing the routes


// Connect to MongoDB using environment variable
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process with an error code
  });


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


// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));


// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));


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
            if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
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


// Registration route
app.post('/register', (req, res) => {
    console.log('Registering user:', req.body.username); // Add log
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
        username: req.body.username,
        password: hashedPassword
    });
    newUser.save()
        .then(() => {
            console.log('Registration successful'); // Add log
            res.json({ success: true, message: 'Registration successful' });
        })
        .catch(err => {
            console.error('Error registering user:', err); // Add log
            res.status(500).json({ success: false, message: 'Error registering user', error: err });
        });
});


// Login route
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true });
});


// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


// Auth status route
app.get('/auth-status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});


// Apply routes from the routes module
app.use('/', routes);


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.get('/whiteboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'whiteboard.html'));
});


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
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
