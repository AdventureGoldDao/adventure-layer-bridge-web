import { useQuery } from "@apollo/client";
import { utils } from 'ethers'
import * as ethers from 'ethers'
import web3, { Web3 } from 'web3'
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useContractFunction, useEthers, useLookupAddress, Sepolia } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Decimal from "decimal.js"

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Row, Col, Button, Flex, Menu, Descriptions, Select, Input, Card } from 'antd';
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

// import { Button as SimpleButton } from "../../components";

import { addresses, abis } from "@my-app/contracts";

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

// const ConnectButton = styled(MuiButton)(({ theme }) => ({
//   color: theme.palette.getContrastText(purple[500]),
//   backgroundColor: purple[500],
//   '&:hover': {
//     backgroundColor: purple[700],
//   },
// }));

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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <SvgIcon sx={{ display: { xs: 'none', md: 'flex' }, width: '100px', mr: 1 }}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
              width="100%" height="100%"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path d="M0 0 C1.96549805 -0.01740234 1.96549805 -0.01740234 3.97070312 -0.03515625 C17.84043684 0.00634919 31.40670849 2.44021448 41.75 12.3125 C45.40714442 16.22823039 48.3125 19.83260763 48.3125 25.375 C43.98008789 25.60889268 39.64931072 25.74994264 35.3125 25.875 C34.09175781 25.94203125 32.87101562 26.0090625 31.61328125 26.078125 C22.60379397 26.27292473 22.60379397 26.27292473 18.84570312 23.65966797 C16.78125 21.5234375 16.78125 21.5234375 14.9453125 19.32128906 C12.87264493 16.85069907 10.77401427 15.72207065 7.8125 14.5 C6.9565625 14.13132812 6.100625 13.76265625 5.21875 13.3828125 C-13.1145858 7.02528476 -33.89943058 9.03349474 -51.24047852 17.37109375 C-55.44208376 19.47021438 -59.55751325 21.65336708 -63.51953125 24.18359375 C-64.23496094 24.57675781 -64.95039062 24.96992188 -65.6875 25.375 C-66.3475 25.045 -67.0075 24.715 -67.6875 24.375 C-49.13472089 6.4387785 -25.28513464 -0.22587217 0 0 Z " fill="#FFFFFF" transform="translate(136.6875,-0.375)"/>
              <path d="M0 0 C0.66 0 1.32 0 2 0 C3.19140625 1.5390625 3.19140625 1.5390625 4.5625 3.625 C10.66588799 11.99493741 19.09837232 15.34961077 28.875 17.6875 C45.978702 19.3978702 60.33171221 15.61441839 75 7 C75.66 6.34 76.32 5.68 77 5 C78.87939453 4.77294922 78.87939453 4.77294922 81.1328125 4.8046875 C81.93847656 4.81113281 82.74414062 4.81757812 83.57421875 4.82421875 C84.83685547 4.84935547 84.83685547 4.84935547 86.125 4.875 C87.39923828 4.88853516 87.39923828 4.88853516 88.69921875 4.90234375 C90.79959884 4.92594353 92.89983444 4.96181517 95 5 C91.21447523 13.8013451 80.38175852 17.81455044 72.046875 21.19921875 C63.21142405 24.1272461 54.62532642 24.41739211 45.375 24.5 C44.16030029 24.51844971 42.94560059 24.53689941 41.6940918 24.5559082 C28.34292236 24.46466603 16.88402086 21.23975241 7 12 C0 3.64397906 0 3.64397906 0 0 Z " fill="#FFFFFF" transform="translate(65,73)"/>
              <path d="M0 0 C1.98 0 3.96 0 6 0 C6 6.27 6 12.54 6 19 C8.97 19 11.94 19 15 19 C15.37125 17.824375 15.37125 17.824375 15.75 16.625 C17 14 17 14 18.875 12.6875 C21 12 21 12 25 12 C25 11.34 25 10.68 25 10 C22.69 10.33 20.38 10.66 18 11 C17.67 9.35 17.34 7.7 17 6 C19.32686453 4.83656773 20.84721413 4.80104012 23.4375 4.75 C24.61119141 4.71132813 24.61119141 4.71132813 25.80859375 4.671875 C28 5 28 5 29.74609375 6.13671875 C31.51345821 8.76298931 31.48005923 10.92338816 31.625 14.0625 C31.72079272 18.18480277 31.72079272 18.18480277 33 22 C32.505 23.485 32.505 23.485 32 25 C31.030625 24.814375 30.06125 24.62875 29.0625 24.4375 C28.051875 24.293125 27.04125 24.14875 26 24 C25.67 24.33 25.34 24.66 25 25 C20.96839809 25.26293056 19.44107266 25.29404844 16 23 C15.67 23.33 15.34 23.66 15 24 C12.4672235 24.07320163 9.96896082 24.09227569 7.4375 24.0625 C4.983125 24.041875 2.52875 24.02125 0 24 C0 16.08 0 8.16 0 0 Z M23 16 C22.01 17.485 22.01 17.485 21 19 C22.32 19.33 23.64 19.66 25 20 C25 18.68 25 17.36 25 16 C24.34 16 23.68 16 23 16 Z " fill="#FFFFFF" transform="translate(168,40)"/>
              <path d="M0 0 C1.98 0 3.96 0 6 0 C6 8.58 6 17.16 6 26 C4.02 26 2.04 26 0 26 C-0.33 26.33 -0.66 26.66 -1 27 C-3.8125 27.375 -3.8125 27.375 -7 27 C-9.7722895 24.81135039 -10.8068385 23.10120108 -11.41796875 19.6171875 C-11.67070966 15.04052774 -11.49088544 12.70126491 -8.8125 8.875 C-5.81690334 6.87793556 -4.51088794 6.49844458 -1 7 C-0.67 4.69 -0.34 2.38 0 0 Z M-4 12 C-5.20561184 12.98267859 -5.20561184 12.98267859 -5.09765625 14.84765625 C-5.08605469 15.57855469 -5.07445312 16.30945313 -5.0625 17.0625 C-5.041875 18.361875 -5.02125 19.66125 -5 21 C-3.05396726 21.59070014 -3.05396726 21.59070014 -1 22 C0.23267348 20.99163938 0.23267348 20.99163938 0.09765625 18.93359375 C0.08605469 18.10988281 0.07445312 17.28617188 0.0625 16.4375 C0.05347656 15.61121094 0.04445313 14.78492188 0.03515625 13.93359375 C0.02355469 13.29550781 0.01195312 12.65742187 0 12 C-1.32 12 -2.64 12 -4 12 Z " fill="#FFFFFF" transform="translate(32,38)"/>
              <path d="M0 0 C1.134375 0.020625 2.26875 0.04125 3.4375 0.0625 C4.63941984 3.66202042 5.82152448 7.26774257 7 10.875 C7.51336914 12.41124023 7.51336914 12.41124023 8.03710938 13.97851562 C8.35615234 14.96142578 8.67519531 15.94433594 9.00390625 16.95703125 C9.30240479 17.86300049 9.60090332 18.76896973 9.90844727 19.70239258 C10.4375 22.0625 10.4375 22.0625 9.4375 25.0625 C7.4575 24.7325 5.4775 24.4025 3.4375 24.0625 C3.1075 22.7425 2.7775 21.4225 2.4375 20.0625 C0.4575 19.7325 -1.5225 19.4025 -3.5625 19.0625 C-3.8925 20.7125 -4.2225 22.3625 -4.5625 24.0625 C-6.5425 24.3925 -8.5225 24.7225 -10.5625 25.0625 C-9.99208936 19.30005617 -8.85566462 14.12233041 -7.0625 8.625 C-6.83691406 7.90634766 -6.61132812 7.18769531 -6.37890625 6.44726562 C-4.34547103 0.07623633 -4.34547103 0.07623633 0 0 Z M-0.5625 8.0625 C-0.8925 10.0425 -1.2225 12.0225 -1.5625 14.0625 C-0.5725 14.0625 0.4175 14.0625 1.4375 14.0625 C1.1075 12.0825 0.7775 10.1025 0.4375 8.0625 C0.1075 8.0625 -0.2225 8.0625 -0.5625 8.0625 Z " fill="#FFFFFF" transform="translate(10.5625,39.9375)"/>
              <path d="M0 0 C1.98 0 3.96 0 6 0 C7.32 3.3 8.64 6.6 10 10 C10.99 6.7 11.98 3.4 13 0 C14.98 0 16.96 0 19 0 C15.22078249 19.92678324 15.22078249 19.92678324 10.0390625 24.87109375 C7.40963657 26.32684872 4.96566616 26.66299248 2 27 C2 25.35 2 23.7 2 22 C3.65 21.67 5.3 21.34 7 21 C6.66226563 20.154375 6.32453125 19.30875 5.9765625 18.4375 C3.57803795 12.33720636 1.38270898 6.41074164 0 0 Z " fill="#FFFFFF" transform="translate(200,45)"/>
              <path d="M0 0 C1.66611905 -0.042721 3.33382885 -0.04063832 5 0 C6 1 6 1 6.09765625 4.16015625 C6.08605469 5.44792969 6.07445313 6.73570313 6.0625 8.0625 C6.05347656 9.35285156 6.04445313 10.64320312 6.03515625 11.97265625 C6.02355469 12.97167969 6.01195313 13.97070312 6 15 C6.99 15 7.98 15 9 15 C8.98839844 14.00097656 8.97679688 13.00195312 8.96484375 11.97265625 C8.95582031 10.68230469 8.94679688 9.39195313 8.9375 8.0625 C8.92589844 6.77472656 8.91429688 5.48695312 8.90234375 4.16015625 C9 1 9 1 10 0 C12.5 -0.125 12.5 -0.125 15 0 C16 1 16 1 16.11352539 2.76586914 C16.10828857 3.51473389 16.10305176 4.26359863 16.09765625 5.03515625 C16.09443359 5.84404297 16.09121094 6.65292969 16.08789062 7.48632812 C16.07951172 8.33646484 16.07113281 9.18660156 16.0625 10.0625 C16.05798828 10.91650391 16.05347656 11.77050781 16.04882812 12.65039062 C16.03700373 14.76695663 16.01906769 16.88348685 16 19 C14.865625 18.979375 13.73125 18.95875 12.5625 18.9375 C9.18424326 18.58422523 9.18424326 18.58422523 8 20 C1.28 19.28 1.28 19.28 0 18 C-0.08631874 16.65732587 -0.10706473 15.31025678 -0.09765625 13.96484375 C-0.09443359 13.15595703 -0.09121094 12.34707031 -0.08789062 11.51367188 C-0.07951172 10.66353516 -0.07113281 9.81339844 -0.0625 8.9375 C-0.05798828 8.08349609 -0.05347656 7.22949219 -0.04882812 6.34960938 C-0.03700373 4.23304337 -0.01906769 2.11651315 0 0 Z " fill="#FFFFFF" transform="translate(109,45)"/>
              <path d="M0 0 C2.375 1.5 2.375 1.5 4 4 C4.60891847 6.70401084 4.81444126 9.21661895 5 12 C1.37 12 -2.26 12 -6 12 C-5.67 12.66 -5.34 13.32 -5 14 C-2.36 14 0.28 14 3 14 C3.33 15.32 3.66 16.64 4 18 C0.33755697 20.34396354 -2.72394153 20.52512999 -7 20 C-10.22287355 17.61787607 -11.68331921 15.91045728 -13 12.125 C-13 8.09693738 -11.89929459 5.52726138 -10 2 C-6.2794164 -0.48038907 -4.40203429 -0.46337203 0 0 Z M-6 5 C-6 5.99 -6 6.98 -6 8 C-4.35 8 -2.7 8 -1 8 C-1.66 6.68 -2.32 5.36 -3 4 C-4.2236068 3.9254644 -4.2236068 3.9254644 -6 5 Z " fill="#FFFFFF" transform="translate(70,45)"/>
              <path d="M0 0 C4.43024874 0.87022743 5.91370196 2.00398461 8.5 5.6875 C8.8125 9.5 8.8125 9.5 8.5 12.6875 C5.2 13.0175 1.9 13.3475 -1.5 13.6875 C-1.5 14.3475 -1.5 15.0075 -1.5 15.6875 C1.14 15.3575 3.78 15.0275 6.5 14.6875 C6.83 16.0075 7.16 17.3275 7.5 18.6875 C3.7626144 21.1790904 1.92668417 21.14543285 -2.5 20.6875 C-5.25329021 18.89187595 -7.02627461 17.63495078 -8.5 14.6875 C-8.95690679 10.11843211 -9.19691391 6.98734867 -6.4375 3.1875 C-3.5 0.6875 -3.5 0.6875 0 0 Z M-0.5 4.6875 C-1.16 6.0075 -1.82 7.3275 -2.5 8.6875 C-0.85 8.6875 0.8 8.6875 2.5 8.6875 C2.5 7.6975 2.5 6.7075 2.5 5.6875 C1.51 5.3575 0.52 5.0275 -0.5 4.6875 Z " fill="#FFFFFF" transform="translate(227.5,44.3125)"/>
              <path d="M0 0 C4.43024874 0.87022743 5.91370196 2.00398461 8.5 5.6875 C8.8125 9.5 8.8125 9.5 8.5 12.6875 C5.2 13.0175 1.9 13.3475 -1.5 13.6875 C-1.5 14.3475 -1.5 15.0075 -1.5 15.6875 C1.14 15.3575 3.78 15.0275 6.5 14.6875 C6.83 16.0075 7.16 17.3275 7.5 18.6875 C3.7626144 21.1790904 1.92668417 21.14543285 -2.5 20.6875 C-5.25329021 18.89187595 -7.02627461 17.63495078 -8.5 14.6875 C-8.95690679 10.11843211 -9.19691391 6.98734867 -6.4375 3.1875 C-3.5 0.6875 -3.5 0.6875 0 0 Z M-0.5 4.6875 C-1.16 6.0075 -1.82 7.3275 -2.5 8.6875 C-0.85 8.6875 0.8 8.6875 2.5 8.6875 C2.17 7.3675 1.84 6.0475 1.5 4.6875 C0.84 4.6875 0.18 4.6875 -0.5 4.6875 Z " fill="#FFFFFF" transform="translate(148.5,44.3125)"/>
              <path d="M0 0 C2.66666667 0 5.33333333 0 8 0 C9.2375 -0.0928125 9.2375 -0.0928125 10.5 -0.1875 C13 0 13 0 14.64453125 1 C16.78437512 4.15734888 16.31254319 7.51636025 16.1875 11.1875 C16.16719727 12.31188477 16.16719727 12.31188477 16.14648438 13.45898438 C16.11118539 15.30629767 16.05737917 17.15324066 16 19 C14.02 19 12.04 19 10 19 C10 14.38 10 9.76 10 5 C9.01 5.33 8.02 5.66 7 6 C6.67 10.29 6.34 14.58 6 19 C4.02 19 2.04 19 0 19 C0 12.73 0 6.46 0 0 Z " fill="#FFFFFF" transform="translate(77,45)"/>
              <path d="M0 0 C1.98 0 3.96 0 6 0 C6.99 2.97 7.98 5.94 9 9 C10.32 6.03 11.64 3.06 13 0 C14.98 0 16.96 0 19 0 C18.18979911 2.79235287 17.3769488 5.58388621 16.5625 8.375 C16.33240234 9.1690625 16.10230469 9.963125 15.86523438 10.78125 C15.64287109 11.54179688 15.42050781 12.30234375 15.19140625 13.0859375 C14.98717041 13.7876709 14.78293457 14.4894043 14.57250977 15.21240234 C14 17 14 17 13 19 C10.69 19 8.38 19 6 19 C3.53062327 12.7677635 1.6813917 6.48707154 0 0 Z " fill="#FFFFFF" transform="translate(39,45)"/>
              <path d="M0 0 C1.65 0 3.3 0 5 0 C5.33 1.32 5.66 2.64 6 4 C6.99 4 7.98 4 9 4 C8.67 5.65 8.34 7.3 8 9 C7.01 9 6.02 9 5 9 C5 12.3 5 15.6 5 19 C6.32 18.67 7.64 18.34 9 18 C9.33 19.65 9.66 21.3 10 23 C7.20129973 24.39935013 5.09501208 24.25265405 2 24 C0.3203125 22.87109375 0.3203125 22.87109375 -1 21 C-1.29296875 18.08203125 -1.29296875 18.08203125 -1.1875 14.8125 C-1.16042969 13.72582031 -1.13335937 12.63914062 -1.10546875 11.51953125 C-1.07066406 10.68808594 -1.03585938 9.85664062 -1 9 C-1.99 9 -2.98 9 -4 9 C-4 7.35 -4 5.7 -4 4 C-3.34 4 -2.68 4 -2 4 C-1.34 2.68 -0.68 1.36 0 0 Z " fill="#FFFFFF" transform="translate(98,41)"/>
              <path d="M0 0 C0.9075 0.165 1.815 0.33 2.75 0.5 C5.91372977 0.98672766 7.94173339 0.80954116 11 0 C11 1.98 11 3.96 11 6 C10.360625 6.12375 9.72125 6.2475 9.0625 6.375 C8.381875 6.58125 7.70125 6.7875 7 7 C5.78306124 9.43387753 5.68040104 11.41838846 5.4375 14.125 C5.35371094 15.03507812 5.26992187 15.94515625 5.18359375 16.8828125 C5.12300781 17.58148438 5.06242188 18.28015625 5 19 C3.02 19 1.04 19 -1 19 C-1.02683987 16.02077407 -1.04676037 13.04178705 -1.0625 10.0625 C-1.07087891 9.21236328 -1.07925781 8.36222656 -1.08789062 7.48632812 C-1.09111328 6.67744141 -1.09433594 5.86855469 -1.09765625 5.03515625 C-1.10289307 4.2862915 -1.10812988 3.53742676 -1.11352539 2.76586914 C-1 1 -1 1 0 0 Z " fill="#FFFFFF" transform="translate(239,45)"/>
              <path d="M0 0 C4 0 8 0 12 0 C11.67 1.98 11.34 3.96 11 6 C9.68 6 8.36 6 7 6 C6.67 10.29 6.34 14.58 6 19 C4.02 19 2.04 19 0 19 C0 12.73 0 6.46 0 0 Z " fill="#FFFFFF" transform="translate(128,45)"/>
              <path d="M0 0 C0.66 0 1.32 0 2 0 C2.2475 0.804375 2.495 1.60875 2.75 2.4375 C3.72238859 5.171081 3.72238859 5.171081 6.125 5.8125 C7.053125 5.9053125 7.053125 5.9053125 8 6 C7.67 6.99 7.34 7.98 7 9 C6.34 9.309375 5.68 9.61875 5 9.9375 C2.79394438 10.82027141 2.79394438 10.82027141 2.25 13.125 C2.1675 13.74375 2.085 14.3625 2 15 C1.01 14.67 0.02 14.34 -1 14 C-1.309375 13.360625 -1.61875 12.72125 -1.9375 12.0625 C-3.2342338 9.54531085 -4.4221737 9.03113052 -7 8 C-6 6 -6 6 -4.0625 5.125 C-1.57998766 3.77090236 -1.03128603 2.57821507 0 0 Z " fill="#FFFFFF" transform="translate(64,11)"/>
            </svg>
          </SvgIcon> */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Bridge
          </Typography>

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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <MuiLink href={pageLinks[page]} underline="none">
                      {page}
                    </MuiLink>
                  </Typography>
                </MenuItem>
              ))}
            </MuiMenu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Bridge
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <MuiButton
                key={page}
                href={pageLinks[page]}
                // onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </MuiButton>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <MuiButton variant="contained" size="medium">
              Connect
            </MuiButton> */}
            <WalletButton></WalletButton>
            {/* <ConnectButton>Primary</ConnectButton> */}
          </Box>


          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <MuiMenu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </MuiMenu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
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
    <MuiButton variant="contained" size="medium"
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}>
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </MuiButton>
    // <SimpleButton
    //   onClick={() => {
    //     if (!account) {
    //       activateBrowserWallet();
    //     } else {
    //       deactivate();
    //     }
    //   }}
    // >
    //   {rendered === "" && "Connect Wallet"}
    //   {rendered !== "" && rendered}
    // </SimpleButton>
  );
}

const items = [
  {
    key: 'bridge',
    label: 'Bridge',
    icon: <AppstoreOutlined />,
  },
  {
    type: 'divider',
  },
];

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

  // useEffect(() => {
  //   if (subgraphQueryError) {
  //     console.error("Error while querying subgraph:", subgraphQueryError.message);
  //     return;
  //   }
  //   if (!loading && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, subgraphQueryError, data]);

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
        sendDepositL2(account, sendBigAmount, {
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
          {/* <Card>
            <p>See transaction history</p>
          </Card> */}

          <div className='content-box'>
            <Alert variant="outlined" severity="info">See transaction history</Alert>

            <div className='from_box' >
              <div className='f1'>
                <span>FROM</span>
                <span>Balance: {accountBalance.l1} ETH</span>
              </div>

              <div className='input_box'>
                {/* <Input.Group compact size="large"> */}
                {/* <Select
                      defaultValue={addresses.depositL1}
                      onChange={handleChainChange}
                      value={chainState}
                    >
                      <Select.Option value={addresses.depositL1}>Sepolia</Select.Option>
                      <Select.Option value={addresses.depositL2}>Adventure</Select.Option>
                    </Select> */}
                <div style={{ display: "flex", flexDirection: 'column', width: '100%' }}>
                  <div>
                    <FormControl sx={{ marginBottom: 1, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">Network</InputLabel>
                      <MuiSelect
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={selectSource}
                        label="Transfer Chain"
                        onChange={handleChainChange}
                      >
                        <MenuItem value={"sepolia"}>Sepolia (L1)</MenuItem>
                        <MenuItem value={"adventure"}>Adventure Layer (L2)</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  {/* <Input
                    value={sendAmount}
                    style={{
                      width: '80%',
                    }}
                    onChange={(e) => {
                      setSendAmount(e.target.value);
                    }}
                  /> */}
                  <div>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <OutlinedInput
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
                      {/* <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText> */}
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
              <Descriptions title="Summary" column={1}>
                <Descriptions.Item style={{ display: 'none' }} label="You will pay in gas fees">{gasPriceGwei} Gwei</Descriptions.Item>
                <Descriptions.Item label={`You will receive on ${targetChainName}`}>{sendAmount || 0} ETH</Descriptions.Item>
              </Descriptions>
            </div>

            <Button onClick={onClickTransfer} type="primary" size="large" block>
              Move funds to {targetChainName}
            </Button>
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