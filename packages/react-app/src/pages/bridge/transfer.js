import { useQuery } from "@apollo/client";
import { utils } from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Helmet } from 'react-helmet';
import { BrowserRouter, Location } from "react-router-dom";
import { isMobile } from 'react-device-detect';

import styled from "styled-components";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// import Router from "./route/router";

import { Body, Button as SimpleButton, Container, Header, Image, Link } from "../../components";
// import logo from "./ethereumLogo.png";

import { addresses, abis } from "@my-app/contracts";
import GET_TRANSFERS from "../../graphql/subgraph";

const AddressText = styled.div`
  color: #444;
`;

const AdventureLayer = {
  chainId: "12340189",
  rpcUrl: "https://rpc.adventurelayer.xyz",
  wssUrl: "wss://rpc.adventurelayer.xyz",
}

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

function Transfer() {
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
  const wethContractAddress = addresses.depositL1
  const wethContractAddressL2 = addresses.depositL2
  const contract = new Contract(wethContractAddress, wethInterface)
  const contractL2 = new Contract(wethContractAddressL2, wethInterface)
  const { state: stateDeposit, send: sendDeposit } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' })
  const { state: stateDepositL2, send: sendDepositL2 } = useContractFunction(contractL2, 'deposit', { transactionName: 'Transfer L2' })

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  const [chainState, setChainState] = React.useState(addresses.depositL1);

  const handleChainChange = (event) => {
    setChainState(event.target.value);
  };

  useEffect(() => {
    if (subgraphQueryError) {
      console.error("Error while querying subgraph:", subgraphQueryError.message);
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  const gasPriceGwei = '15'
  const l1Web3 = new Web3(Sepolia.rpcUrl)
  const l2Web3 = new Web3(AdventureLayer.rpcUrl)
  const onClickTransfer = async () => {
    console.log({ transfers: sendAmount });
    if (!account || isNaN(sendAmount)) {
      console.log(account, sendAmount)
      return
    }

    console.log('start', account, sendAmount);
    try {
      if (addresses.depositL1 === chainState) {
        const nonce = await l1Web3.eth.getTransactionCount(account, 'pending')
        console.log('nonce', nonce)
        sendDeposit(account, sendAmount, {
          value: sendAmount,
          gasLimit: 3e7,
          nonce: Number(nonce) + 1,
          gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        })
      } else {
        const nonce = await l2Web3.eth.getTransactionCount(account, 'pending')
        console.log('nonce', wethContractAddressL2, nonce, account, sendAmount, {
          value: sendAmount,
          gasLimit: 3e7,
          nonce: Number(nonce) + 1,
          gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        })
        sendDepositL2(account, sendAmount, {
          value: sendAmount,
          gasLimit: 3e7,
          // nonce: Number(nonce) + 1,
          gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        })
      }
    } catch (e) {
      console.log("error", e)
    }

    // console.log({ sendAmount: sendAmount });
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
            {/* <AddressText>Balance: {0}</AddressText> */}
          </Stack>

        </Box>

        <Box width={'80%'}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Transfer Chain</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={chainState}
              label="Transfer Chain"
              onChange={handleChainChange}
            >
              <MenuItem value={addresses.depositL1}>L1 To L2</MenuItem>
              <MenuItem value={addresses.depositL2}>L2 To L1</MenuItem>
            </Select>
          </FormControl>
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

export default Transfer;
