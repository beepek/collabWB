import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Whiteboard from './Whiteboard';
import LoginForm from './LoginForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Collaborative Whiteboard</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Whiteboard />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
