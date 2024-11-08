import { utils } from 'ethers'
import * as ethers from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Decimal from "decimal.js"

import { Button, Input } from 'antd';
import './index.css';

import Box from '@mui/material/Box';
import MuiMenu from '@mui/material/Menu';
import MuiButton from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addresses, abis } from "@agld-bridge/contracts";
import eth_logo from '../../img/loot.ico';
import trans_log from '../../img/trans_logo.png';

import Logo1 from '../../img/Logo_small.svg';
import Logo2 from '../../img/Logo_big.svg';

import {
  AdventureLayer,
  bridgeConfig,
  fromChainSelect,
  MenuURL,
  BridgeContracts,
} from '../../config'

// Minimal ABI to get ERC-20 Token balance
const minABI = abis.erc20

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

const bridgeAddress = BridgeContracts.bridgeDepositOp
const tokenAddress = BridgeContracts.tokenDepositOp
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
  const gasLimit = 500_000; // Set L1 gas limit
  const address = await signer.getAddress();
  try {
    const tx = await l2BridgeContract.initiateWithdrawal(
        address, // L1 Target Address
        gasLimit, // L1 gas Limit
        '0x',
        { value: amount } // withdraw amount
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
    // Step 1：Batch approval bridge contract transfer token
    console.log('Approving token transfer...');
    const approveTx = await tokenContract.approve(bridgeAddress, ethers.constants.MaxUint256);
    await approveTx.wait();  // wait for token transfer approval
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

  // Init Bridge Contract
  const bridgeContract = new ethers.Contract(bridgeAddress, bridgeAbi, signer);

  const address = await signer.getAddress();
  // Step 2：call bridge contract deposit
  console.log(`Depositing token..., address: ${address}`);
  const depositTx = await bridgeContract.depositERC20Transaction(
      address,
      amount,
      amount,
      500000,
      false,
      []
  );
  await depositTx.wait();  // wait for deposit
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

  const [gasFee, setGasFee] = React.useState("0");
  const [receiveAmount, setReceiveAmount] = React.useState("0");
  const [chainState, setChainState] = React.useState(BridgeContracts.depositL1);
  const [selectSource, setSelectSource] = React.useState("sepolia");
  const [selectTarget, setSelectTarget] = React.useState("adventure");
  const [targetChainName, setTargetChainName] = React.useState("Adventure Layer");
  const [sourceChainName, setSourceChainName] = React.useState("Sepolia Layer 1");
  const [toChainList, setToChainList] = React.useState(['adventure']);

  const [sendAmount, setSendAmount] = useState('');
  const { account, activateBrowserWallet, deactivate, switchNetwork, error, library, chainId } = useEthers();
  const { state: stateDeposit, send: sendDeposit } = useMyContractFunction(selectSource, selectTarget, chainState)

  const [fromWeb3, setFromWeb3] = useState(new Web3(Sepolia.rpcUrl))
  const [toWeb3, setToWeb3] = useState(new Web3(AdventureLayer.rpcUrl))

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
    if (account) {
      try {
        const fromBalance = await getAccountBalance(fromWeb3, selectSource, account)
        fromBalanceAmount = new Decimal(fromBalance.toString()).div(1000000000000000000).toFixed(5)
      } catch (err) { console.error('From:', err) }

      try {
        const toBalance = await getAccountBalance(toWeb3, selectTarget, account)
        toBalanceAmount = new Decimal(toBalance.toString()).div(1000000000000000000).toFixed(5)
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
    if ((chainId !== currentChain.chainId * 1 && chainId > 0) || (!chainId && selectSource === 'sepolia')) {
      console.log('Switch Chain:', chainId, currentChain.chainId)
      await switchNetwork(currentChain.chainId)
    }

    const sendBigAmount = web3.utils.toBigInt(Number(sendAmount) * 1000000000000000000)
    try {
      const nonce = await fromWeb3.eth.getTransactionCount(account, 'pending')
      console.log('nonce', nonce, account, sendBigAmount)
      const signer = await connectWallet();
      if (!signer) return;
      if (selectSource === 'sepolia'){
        await depositTokenToL2(signer, sendBigAmount)
      } else {
        sendDeposit({
          value: sendBigAmount,
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
    try {
      // Build Transaction object
      const curContract = new curWeb3.eth.Contract(bridgeConfig[selectSource].abi, chainState)
      const sendBigAmount = web3.utils.toBigInt(Number(inputAmount) * 1000000000000000000)
      const transactionObject = {
        from: account,
        to: chainState,
        data: curContract.methods.deposit({
          value: sendBigAmount,
        }).encodeABI()
      };

      // Estimate gas
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
          console.log(`Estimated gas: ${gasPrice}`, gasPrice, receiveAmount);
        })
        .catch((error) => {
          setGasFee(0)
          setReceiveAmount(0)
          console.error(`Estimate Fail: ${error}`);
        });
    } catch (err) {
      console.error(`Estimate Fail: ${err}`);
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
                    {fromChainSelect && fromChainSelect.map(item => <MenuItem onClick={() => handleChangeFromChain(item.name)} key={item.name}>{item.text}</MenuItem>)}
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
                  {toChainList && toChainList.map((chain, i) => {
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
              </div>

              <div className='gas'>gas fee {gasFee} AGLD</div>
              <div className="btn-box">
                <Button style={{ background: "#f39b4b", fontSize: '16px', color: '#000', fontWeight: '600' }} onClick={onClickTransfer} type="primary" size="large" block>
                  Transfer
                </Button>
              </div>
            </div>
          </div>
        </Box>
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
