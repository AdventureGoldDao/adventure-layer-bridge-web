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
import { Button, Input } from 'antd';
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
import eth_logo from '../../img/eth_logo.png';
import trans_log from '../../img/trans_logo.png';
import adv_logo from '../../img/adv-logo.png';
// import { styled } from '@mui/material/styles';

import Logo1 from '../../img/Logo_small.svg'; // 导入 SVG 作为组件
import Logo2 from '../../img/Logo_big.svg'; // 导入 SVG 作为组件
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
        <img className='logo' src={Logo1} alt='background' />
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
  color: '#000',
  backgroundColor: '#f39b4b',
  fontSize: '16px',
  fontWeight: '200',
  fontFamily: 'NeueHaasDisplayMediu',
  marginRight: '20px',
  width: 160,
  height: 32,
  '&:hover': {
    backgroundColor: '#F39B4B',
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
    <MuiButton className='connect' variant="contained" size="medium"
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}>
      <div className='connect-btn'>
        {rendered === "" && "Connect"}
        {rendered !== "" && rendered}
      </div>
    </MuiButton>
  );
}

const bridgeConfig = {
  sepolia: {
    address: addresses.depositL1,
    chainId: Sepolia.chainId,
    text: 'Sepolia Layer 1',
    target_text: 'Adventure Layer',
    logo: eth_logo,
    abi: abis['adventureSepolia'],
  },
  adventure: {
    address: addresses.depositL2,
    chainId: AdventureLayer.chainId,
    text: 'Adventure Layer',
    target_text: 'Sepolia Layer 1',
    logo: adv_logo,
    abi: abis['adventureL2'],
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
  const [gasFee, setGasFee] = React.useState("0");
  const [receiveAmount, setReceiveAmount] = React.useState("0");
  const [chainState, setChainState] = React.useState(addresses.depositL1);
  const [selectSource, setSelectSource] = React.useState("sepolia");
  const [selectTarget, setSelectTarget] = React.useState("adventure");
  const [targetChainName, setTargetChainName] = React.useState("Adventure Layer");
  const [sourceChainName, setSourceChainName] = React.useState("Sepolia Layer 1");

  // const handleChainChange = (event) => {
  //   // console.log(event)
  //   setSelectSource(event.target.value);
  //   const chain = bridgeConfig[event.target.value]
  //   setChainState(chain.address);
  //   setTargetChainName(chain.target_text);
  //   setSourceChainName(chain.text);
  // };

  const handleSwitchChain = (event) => {
    let source = 'sepolia'
    let target = 'adventure'
    if (selectSource === 'sepolia') {
      source = 'adventure'
      target = 'sepolia'
    }

    setSelectSource(source);
    setSelectTarget(target);
    const chain = bridgeConfig[source]
    setChainState(chain.address);
    setTargetChainName(chain.target_text);
    setSourceChainName(chain.text);
  }

  const gasPriceGwei = '15'
  const l1Web3 = new Web3(Sepolia.rpcUrl)
  const l2Web3 = new Web3(AdventureLayer.rpcUrl)

  let l1BalanceAmount = 0
  let l2BalanceAmount = 0
  const [accountBalance, setAccountBalance] = useState({
    l1: l1BalanceAmount,
    l2: l2BalanceAmount,
  })

  const reloadAccountBalance = async () => {
    // if (account && library) {
    //   library.getBalance(account).then((val) => {
    //     // ethers.utils.formatEther();
    //     const l1BalanceAmount = new Decimal(val.toString()).div(1000000000000000000).toFixed(5);
    //     setAccountBalance({
    //       ...accountBalance,
    //       l1: l1BalanceAmount,
    //     })
    //   })
    // }
    if (account) {
      try {
        const l1Balance = await l1Web3.eth.getBalance(account)
        // console.log('=============', l1Balance)
        l1BalanceAmount = new Decimal(l1Balance.toString()).div(1000000000000000000).toFixed(5)
        // ethers.utils.formatEther(l1Balance)
      } catch (err) { }

      try {
        const l2Balance = await l2Web3.eth.getBalance(account)
        // console.log('=============', l2Balance)
        l2BalanceAmount = new Decimal(l2Balance.toString()).div(1000000000000000000).toFixed(5)
        // ethers.utils.formatEther(l2Balance)
      } catch (err) { }
      setAccountBalance({
        ...accountBalance,
        l1: l1BalanceAmount,
        l2: l2BalanceAmount,
      })
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

  const handleInputChange = (e) => {
    const inputAmount = e.target.value
    setSendAmount(inputAmount);

    if (Number(inputAmount) <= 0) {
      setGasFee(0)
      setReceiveAmount(0)
      return
    }

    let curWeb3 = l1Web3
    if (selectSource == 'sepolia') {
      curWeb3 = l2Web3
    }
    try {
      // 构建交易数据
      const curContract = new curWeb3.eth.Contract(bridgeConfig[selectSource].abi, chainState)
      const sendBigAmount = web3.utils.toBigInt(Number(inputAmount) * 1000000000000000000)
      const transactionObject = {
        from: account,
        to: chainState,
        data: curContract.methods.deposit({
          value: sendBigAmount,
        }).encodeABI() // yourMethod是你要调用的方法名，params是方法的参数
      };

      // 预估gas
      curWeb3.eth.estimateGas(transactionObject)
        .then((gasPrice) => {
          const gasAmount = new Decimal(gasPrice.toString())
          const transferAmount = new Decimal(inputAmount).mul(1000000000000000000)
          const receiveAmount = transferAmount.sub(gasAmount)
          const showGas = gasAmount.div(1000000000000000000)
          const showReceive = receiveAmount.div(1000000000000000000)

          let gasText = "0"
          if (showGas.toNumber() > 0) {
            gasText = showGas.toFixed(18)
          }
          setGasFee(gasText)
          setReceiveAmount(receiveAmount.div(1000000000000000000).toFixed(18))
          console.log(`预估的gas消耗量为: ${gasPrice}`, gasPrice, receiveAmount);
        })
        .catch((error) => {
          setGasFee(0)
          setReceiveAmount(0)
          console.error(`估算失败: ${error}`);
        });
    } catch (err) {
      console.error(`估算失败: ${err}`);
      curWeb3.eth.getGasPrice().then(gasPrice => {
        const gasAmount = new Decimal(gasPrice.toString())
        const transferAmount = new Decimal(inputAmount).mul(1000000000000000000)
        const receiveAmount = transferAmount.sub(gasAmount)
        
        const showGas = gasAmount.div(1000000000000000000)
        const showReceive = receiveAmount.div(1000000000000000000)

        let gasText = "0"
        if (showGas.greaterThan(new Decimal(0))) {
          gasText = showGas.toFixed(18)
        }
        setGasFee(gasText)
        setReceiveAmount(receiveAmount.div(1000000000000000000).toFixed(18))
        console.log('====>', gasPrice, receiveAmount)
      })
    }
  }

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <div className='right-box'>
        <Box
          display="flex"
          maxWidth={600}
          alignItems="center"
          flexDirection='column'>

          <div className='logoBox'>
            <img className='logo' src={Logo2} alt='background' />
          </div>
          <div className='alb_box'>
            <div className='alb_title'>Adventure Layer Bridge</div>
          </div>
          <div className='content_box'>
            <div className='detail_box'>
              <div className='from_box'>
                <div className='from_select'>
                  <div className='item1'>From</div>
                  <div className='item2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <img src={selectSource && bridgeConfig[selectSource].logo} alt='background' style={{ marginLeft: '13px', width: '22px', height: '22px' }} />
                    <div className='item3'>{sourceChainName}</div>
                  </div>
                </div>

                <div className='send_box'>
                  <div className='send_title'>
                    <div className='send_txt'>Send</div>
                    <div className='send_txt'>Max: {selectSource == 'sepolia' ? accountBalance.l1 : accountBalance.l2} ETH</div>
                  </div>
                  <div className="send_input_box">
                    <Input className='send_custom_input' style={{
                      // width: '90%', 
                      height: '40px',
                      fontSize: '20px',
                      fontWeight: '600',
                      background: '#211a12',
                      fontFamily: 'NeueHaasDisplayMediu',
                      color: '#ffffff',
                      padding: '0px 0px',

                    }}
                      value={sendAmount}
                      placeholder="0"
                      onChange={handleInputChange}
                    />
                    <div className='send_input_logo'>
                      <img src={eth_logo} alt='background' style={{ marginRight: '8px', width: '22px', height: '22px' }} />
                      <div className='eth_txt'>ETH</div>
                    </div>
                  </div>

                </div>
              </div>
              <div className='trans_box'>
                <img src={trans_log} style={{
                  cursor: 'pointer',
                }} alt='trans' onClick={handleSwitchChain} />
              </div>
              <div className='to_box'>
                <div className='to_1'>To</div>
                <div className='to_2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <img src={selectTarget && bridgeConfig[selectTarget].logo} alt='background' style={{ marginLeft: '13px', width: '22px', height: '22px' }} />
                  <div className='to_3' >{targetChainName}</div>
                </div>
              </div>

              <div className='receive_box'>
                <div className='receive_title'>Receive</div>
                <div className='receive_num'>
                  <div className='eth_num'>{receiveAmount}</div>

                  <div className='receive_eth'>
                    <img src={eth_logo} alt='background' style={{ marginRight: '8px', width: '22px', height: '22px' }} />
                    <div className='eth_txt'>ETH</div>
                  </div>
                </div>
                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
              </div>

              {/* <div className='gas'>{targetChainName}gas fee 0 ETH</div> */}
              <div className='gas'>gas fee {gasFee} ETH</div>
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