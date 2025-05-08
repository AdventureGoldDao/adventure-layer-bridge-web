import "./index.css";

import { createAppKit } from '@reown/appkit/react'

import { projectId, metadata, networks, ethers5Adapter } from './lib/wallet'

import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from "./App";

// Create the AppKit instance
createAppKit({
  adapters: [ethers5Adapter],
  metadata,
  networks,
  projectId,
  features: {
    analytics: false,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
