import { utils } from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Decimal from "decimal.js"

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import styles from './index.module.css';

import Box from '@mui/material/Box';

import MuiButton from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { addresses, abis } from "@my-app/contracts";
import eth_logo from '../../img/eth_logo.png';
import adv_logo from '../../img/adv-logo.png';
import trans_log from '../../img/trans_logo.png';
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
                            <a className={styles.MobileMenuItem} href="https://faucet.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Faucet</a>
                            <a className={styles.MobileMenuItem} href="https://bridge.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Bridge</a>
                            <a className={styles.MobileMenuItem} href="https://docs.adventurelayer.dev" target="_blank" rel="noopener noreferrer">Doc</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
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
        <div className={styles.connectBox}  
            onClick={() => {
                if (!account) {
                    activateBrowserWallet();
                } else {
                    deactivate();
                }
            }}>
            <div className={styles.connectBtn}>
                {rendered === "" && "Connect"}
                {rendered !== "" && rendered}
            </div>
        </div>
    );
}

const bridgeConfig = {
    sepolia: {
        address: addresses.depositL1,
        chainId: Sepolia.chainId,
        text: 'Sepolia Layer 1',
        target_text: 'Adventure Layer',
        logo: eth_logo,
    },
    adventure: {
        address: addresses.depositL2,
        chainId: AdventureLayer.chainId,
        text: 'Adventure Layer',
        target_text: 'Sepolia Layer 1',
        logo: adv_logo,
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
    //     // console.log(event)
    //     setSelectSource(event.target.value);
    //     const chain = bridgeConfig[event.target.value]
    //     setChainState(chain.address);
    //     setTargetChainName(chain.target_text);
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
        //     library.getBalance(account).then((val) => {
        //         // ethers.utils.formatEther();
        //         const l1BalanceAmount = new Decimal(val.toString()).div(1000000000000000000).toFixed(5);
        //         setAccountBalance({
        //             ...accountBalance,
        //             l1: l1BalanceAmount,
        //         })
        //     })
        // }
        if (account) {
            try {
                const l1Balance = await l1Web3.eth.getBalance(account)
                //   console.log('=============', l1Balance)
                l1BalanceAmount = new Decimal(l1Balance.toString()).div(1000000000000000000).toFixed(5)
                // ethers.utils.formatEther(l1Balance)
            } catch (err) { }

            try {
                const l2Balance = await l2Web3.eth.getBalance(account)
                //   console.log('=============', l2Balance)
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
                        <div className={styles.alb_title}>Adventure Layer Bridge</div>
                    </div>
                    <div className={styles.content_box}>
                        <div className={styles.detail_box}>
                            <div className={styles.from_box}>
                                <div className={styles.item1}>From</div>
                                <div className={styles.from_select}>
                                    <div className={styles.item2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <img src={selectSource && bridgeConfig[selectSource].logo} alt='background' style={{ marginLeft: '13px', width: '16px', height: '16px' }} />
                                        <div className={styles.item3}>{sourceChainName}</div>
                                    </div>
                                </div>

                                <div className={styles.send_box}>
                                    <div className={styles.send_title}>
                                        <div className={styles.send_txt}>Send</div>
                                        <div className={styles.send_txt}>Max: {selectSource == 'sepolia' ? accountBalance.l1 : accountBalance.l2} ETH</div>
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
                                            background: '#211a12',
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
                                            <div className={styles.mb_eth_txt}>ETH</div>
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
                                <div className={styles.to_2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <div className={styles.to_2_img}>
                                        <img src={selectTarget && bridgeConfig[selectTarget].logo} style={{ marginLeft: '13px', width: '16px', height: '16px' }} alt='background' />
                                    </div>
                                    <div className={styles.to_3} >{targetChainName}</div>
                                </div>
                            </div>

                            <div className={styles.mb_receive_box}>
                                <div className={styles.mb_receive_title}>Receive</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', marginTop: '36px' }} >
                                    <div className={styles.mb_eth_num}>{receiveAmount}</div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={eth_logo} alt='background' style={{ marginRight: '5px', width: '16px', height: '16px' }} />
                                        <div style={{ fontSize: '14px', fontWeight: 600, height: '14px' }} >ETH</div>
                                    </div>
                                </div>
                                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
                            </div>

                            {/* <div className={styles.gas}>{targetChainName}gas fee 0 ETH</div> */}
                            <div className={styles.gas}>gas fee {gasFee} ETH</div>
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