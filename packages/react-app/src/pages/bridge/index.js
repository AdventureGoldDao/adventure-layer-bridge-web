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
import logo1 from "../../img/agld1.png";
import logo2 from '../../img/agld2.png';
import eth_log01 from '../../img/eth_logo1.png';
import trans_log from '../../img/trans_logo.png';
// import { styled } from '@mui/material/styles';





const pages = ['Faucet', 'Bridge', 'Doc'];
const pageLinks = {
  "Faucet": 'https://faucet.adventurelayer.dev/',
  "Bridge": 'https://bridge.adventurelayer.dev/',
  "Doc": 'https://docs.adventurelayer.dev/',
}


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
  <div className='menuBox'>
    <div className='logoBox'>
      <img className='logo' src={logo1} alt='background' />
    </div>
    <div className='menu'>
      <a className='menuItem' href="https://faucet.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Faucet</a>
      <a className='menuItem' href="https://bridge.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Bridge</a>
      <a className='menuItem' href="https://docs.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Doc</a>
    </div>
    {/* <div className='connect'>
      <div className='Button'>Connect</div>
    </div> */}
    <Box >
    <WalletButton></WalletButton>
    </Box>
  </div>
  );
}

const ConnectButton = styled(MuiButton)(({ theme }) => ({
  color: '#461400',
  backgroundColor: '#f39b4b',
  fontSize: '16px',
  fontWeight: '600',
  marginRight: '20px',
  width: 160,
  height: 32,
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
      {rendered === "" && "Connect"}
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

  }

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <div className='right-box'>
        {/* <Row >
          <Col span={12} offset={6}> */}
        <Box
          display="flex"
          maxWidth={600}
          alignItems="center"
          flexDirection='column'>

          <div className='logoBox'>
            <img className='logo' src={logo2} alt='background' />
          </div>

          <div className='alb_box'>
            <div className='alb_title'>Adventure Layer Bridge</div>
          </div>
          <div className='content_box'>
            <div className='detail_box'>
              {/* <span>Balance: {accountBalance.l1} ETH</span> */}
              <div className='from_box'>
                <div className='from_select'>
                  <div className='txt'>From</div>
                  <div className='select'>
                    <FormControl sx={{ marginBottom: 1, Width: 159 }} size="small">
                      <MuiSelect sx={{ color: '#211a12' }}
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectSource}
                        label="Transfer Chain"
                        onChange={handleChainChange}>
                        <MenuItem sx={{ color: '#211a12' }} value={"sepolia"}>Sepolia (L1)</MenuItem>
                        <MenuItem sx={{ color: '#211a12' }} value={"adventure"}>Adventure Layer (L2)</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>

                <div className='send_box'>
                  <div className='send_title'>
                    <div className='send_txt_1'>Send</div>
                    <div className='send_txt_2'>Max: 148579384 ETH</div>
                  </div>
                  <FormControl sx={{ width: '100%', color: '#fff' }} variant="outlined">
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      endAdornment={<InputAdornment position="end" sx={{ color: '#fff' }}>ETH</InputAdornment>}
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        'aria-label': 'weight', 'color': '#fff'
                      }}
                      value={sendAmount}
                      onChange={(e) => {
                        setSendAmount(e.target.value);
                      }}
                    />
                  </FormControl>
                </div>
              </div>
              <div className='trans_box'>
                <img src={trans_log} alt='trans' />
              </div>
              <div className='to_box'>
                <div className='to_1'>TO</div>
                <div className='to_2'>
                  {/* <div>logo</div> */}
                  <div>Adventure Layer: {accountBalance.l2}</div>
                </div>
              </div>

              <div className='receive_box'>
                <div className='receive_title'>Receive</div>

                <div className='receive_num'>
                  <div>0</div>
                  <div className='receive_eth'>
                    {/* <div></div> */}
                    <img src={eth_log01} alt='background' style={{ marginRight: '10px' }} />
                    <div>ETH</div>
                  </div>
                </div>
                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
              </div>

              <div className='gas'>{targetChainName}gas fee 0 ETH</div>
              {/* <div className='summary_box'>
                <Descriptions column={1}>
                  <Descriptions.Item style={{ display: 'none' }} label="You will pay in gas fees">{gasPriceGwei} Gwei</Descriptions.Item>
                  <Descriptions.Item label={`You will receive on ${targetChainName}`}>{sendAmount || 0} ETH</Descriptions.Item>
                </Descriptions>
              </div> */}

              <div className="btn-box">
                <Button style={{ background: "#f39b4b", fontSize: '16px', color: '#000', fontWeight: '600' }} onClick={onClickTransfer} type="primary" size="large" block>
                  Transfer
                  {/* Transfer {targetChainName} */}
                </Button>
              </div>
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