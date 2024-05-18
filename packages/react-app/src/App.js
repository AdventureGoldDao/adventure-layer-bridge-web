import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bridge from './pages/bridge';
import TransferBridge from './pages/bridge/transfer';

class App extends Component {
  render() {
    return (
      <Router>
      <Routes>
        <Route path="/" element={<Bridge />} />
        <Route path="/transfer" element={<TransferBridge />} />
      </Routes>
    </Router>
    );
  }
}

export default App;
