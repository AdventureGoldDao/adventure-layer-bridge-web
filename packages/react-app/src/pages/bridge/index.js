import { useQuery } from "@apollo/client";
import { utils } from 'ethers'
import * as ethers from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Decimal from "decimal.js"

import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Descriptions } from 'antd';
import './index.css';

import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiMenu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MuiButton from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import AdbIcon from '@mui/icons-material/Adb';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import SvgIcon from '@mui/material/SvgIcon';
import MuiLink from '@mui/material/Link';
import { purple } from '@mui/material/colors';
import { addresses, abis } from "@my-app/contracts";
import logo  from "../../img/logo_white_120x50.png";
// import { styled } from '@mui/material/styles';





const pages = ['Faucet', 'Document'];
const pageLinks = {
  "Faucet": 'https://faucet.adventurelayer.dev/',
  "Document": 'https://docs.adventurelayer.dev/',
}

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const AdventureLayer = {
  chainId: 412346,
  rpcUrl: "https://rpc.adventurelayer.dev",
  wssUrl: "ws://3.84.203.161:8548",
}


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (

    <AppBar sx={{ background: '#2D221A' }} position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <img src={logo} alt='background' style={{ marginRight: '15px' }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <MuiMenu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem  key={page} onClick={handleCloseNavMenu}>
                  <Typography  textAlign="center">
                    <MuiLink  href={pageLinks[page]} underline="none">
                      {page}
                    </MuiLink>
                  </Typography>
                </MenuItem>
              ))}
            </MuiMenu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* <img src={logo} alt='background' style={{ marginRight: '15px' }} /> */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <MuiButton
                key={page}
                href={pageLinks[page]}
                // onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#E09657', display: 'block' }}
              >
                {page}
              </MuiButton>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            
            <WalletButton></WalletButton>
            {/* <ConnectButton>Primary</ConnectButton> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const ConnectButton = styled(MuiButton)(({ theme }) => ({
  color: '#461400',
  backgroundColor: '#DC9D50',
  '&:hover': {
    backgroundColor: '#DC9D50',
  },
}));

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
    <ConnectButton variant="contained" size="medium"
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}>
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </ConnectButton>
  );
}

const bridgeConfig = {
  sepolia: {
    address: addresses.depositL1,
    chainId: Sepolia.chainId,
    text: 'Sepolia',
    target_text: 'Adventure Layer'
  },
  adventure: {
    address: addresses.depositL2,
    chainId: AdventureLayer.chainId,
    text: 'Adventure Layer',
    target_text: 'Sepolia'
  },
}

const BridgeIndex = () => {
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [sendAmount, setSendAmount] = useState('');
  const { account, activateBrowserWallet, deactivate, switchNetwork, error, library, chainId } = useEthers();
  // Read more about useDapp on https://usedapp.io/
  // const { error: contractCallError, value: tokenBalance } =
  //   useCall({
  //     contract: new Contract(addresses.ceaErc20, abis.erc20),
  //     method: "balanceOf",
  //     args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
  //   }) ?? {};
  const wethInterface = new utils.Interface(abis.adventureSepolia)
  const wethL2Interface = new utils.Interface(abis.adventureL2)
  const wethContractAddress = addresses.depositL1
  const wethContractAddressL2 = addresses.depositL2
  const contract = new Contract(wethContractAddress, wethInterface)
  const contractL2 = new Contract(wethContractAddressL2, wethL2Interface)
  const { state: stateDeposit, send: sendDeposit } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' })
  const { state: stateDepositL2, send: sendDepositL2 } = useContractFunction(contractL2, 'deposit', { transactionName: 'Transfer L2' })

  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  const [chainState, setChainState] = React.useState(addresses.depositL1);
  const [selectSource, setSelectSource] = React.useState("sepolia");
  const [targetChainName, setTargetChainName] = React.useState("Adventure Layer");

  const handleChainChange = (event) => {
    // console.log(event)
    setSelectSource(event.target.value);
    const chain = bridgeConfig[event.target.value]
    setChainState(chain.address);
    setTargetChainName(chain.target_text);
  };

  const gasPriceGwei = '15'
  const l1Web3 = new Web3(Sepolia.rpcUrl)
  const l2Web3 = new Web3(AdventureLayer.rpcUrl)

  let l1BalanceAmount = 0
  let l2BalanceAmount = 0
  const [accountBalance, setAccountBalance] = useState({
    l1: l1BalanceAmount,
    l2: l2BalanceAmount,
  })

  const reloadAccountBalance = () => {
    if (account && library) {
      library.getBalance(account).then((val) => {
        // ethers.utils.formatEther();
        const l1BalanceAmount = new Decimal(val.toString()).div(1000000000000000000).toFixed(5);
        setAccountBalance({
          ...accountBalance,
          l1: l1BalanceAmount,
        })
      })
      // const l2Balance = l2Web3.getBalance(account)
      // l2BalanceAmount = ethers.utils.formatEther(l2Balance);
    }
  }
  useEffect(() => {
    reloadAccountBalance()
  }, [account, library])

  const onClickTransfer = async () => {
    console.log({ chainId, transfers: sendAmount });
    if (!account || isNaN(sendAmount)) {
      console.log(account, sendAmount)
      return
    }

    const currentChain = bridgeConfig[selectSource]
    if ((chainId !== currentChain.chainId * 1 && chainId > 0) || (!chainId && selectSource === 'sepolia')) {
      console.log('Switch Chain:', chainId, currentChain.chainId)
      await switchNetwork(currentChain.chainId)
      // .then(() => {
      //   setOpenAlert(true)
      // })
      // setOpenAlert(true)
      // return
    }

    const sendBigAmount = web3.utils.toBigInt(Number(sendAmount) * 1000000000000000000)
    // const gasEstimate = contract.estimateGas['deposit'](account, sendBigAmount, {
    //   value: sendBigAmount,
    // })
    // console.log(gasEstimate, "gasEstimate")
    // return

    console.log('start contract', sendBigAmount, sendAmount);
    try {
      if (addresses.depositL1 === chainState) {
        const nonce = await l1Web3.eth.getTransactionCount(account, 'pending')
        console.log('nonce', nonce, account, sendBigAmount)
        sendDeposit({
          value: sendBigAmount,
          // sender: account,
          // gasLimit: 3e7,
          // nonce: Number(nonce) + 7,
          // gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        }).then(() => {
          reloadAccountBalance()
        })
      } else {
        const nonce = await l2Web3.eth.getTransactionCount(account, 'pending')
        console.log('nonce', wethContractAddressL2, nonce, account, sendBigAmount, {
          value: sendBigAmount,
          // gasLimit: 3e7,
          // nonce: Number(nonce) + 1,
          // gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        })
        sendDepositL2({
          value: sendBigAmount,
          // gasLimit: 3e7,
          // nonce: Number(nonce) + 1,
          // gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
        }).then(() => {
          reloadAccountBalance()
        })
      }
    } catch (e) {
      console.log("error", e)
    }

    // console.log({ sendAmount: sendAmount });
  }

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>

      <div className='right-box'>
        {/* <Row >
          <Col span={12} offset={6}> */}
        <Box
          //  my={4}
          display="flex"
          maxWidth={600}
          alignItems="center"
        //  gap={4}
        //  p={2}
        >
          <div className='content-box'>
            <div className='from_box' >
              <div className='f1'>
                <span>FROM</span>
                <span>Balance: {accountBalance.l1} ETH</span>
              </div>

              <div className='input_box'>
                <div style={{ display: "flex", flexDirection: 'column', width: '100%' }}>
                  <div>
                    <FormControl sx={{ marginBottom: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">Network</InputLabel>
                      <MuiSelect sx={{ color: '#E09657' }}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectSource}
                        label="Transfer Chain"
                        onChange={handleChainChange}
                      >
                        <MenuItem sx={{ color: '#E09657' }} value={"sepolia"}>Sepolia (L1)</MenuItem>
                        <MenuItem sx={{ color: '#E09657' }} value={"adventure"}>Adventure Layer (L2)</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
   
                  <div>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <OutlinedInput sx={{ color: '#E09657' }}
                        id="outlined-adornment-weight"
                        endAdornment={<InputAdornment position="end">ETH</InputAdornment>}
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                          'aria-label': 'weight',
                        }}
                        value={sendAmount}
                        onChange={(e) => {
                          setSendAmount(e.target.value);
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                {/* </Input.Group> */}
              </div>

            </div>

            <div className='to_box'>
              <div className='t1'>
                <span>TO</span>
                <span>Balance: {accountBalance.l2} ETH</span>
              </div>
              <div className='t2'>
                <span>{targetChainName} gas fee 0 ETH</span>
              </div>
            </div>

            <div className='summary_box'>
              <Descriptions  column={1}>
                <Descriptions.Item style={{ display: 'none' }} label="You will pay in gas fees">{gasPriceGwei} Gwei</Descriptions.Item>
                <Descriptions.Item label={`You will receive on ${targetChainName}`}>{sendAmount || 0} ETH</Descriptions.Item>
              </Descriptions>
            </div>

            <div className="btn-box">
            <Button style={{background: "#DC9D50"}} onClick={onClickTransfer} type="primary" size="large" block>
              Move funds to {targetChainName}
            </Button>
            </div>
          </div>
        </Box>
        {/* </Col>
        </Row> */}
      </div>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Switch Your Network to ${bridgeConfig[selectSource].text}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have switch your Network, please click again to submit contract transaction.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>OK</Button>
        </DialogActions>
      </Dialog>


    </div>
  );

};
export default BridgeIndex;