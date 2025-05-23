import { utils } from 'ethers'
import * as ethers from 'ethers'
import web3, { Web3 } from 'web3'
import { shortenAddress } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import Decimal from "decimal.js"

import {
  useAppKit,
  useAppKitProvider,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from '@reown/appkit/react';
import { supportChains } from '../../lib/wallet'

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import styles from './index.module.css';

import Box from '@mui/material/Box';

import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { addresses, abis } from "@my-app/contracts";
import eth_logo from '../../img/loot.ico';
import trans_log from '../../img/trans_logo.png';

import Logo1 from '../../img/Logo_small.svg'; // 导入 SVG 作为组件
import Logo2 from '../../img/Logo_big.svg'; // 导入 SVG 作为组件

import {
  bridgeConfig,
  fromChainSelect,
  MenuURL,
  defaultSourceChain,
} from '../../config'

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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);


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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }


  return (
    <div className={styles.menuBox}>
      <div className={styles.logoBox}>
        <img className={styles.logo} src={Logo1} alt='background' />
      </div>

      <div className={styles.menuRight}>
        {/* <div className={styles.connectBox}>Connect </div> */}
        <WalletButton />
        <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.itemBox}>
              <a className={styles.MobileMenuItem} href={MenuURL.faucetUrl} target="_blank" rel="noopener noreferrer">Faucet</a>
              <a className={styles.MobileMenuItem} href={MenuURL.explorerUrl} target="_blank" rel="noopener noreferrer">Explorer</a>
              <a className={styles.MobileMenuItem} href={MenuURL.bridgeUrl} target="_blank" rel="noopener noreferrer">Bridge</a>
              <a className={styles.MobileMenuItem} href={MenuURL.docsUrl} target="_blank" rel="noopener noreferrer">Doc</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletButton() {

  const { address, isConnected, status } = useAppKitAccount()
  const [rendered, setRendered] = useState("");
  const { open: openWalletModal } = useAppKit()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (isConnected) {
      setRendered(shortenAddress(address))
    } else {
      setRendered('')
    }
  }, [address, isConnected, setRendered]);

  // useEffect(() => {
  //   if (error) {
  //     console.error("Error while connecting wallet:", error.message);
  //   }
  // }, [error]);

  return (
    <div className={styles.connectBox}
      onClick={() => {
        if (!address) {
          // activateBrowserWallet();
          openWalletModal();
        } else {
          // deactivate();
          disconnect();
        }
      }}>
      <div className={styles.connectBtn}>
        {rendered === "" && "Connect"}
        {rendered !== "" && rendered}
      </div>
    </div>
  );
}

async function callTransferContract(signer, source, target, sendBigAmount) {
  const chainConfig = bridgeConfig[source]
  // const contractAddress = chainConfig['address']
  const contractAddress = chainConfig.addresses[target]
  console.log('chainConfig.key', chainConfig.key)
  console.log('target', target)
  //console.log(chainConfig.abis[target])
  const contractAbi = new utils.Interface(chainConfig.abis[target])

  const bridgeContract = new ethers.Contract(contractAddress, contractAbi, signer);

  if (chainConfig.tokenAddress) {
    const tokenAddress = chainConfig.tokenAddress;
    const tokenAbi = minABI;
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    console.log('Approving token transfer...');
    const approveTx = await tokenContract.approve(contractAddress, sendBigAmount);
    await approveTx.wait();
    console.log(`Approved transaction hash: ${approveTx.hash}`);

    const depositTx = await bridgeContract.deposit(sendBigAmount);
    await depositTx.wait();
    console.log(`Deposit transaction hash: ${depositTx.hash}`);
  }else{

    // const address = await signer.getAddress();
    console.log(`Transfer Contract..., address: ${contractAddress}`);
    const depositTx = await bridgeContract.deposit({
      value: sendBigAmount,
    })
    await depositTx.wait();
  }
}

const BridgeIndex = () => {
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const defaultChainKey = defaultSourceChain.key
  const defaultChain = defaultSourceChain

  const defaultTargetKey = defaultSourceChain.target[0]
  const defaultTargetChain = bridgeConfig[defaultTargetKey]

  const { chainId, switchNetwork } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider('eip155')
  const { address, isConnected, status } = useAppKitAccount();

  const [sendAmount, setSendAmount] = useState('');
  // const { account, activateBrowserWallet, deactivate, switchNetwork, error, library, chainId } = useEthers();
  // const wethInterface = new utils.Interface(abis.adventureBridge)
  // const wethL2Interface = new utils.Interface(abis.adventureBridge)
  // const wethContractAddress = addresses.depositL1
  // const wethContractAddressL2 = addresses.depositL2
  // const contract = new Contract(wethContractAddress, wethInterface)
  // const contractL2 = new Contract(wethContractAddressL2, wethL2Interface)
  // const { state: stateDeposit, send: sendDeposit } = useContractFunction(contract, 'deposit', { transactionName: 'Transfer' })
  // const { state: stateDepositL2, send: sendDepositL2 } = useContractFunction(contractL2, 'deposit', { transactionName: 'Transfer L2' })
  // const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  const [gasFee, setGasFee] = React.useState("0");
  const [receiveAmount, setReceiveAmount] = React.useState("0");
  const [chainState, setChainState] = React.useState(addresses.depositL1);
  const [selectSource, setSelectSource] = React.useState(defaultChainKey);
  const [selectTarget, setSelectTarget] = React.useState(defaultTargetKey);
  const [targetChainName, setTargetChainName] = React.useState(defaultTargetChain.text);
  const [sourceChainName, setSourceChainName] = React.useState(defaultChain.text);
  const [toChainList, setToChainList] = React.useState(defaultChain.target);

  // const { state: stateDeposit, send: sendDeposit } = useMyContractFunction(selectSource, selectTarget, chainState)

  const [fromWeb3, setFromWeb3] = useState(new Web3(defaultChain.rpcUrl))
  const [toWeb3, setToWeb3] = useState(new Web3(defaultTargetChain.rpcUrl))

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

        // await switchNetwork(chain.chainId)
        switchNetwork(supportChains[source])
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

  const gasPriceGwei = '15'

  const reloadAccountBalance = async () => {
    if (address) {
      try {
        // const fromBalance = await fromWeb3.eth.getBalance(account)
        const fromBalance = await getAccountBalance(fromWeb3, selectSource, address)
        fromBalanceAmount = new Decimal(fromBalance.toString()).div(1000000000000000000).toFixed(5)
        // ethers.utils.formatEther(fromBalance)
      } catch (err) { console.error('From:', err) }

      try {
        // const toBalance = await toWeb3.eth.getBalance(account)
        const toBalance = await getAccountBalance(toWeb3, selectTarget, address)
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
  }, [address, fromWeb3, toWeb3])

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
        // await switchNetwork(chainConfig.chainId)
        console.log('Switch chain: ', chain, selectSource, selectTarget)
        switchNetwork(supportChains[chain])
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
    if (!address || isNaN(sendAmount)) {
      console.log(address, sendAmount)
      return
    }

    const currentChain = bridgeConfig[selectSource]
    if ((chainId !== currentChain.chainId * 1 && chainId > 0) || !chainId) {
      console.log('Switch Chain:', chainId, currentChain.chainId)
      switchNetwork(supportChains[selectSource])
      // await switchNetwork(currentChain.chainId)
      // .then(() => {
      //   setOpenAlert(true)
      // })
      setOpenAlert(true)
      return
    }

    const sendBigAmount = web3.utils.toBigInt(Number(sendAmount) * 1000000000000000000)

    console.log('start contract', sendBigAmount, sendAmount);
    try {
      const nonce = await fromWeb3.eth.getTransactionCount(address, 'pending')
      console.log('nonce', nonce, address, sendBigAmount)
      const provider = new ethers.providers.Web3Provider(walletProvider, chainId)
      const signer = provider.getSigner(address)
      // const signer = await connectWallet();
      if (!signer) return;

      callTransferContract(signer, selectSource, selectTarget, sendBigAmount).then(() => {
        reloadAccountBalance()
      })
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
      // 构建交易数据
      const curContract = new curWeb3.eth.Contract(bridgeConfig[selectSource].abi, chainState)
      const sendBigAmount = web3.utils.toBigInt(Number(inputAmount) * 1000000000000000000)
      const transactionObject = {
        from: address,
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
          //setReceiveAmount(receiveAmount.div(1000000000000000000).toFixed(18))
          setReceiveAmount(inputAmount);
          console.log(`Estimate gas consume: ${gasPrice}`, gasPrice, receiveAmount);
        })
        .catch((error) => {
          setGasFee(0)
          setReceiveAmount(0)
          console.error(`estimate fail: ${error}`);
        });
    } catch (err) {
      console.error(`estimate fail: ${err}`);
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
        //setReceiveAmount(receiveAmount.div(1000000000000000000).toFixed(18))
        setReceiveAmount(inputAmount)
        console.log('====>', gasPrice, receiveAmount)
      })
    }
  }

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <div className={styles.rightBox}>
        <Box
          display="flex"
          maxWidth={600}
          alignItems="center"
          flexDirection='column'>

          <div className={styles.logoBox}>
            <img className={styles.logo} src={Logo2} alt='background' />
          </div>
          <div className={styles.alb_box}>
            <div className={styles.alb_title}>Adventure Layer Devnet Bridge</div>
          </div>
          <div className={styles.content_box}>
            <div className={styles.detail_box}>
              <div className={styles.from_box}>
                <div className={styles.item1}>From</div>
                <div className={styles.from_select}>
                  <div className={styles.item2}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer' }}
                    onClick={handleClickFromList}
                  >
                    <img src={selectSource && bridgeConfig[selectSource].logo} alt='background' style={{ marginLeft: '13px', width: '16px', height: '16px' }} />
                    <div className={styles.item3}>{sourceChainName}</div>
                  </div>
                  <MuiMenu
                    id="mobile-from-menu"
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

                <div className={styles.send_box}>
                  <div className={styles.send_title}>
                    <div className={styles.send_txt}>Send</div>
                    <div className={styles.send_txt}>Max: {accountBalance.from} AGLD</div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    fontFamily: 'Neue Haas Grotesk Display Pro',
                    marginTop: '36px'
                  }}>

                    <Input className={styles.mb_send_custom_input} style={{
                      background: '#211a12',
                      borderColor: "#211a12",
                      fontSize: '24px',
                      fontWeight: '600',
                      fontFamily: 'NeueHaasDisplayMediu',
                      color: '#ffffff',
                      padding: '0px 0px',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                      value={sendAmount}
                      placeholder="0"
                      onChange={handleInputChange} />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <img src={eth_logo} alt='background' style={{ marginRight: '5px', width: '16px', height: '16px' }} />
                      <div className={styles.mb_eth_txt}>AGLD1</div>
                    </div>
                  </div>

                </div>
              </div>
              <div className={styles.trans_box}>
                <img src={trans_log} alt='trans' style={{
                  cursor: 'pointer',
                }} onClick={handleSwitchChain} />
              </div>
              <div className={styles.to_box}>
                <div className={styles.to_1}>To</div>
                <div className={styles.to_2}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer' }}
                  onClick={handleClickToList}
                >
                  <div className={styles.to_2_img}>
                    <img src={selectTarget && bridgeConfig[selectTarget].logo} style={{ marginLeft: '13px', width: '16px', height: '16px' }} alt='background' />
                  </div>
                  <div className={styles.to_3} >{targetChainName}</div>
                </div>
                <MuiMenu
                  id="mobile-to-menu"
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

              <div className={styles.mb_receive_box}>
                <div className={styles.mb_receive_title}>Receive</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', marginTop: '36px' }} >
                  <div className={styles.mb_eth_num}>{receiveAmount}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={eth_logo} alt='background' style={{ marginRight: '5px', width: '16px', height: '16px' }} />
                    <div style={{ fontSize: '14px', fontWeight: 600, height: '14px' }} >AGLD</div>
                  </div>
                </div>
                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
              </div>

              {/* <div className={styles.gas}>{targetChainName}gas fee 0 ETH</div> */}
              <div className={styles.gas}>gas fee {gasFee} AGLD</div>
              <div className={styles.btnBox}>
                <Button style={{ background: "#f39b4b", fontSize: '16px', color: '#000', fontWeight: '600' }} onClick={onClickTransfer} type="primary" size="large" block>
                  Transfer
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