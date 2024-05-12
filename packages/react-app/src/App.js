import { useQuery } from "@apollo/client";
import { utils } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useContractFunction, useEthers, useLookupAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Helmet } from 'react-helmet';
import { BrowserRouter, Location } from "react-router-dom";
import { isMobile } from 'react-device-detect';

import styled from "styled-components";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// import Router from "./route/router";

import { Body, Button as SimpleButton, Container, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";

import { addresses, abis } from "@my-app/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

const AddressText = styled.div`
  color: #444;
`;


function WalletButton() {
  const [rendered, setRendered] = useState("");

  const { ens } = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <SimpleButton
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </SimpleButton>
  );
}

function App() {
  const [sendAmount, setSendAmount] = useState('');
  const { account, activateBrowserWallet, deactivate, error } = useEthers();
  // Read more about useDapp on https://usedapp.io/
  // const { error: contractCallError, value: tokenBalance } =
  //   useCall({
  //     contract: new Contract(addresses.ceaErc20, abis.erc20),
  //     method: "balanceOf",
  //     args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
  //   }) ?? {};
  const wethInterface = new utils.Interface(abis.adventureSepolia)
  const wethContractAddress = addresses.adventureSepolia
  const contract = new Contract(wethContractAddress, wethInterface)
  const { state: stateDeposit, send: sendDeposit } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' })

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  useEffect(() => {
    if (subgraphQueryError) {
      console.error("Error while querying subgraph:", subgraphQueryError.message);
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  const onClickTransfer = () => {
    console.log({ transfers: sendAmount });
    if (!account || isNaN(sendAmount)) {
      console.log(account, sendAmount)
      return
    }

    console.log('start', { transfers: sendAmount });
    try {
      sendDeposit(account, Number(sendAmount), {value: Number(sendAmount), gasLimit: 3e7})
    } catch (e){
      console.log("error", e)
    }
    
    console.log({ sendAmount: sendAmount});
  }

  // console.log(tokenBalance, Number(tokenBalance))
  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Box
          width={'80%'}
          my={4}
          display="flex"
          alignItems="center"
          gap={4}
          p={2}
          sx={{ border: '2px solid grey' }}
        >
          <Stack>
            <AddressText>Address: {account}</AddressText>
            <AddressText>Balance: {0}</AddressText>
          </Stack>

        </Box>
        <Box
          width={'80%'}
          component="form"
          display="flex"
          alignItems="left"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" value={sendAmount} onChange={(e) => {
            setSendAmount(e.target.value);
          }} label="Amount" variant="outlined" />
          {/* <TextField id="filled-basic" label="Filled" variant="filled" />
          <TextField id="standard-basic" label="Standard" variant="standard" /> */}
          <Button onClick={onClickTransfer} size="large" variant="outlined">Transfer</Button>
        </Box>

        {/* <Image src={logo} alt="ethereum-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <Link href="https://reactjs.org">
          Learn React
        </Link>
        <Link href="https://usedapp.io/">Learn useDapp</Link>
        <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link> */}
      </Body>
    </Container>
  );
}

export default App;
