import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";

import BridgePage from "../pages/bridge"

const MainDiv = styled.div`
  height: 100%;
`

function Router() {
  let location = useLocation()

  const styles = { 'height': '100%', 'boxSizing': 'border-box' }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainDiv className="main">
        <div style={styles} className="body">
          <Routes>
            <Route path="/" element={<BridgePage />} />
          </Routes>
        </div>
      </MainDiv>
    </Suspense>
  );
}

export default Router