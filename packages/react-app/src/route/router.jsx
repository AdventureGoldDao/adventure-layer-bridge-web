import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";

import BridgePage from "../pages/bridge"
// import MobileIndex from "../pages/mobile"

// const UserSettingPage = React.lazy(() => import('../pages/user/user_setting'))
// const RegisterPage = React.lazy(() => import('../pages/explore/register'))

const MainDiv = styled.div`
  height: 100%;
  // @media (min-height:845px), (min-width:767px) {
  //   max-width: 390px;
  //   width: 390px;
  //   height: 684px;

  //   position: relative;
  //   margin: 0 auto;
  //   margin-top: 78px;
  //   border: 1px solid #ccc;
  //   border-radius: 5px;
  // }
`

function Router() {
  let location = useLocation()

//   const showNavi = isShowNavi(location.pathname)
  const styles = { 'height': '100%', 'boxSizing': 'border-box' }
//   if (showNavi) {
//     styles['paddingBottom'] = '70px'
//   }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* <MomentComponent.HayoHeader /> */}
      <MainDiv className="main">
        <div style={styles} className="body">
          <Routes>
            <Route path="/" element={<BridgePage />} />
            {/* <Route path="/demo" element={<Demo />} /> */}
          </Routes>
        </div>
      </MainDiv>
    </Suspense>
  );
}

export default Router