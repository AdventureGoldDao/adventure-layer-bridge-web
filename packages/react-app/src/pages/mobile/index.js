import { useQuery } from "@apollo/client";
import { utils } from 'ethers'
import * as ethers from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Decimal from "decimal.js"

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import styles from './index.module.css';

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
import adv_logo from '../../img/adv-logo.png';
import trans_log from '../../img/trans_logo.png';
// import { styled } from '@mui/material/styles';

import Logo1 from '../../img/Logo_small.svg'; // 导入 SVG 作为组件
import Logo2 from '../../img/Logo_big.svg'; // 导入 SVG 作为组件

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
                            {/* <span>Balance: {accountBalance.l1} ETH</span> */}
                            <div className={styles.from_box}>
                                <div className={styles.item1}>From</div>
                                <div className={styles.from_select}>
                                    <div className={styles.item2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <img src={eth_logo} alt='background' style={{ marginLeft: '13px', width: '16px', height: '16px' }} />
                                        <div className={styles.item3}>Sepolia  Layer 1</div>
                                    </div>
                                    {/* <div className={styles.select'>
                                        <FormControl sx={{ marginBottom: 1, Width: 159 }} size="small">
                                        <MuiSelect sx={{ color: '#fff' }}
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={selectSource}
                                            label="Transfer Chain"
                                            onChange={handleChainChange}>
                                            <MenuItem sx={{ color: '#211a12' }} value={"sepolia"}>Sepolia (L1)</MenuItem>
                                            <MenuItem sx={{ color: '#211a12' }} value={"adventure"}>Adventure Layer (L2)</MenuItem>
                                        </MuiSelect>
                                        </FormControl>
                                    </div> */}
                                </div>

                                <div className={styles.send_box}>
                                    <div className={styles.send_title}>
                                        <div className={styles.send_txt}>Send</div>
                                        <div className={styles.send_txt}>Max: {accountBalance.l1} ETH</div>
                                    </div>
                                    {/* <FormControl sx={{ width: '100%', color: '#fff', }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            endAdornment={
                                                <div className={styles.send_eth}>
                                                    <img src={eth_logo} alt='background' style={{ width: '16px', height: '16px' }} />
                                                    <InputAdornment position="end" sx={{ color: '#fff' }}><span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>ETH</span></InputAdornment></div>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight', 'color': '#fff'
                                            }}
                                            value={sendAmount}
                                            onChange={(e) => {
                                                setSendAmount(e.target.value);
                                            }}
                                        />
                                    </FormControl> */}

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
                                            onChange={(e) => {
                                                setSendAmount(e.target.value);
                                            }} />
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <img src={eth_logo} alt='background' style={{ marginRight: '5px', width: '16px', height: '16px' }} />
                                            <div className={styles.mb_eth_txt}>ETH</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className={styles.trans_box}>
                                <img src={trans_log} alt='trans' />
                            </div>
                            <div className={styles.to_box}>
                                <div className={styles.to_1}>To</div>
                                <div className={styles.to_2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <div className={styles.to_2_img}>
                                        <img src={adv_logo} style={{ marginLeft: '13px', width: '16px', height: '16px' }} alt='background' />
                                    </div>
                                    <div className={styles.to_3} >Adventure Layer</div>
                                </div>
                            </div>

                            <div className={styles.mb_receive_box}>
                                <div className={styles.mb_receive_title}>Receive</div>
                                {/* <div className={styles.mb_receive_num} > */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', marginTop: '36px' }} >
                                    <div className={styles.mb_eth_num}>0</div>
                                    {/* <div  className={styles.mb_logo_box}> */}
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={eth_logo} alt='background' style={{ marginRight: '5px', width: '16px', height: '16px' }} />
                                        <div style={{ fontSize: '14px', fontWeight: 600, height: '14px' }} >ETH</div>
                                    </div>
                                </div>
                                {/* <span>{targetChainName} gas fee 0 ETH</span> */}
                            </div>

                            {/* <div className={styles.gas}>{targetChainName}gas fee 0 ETH</div> */}
                            <div className={styles.gas}>gas fee 0 ETH</div>
                            <div className={styles.btnBox}>
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