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
// import eth_logo from '../../img/eth_logo.png';
import eth_logo from '../../img/loot.ico';
import trans_log from '../../img/trans_logo.png';
import adv_logo from '../../img/adv-logo.png';
// import { styled } from '@mui/material/styles';

import Logo1 from '../../img/Logo_small.svg'; // 导入 SVG 作为组件
import Logo2 from '../../img/Logo_big.svg'; // 导入 SVG 作为组件

import {
  AdventureLayer,
  AdventureLocal1,
  AdventureLocal2,
  bridgeConfig,
  fromChainSelect,
  MenuURL,
} from '../../config'

// Minimal ABI to get ERC-20 Token balance
const minABI = abis.erc20
// const minABI = [
//   // balanceOf
//   {
//     "constant": true,
//     "inputs": [{ "name": "_owner", "type": "address" }],
//     "name": "balanceOf",
//     "outputs": [{ "name": "balance", "type": "uint256" }],
//     "type": "function"
//   },
// ];

async function getAccountBalance(web3, chain, userAddress) {
  if (bridgeConfig[chain] && bridgeConfig[chain].tokenAddress) {
    return getTokenBalance(web3, bridgeConfig[chain].tokenAddress, userAddress)
  }
  return web3.eth.getBalance(userAddress)
}

async function getTokenBalance(web3, tokenAddress, userAddress) {
  try {
    const contract = new web3.eth.Contract(minABI, tokenAddress);
    // Call the balanceOf method
    const balance = await contract.methods.balanceOf(userAddress).call();
    // console.log(`Balance: ${web3.utils.fromWei(balance, 'ether')}`);
    return balance;
  } catch (error) {
    console.error('An error occurred:', error);
  }
  return 0
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
        <a className='menuItem' href={MenuURL.faucetUrl} target="_blank" rel="noopener noreferrer">Faucet</a>
        <a className='menuItem' href={MenuURL.explorerUrl} target="_blank" rel="noopener noreferrer">Explorer</a>
        <a className='menuItem' href={MenuURL.bridgeUrl} target="_blank" rel="noopener noreferrer">Bridge</a>
        <a className='menuItem' href={MenuURL.docsUrl} target="_blank" rel="noopener noreferrer">Doc</a>
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


async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  } else {
    console.error('MetaMask not found');
    return null;
  }
}

const bridgeAddress = '0x316712e1153b550a155de19c8cc99fb3996446c8';
const tokenAddress = '0x4bff082a07c50724FEce17d9ecFC6dE1FF809722';
async function checkAllowance(signer) {
  const tokenAbi = [
    'function allowance(address owner, address spender) public view returns (uint256)'
  ];
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const userAddress = await signer.getAddress();
  const allowance = await tokenContract.allowance(userAddress, bridgeAddress);
  console.log(`Current allowance: ${ethers.utils.formatUnits(allowance, 18)}`);
  return allowance;
}

async function depositL2ToToken(signer, amount) {
  const l2BridgeAbi = [
    "function initiateWithdrawal(address _target, uint256 _gasLimit, bytes memory _data) public payable"
  ];

  const l2BridgeContract = new ethers.Contract(bridgeAddress, l2BridgeAbi, signer);
  const gasLimit = 500_000; // 设置合理的 L1 gas 限制
  const address = await signer.getAddress();
  try {
    const tx = await l2BridgeContract.initiateWithdrawal(
        address, // L1 目标地址
        gasLimit, // L1 上的 gas 限制
        '0x', // 如果没有特定的合约调用数据，可以设置为空
        { value: amount } // 提现金额
    );
    tx.wait()
    console.log(`Initiated withdrawal. Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error('Error initiating withdrawal:', error);
  }
}


async function depositTokenToL2(signer, amount) {
  const currentAllowance = await checkAllowance(signer, tokenAddress, bridgeAddress);
  if (currentAllowance.lt(amount)) {
    const tokenAbi = [
      'function approve(address spender, uint256 amount) public returns (bool)'
    ];
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    // 步骤 1：批准桥接合约转移代币
    console.log('Approving token transfer...');
    const approveTx = await tokenContract.approve(bridgeAddress, ethers.constants.MaxUint256);
    await approveTx.wait();  // 等待交易确认
    console.log(`Approved transaction hash: ${approveTx.hash}`);
  }

  const bridgeAbi = [
    `function depositERC20Transaction(
        address _to,
        uint256 _mint,
        uint256 _value,
        uint64 _gasLimit,
        bool _isCreation,
        bytes memory _data
    ) public
    `
  ];

  // 实例化桥接合约
  const bridgeContract = new ethers.Contract(bridgeAddress, bridgeAbi, signer);

  const address = await signer.getAddress();
  // 步骤 2：调用桥接合约的存款方法
  console.log(`Depositing token..., address: ${address}`);
  const depositTx = await bridgeContract.depositERC20Transaction(
      address,
      amount,
      amount,
      500000,
      false,
      []
  );
  await depositTx.wait();  // 等待交易确认
  console.log(`Deposit transaction hash: ${depositTx.hash}`);
}


const useMyContractFunction = (chain, target, addr) => {
  const chainConfig = bridgeConfig[chain]
  const address = addr
  const abi = new utils.Interface(chainConfig.abis[target])
  const contract = new Contract(address, abi);
  const { state, send } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' });
  return { state, send };
}

const BridgeIndex = () => {
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);
  const [gasFee, setGasFee] = React.useState("0");
  const [receiveAmount, setReceiveAmount] = React.useState("0");
  const [chainState, setChainState] = React.useState(addresses.depositL1);
  const [selectSource, setSelectSource] = React.useState("sepolia");
  const [selectTarget, setSelectTarget] = React.useState("adventure");
  const [targetChainName, setTargetChainName] = React.useState("Adventure Layer");
  const [sourceChainName, setSourceChainName] = React.useState("Sepolia Layer 1");
  const [toChainList, setToChainList] = React.useState(['adventure']);

  const [sendAmount, setSendAmount] = useState('');
  const { account, activateBrowserWallet, deactivate, switchNetwork, error, library, chainId } = useEthers();
  // const wethInterface = new utils.Interface(abis.adventureSepolia)
  // const wethL2Interface = new utils.Interface(abis.adventureL2)
  // const wethContractAddress = addresses.depositL1
  // const wethContractAddressL2 = addresses.depositL2
  // const contract = new Contract(wethContractAddress, wethInterface)
  // const contractL2 = new Contract(wethContractAddressL2, wethL2Interface)
  // const { state: stateDeposit, send: sendDeposit } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' })
  // const { state: stateDepositL2, send: sendDepositL2 } = useContractFunction(contractL2, 'deposit', { transactionName: 'Transfer L2' })
  const { state: stateDeposit, send: sendDeposit } = useMyContractFunction(selectSource, selectTarget, chainState)

  const gasPriceGwei = '15'
  const [fromWeb3, setFromWeb3] = useState(new Web3(Sepolia.rpcUrl))
  const [toWeb3, setToWeb3] = useState(new Web3(AdventureLayer.rpcUrl))
  // let l1Web3 = new Web3(Sepolia.rpcUrl)
  // let l2Web3 = new Web3(AdventureLayer.rpcUrl)
  // let fromWeb3 = new Web3(Sepolia.rpcUrl)
  // let toWeb3 = new Web3(AdventureLayer.rpcUrl)

  let l1BalanceAmount = 0
  let l2BalanceAmount = 0
  let fromBalanceAmount = 0
  let toBalanceAmount = 0
  const [accountBalance, setAccountBalance] = useState({
    l1: l1BalanceAmount,
    l2: l2BalanceAmount,

    from: fromBalanceAmount,
    to: toBalanceAmount,
  })

  const handleSwitchChain = async (event) => {
    let source = selectTarget
    let target = selectSource
    // if (selectSource === 'sepolia') {
    //   source = 'adventure'
    //   target = 'sepolia'
    // }
    const chain = bridgeConfig[source]
    const chainTarget = bridgeConfig[target]

    let sourceWeb3 = fromWeb3
    let targetWeb3 = toWeb3

    if (chainId !== chain.chainId) {
      const prevTarget = selectTarget
      const prevSource = selectSource
      try {
        setSelectSource(prevTarget)
        setSelectTarget(prevSource)
        await switchNetwork(chain.chainId)
        console.log('Switch chain: ', selectSource, selectTarget)
      } catch (e) {
        setSelectSource(prevSource)
        setSelectTarget(prevTarget)
        return
      }
    }

    setFromWeb3(targetWeb3)
    setToWeb3(sourceWeb3)
    setAccountBalance({
      ...accountBalance,
      from: accountBalance.to,
      to: accountBalance.from,
    })
    setSelectSource(source);
    setSelectTarget(target);
    
    setToChainList(chain.target);

    const address = chain.addresses[target]
    setChainState(address);
    setTargetChainName(chainTarget.text);
    setSourceChainName(chain.text);
  }

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
        // const fromBalance = await fromWeb3.eth.getBalance(account)
        const fromBalance = await getAccountBalance(fromWeb3, selectSource, account)
        fromBalanceAmount = new Decimal(fromBalance.toString()).div(1000000000000000000).toFixed(5)
        // ethers.utils.formatEther(fromBalance)
      } catch (err) { console.error('From:', err) } 

      try {
        // const toBalance = await toWeb3.eth.getBalance(account)
        const toBalance = await getAccountBalance(toWeb3, selectTarget, account)
        toBalanceAmount = new Decimal(toBalance.toString()).div(1000000000000000000).toFixed(5)
        // ethers.utils.formatEther(toBalance)
      } catch (err) { console.error('To:', err) } 
      setAccountBalance({
        ...accountBalance,
        from: fromBalanceAmount,
        to: toBalanceAmount,
      })
    }
  }
  useEffect(() => {
    reloadAccountBalance()
  }, [account, library, fromWeb3, toWeb3])

  const [anchorFromEl, setAnchorFromEl] = React.useState(null);
  const openFromList = Boolean(anchorFromEl);
  const handleClickFromList = (event) => {
    setAnchorFromEl(event.currentTarget);
  };
  const handleCloseFromList = () => {
    setAnchorFromEl(null);
  };
  const handleChangeFromChain = async (chain) => {
    const chainConfig = bridgeConfig[chain]
    let contractAddress = chainConfig.addresses[selectTarget]
    if (chainId !== chainConfig.chainId) {
      const prevTarget = selectTarget
      const prevSource = selectSource
      try {
        setSelectSource(chain)
        if (!contractAddress && chainConfig.target) {
          const target = chainConfig.target[0]
          setSelectTarget(target)
        }
        await switchNetwork(chainConfig.chainId)
      } catch (e) {
        setSelectSource(prevSource)
        setSelectTarget(prevTarget)
        return
      }

    }

    console.log("Change from chain:", chain, selectTarget);
    setAnchorFromEl(null);

    if (!contractAddress && chainConfig.target) {
      const target = chainConfig.target[0]
      contractAddress = chainConfig.addresses[target]
      const targetChain = bridgeConfig[target]
      // console.log(targetChain)
      setSelectTarget(target)
      setTargetChainName(targetChain.text);
      let targetWeb3 = new Web3(targetChain.rpcUrl)
      setToWeb3(targetWeb3)
    } else if (!chainConfig || !contractAddress) {
      alert('Bridge Contract Not Found')
      return
    }
    setSelectSource(chain)
    
    setChainState(contractAddress);
    // setTargetChainName(chainConfig.target_text);
    setToChainList(chainConfig.target);
    setSourceChainName(chainConfig.text);
    let sourceWeb3 = new Web3(chainConfig.rpcUrl)
    setFromWeb3(sourceWeb3)
  };

  const [anchorToEl, setAnchorToEl] = React.useState(null);
  const openToList = Boolean(anchorToEl);
  const handleClickToList = (event) => {
    setAnchorToEl(event.currentTarget);
  };
  const handleCloseToList = () => {
    setAnchorToEl(null);
  };
  const handleChangeToChain = (chain) => {
    console.log("Change to chain:", chain);
    setAnchorToEl(null);

    const chainConfig = bridgeConfig[chain]
    const fromConfig = bridgeConfig[selectSource]
    const contractAddress = fromConfig.addresses[chain]
    if (!contractAddress) {
      alert('Bridge Contract Not Found')
      return
    }
  
    setSelectTarget(chain)
    setChainState(contractAddress);
    // setTargetChainName(chainConfig.target_text);
    setTargetChainName(chainConfig.text);
    let targetWeb3 = new Web3(chainConfig.rpcUrl)
    setToWeb3(targetWeb3)
  };

  const onClickTransfer = async () => {
    console.log({ chainId, transfers: sendAmount });
    if (!account || isNaN(sendAmount)) {
      console.log(account, sendAmount)
      return
    }

    const currentChain = bridgeConfig[selectSource]
    if ((chainId !== currentChain.chainId * 1 && chainId > 0) || !chainId) {
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

    // console.log('start contract', sendBigAmount, sendAmount);
    try {
      const nonce = await fromWeb3.eth.getTransactionCount(account, 'pending')
      console.log('nonce', nonce, account, sendBigAmount)
      const signer = await connectWallet();
      if (!signer) return;
      if (selectSource === 'sepolia'){
        await depositTokenToL2(signer,sendBigAmount)
      } else {
          sendDeposit({
            value: sendBigAmount,
            // sender: account,
            // gasLimit: 3e7,
            // nonce: Number(nonce) + 7,
            // gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
          }).finally((e)=>{
            console.log("error", e)
            return
          })
        }
      await reloadAccountBalance()
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

    let curWeb3 = fromWeb3
    // if (selectSource == 'sepolia') {
    //   curWeb3 = l2Web3
    // }
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
            <div className='alb_title'>Adventure Layer Devnet Bridge</div>
          </div>
          <div className='content_box'>
            <div className='detail_box'>
              <div className='from_box'>
                <div className='from_select'>
                  <div className='item1'>From</div>
                  <div
                    className='item2'
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer' }}
                    onClick={handleClickFromList}
                  >
                    <img src={selectSource && bridgeConfig[selectSource].logo} alt='background' style={{ marginLeft: '13px', width: '22px', height: '22px' }} />
                    <div className='item3'>{sourceChainName}</div>
                  </div>
                  <MuiMenu
                    id="from-menu"
                    anchorEl={anchorFromEl}
                    open={openFromList}
                    onClose={handleCloseFromList}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    {fromChainSelect.map(item => <MenuItem onClick={() => handleChangeFromChain(item.name)} key={item.name}>{item.text}</MenuItem>)}
                  </MuiMenu>
                </div>

                <div className='send_box'>
                  <div className='send_title'>
                    <div className='send_txt'>Send</div>
                    <div className='send_txt'>Max: {accountBalance.from} AGLD</div>
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
                      <div className='eth_txt'>AGLD</div>
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
                <div className='to_2'
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer'  }}
                  onClick={handleClickToList}
                >
                  <img src={selectTarget && bridgeConfig[selectTarget].logo} alt='background' style={{ marginLeft: '13px', width: '22px', height: '22px' }} />
                  <div className='to_3' >{targetChainName}</div>
                </div>
                <MuiMenu
                  id="to-menu"
                  anchorEl={anchorToEl}
                  open={openToList}
                  onClose={handleCloseToList}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {toChainList.map((chain, i) => {
                    const item = bridgeConfig[chain]
                    return <MenuItem onClick={() => handleChangeToChain(chain)} key={`to-${chain}-${i}`}>{item.text}</MenuItem>
                  })}
                </MuiMenu>
              </div>

              <div className='receive_box'>
                <div className='receive_title'>Receive</div>
                <div className='receive_num'>
                  <div className='eth_num'>{receiveAmount}</div>

                  <div className='receive_eth'>
                    <img src={eth_logo} alt='background' style={{ marginRight: '8px', width: '22px', height: '22px' }} />
                    <div className='eth_txt'>AGLD</div>
                  </div>
                </div>
                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
              </div>

              {/* <div className='gas'>{targetChainName}gas fee 0 ETH</div> */}
              <div className='gas'>gas fee {gasFee} AGLD</div>
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