import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Whiteboard from './Whiteboard';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Collaborative Whiteboard</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Whiteboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
