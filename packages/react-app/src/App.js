import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bridge from './pages/bridge';

class App extends Component {
  render() {
    return (
      <Router>
      <Routes>
        <Route path="/" element={<Bridge />} />
      </Routes>
    </Router>
    );
  }
}

export default App;
