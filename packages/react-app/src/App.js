import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bridge from './pages/bridge';
import MobileIndex from "./pages/mobile"
import TransferBridge from './pages/bridge/transfer';

export const isMobile = /Android|iPhone/i.test(navigator.userAgent)


class App extends Component {
  render() {
    return isMobile ? <MobileIndex /> : (
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
