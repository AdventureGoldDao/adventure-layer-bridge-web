import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bridge from './pages/bridge';
import MobileIndex from "./pages/mobile"

export const isMobile = /Android|iPhone/i.test(navigator.userAgent)


class App extends Component {
  render() {
    return isMobile ? <MobileIndex /> : (
      <Router>
      <Routes>
        <Route path="/" element={<Bridge />} />
      </Routes>
    </Router>
    );
  }
}

export default App;
