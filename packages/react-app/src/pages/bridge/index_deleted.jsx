import React, { useEffect, useState } from "react"; // eslint-disable-line
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";
import { Helmet } from 'react-helmet';

// { Body, Button, Container, Header, Image, Link, Main, Content, EditContent, EditorPreviewer }
import * as MomentComponent from "../../components/moment";
import logo from "../../ethereumLogo.png";
import logoSvg from "../../images/haoshuo.svg";

import { addresses, abis } from "@hayo-app/contracts";
import GET_TRANSFERS from "../../graphql/subgraph";

import RequestService from "../../services/request.service";
import ApiConfig from "../../services/api";

function WalletButton() {
  const [rendered, setRendered] = useState("")

  const { account, activateBrowserWallet, deactivate, error } = useEthers()
  const ens = useLookupAddress(account)

  useEffect(() => {
    if (ens && ens.ens) {
      setRendered(ens.ens);
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
    <MomentComponent.WhiteButton
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
    </MomentComponent.WhiteButton>
  );
}

const IconImage = styled.img`
  width: 2rem!important;
  height: 2rem!important;
`
const LogoBox = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  width: auto;
  // flex-direction: column;
  // justify-content: center;
  margin: 0;
  padding: 0;
`
const LogoDiv = styled.div`
  height: 100%;
  width: 5rem;
  justify-content: center;
  align-items: center;
  display: flex;
`
const LogoItem = styled.div`
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  display: flex;
`

function SiteLogo() {

  return (
    <LogoBox>
      <LogoDiv>
        <LogoItem><IconImage src={logoSvg} alt="haoshuo-logo" /></LogoItem>
      </LogoDiv>
    </LogoBox>
  );
}

interface PreviewerProps {
  content: string
}

function Previewer(props: PreviewerProps) {
  return (
    <MomentComponent.EditorPreviewer>
      <MomentComponent.EditorText>{props.content}</MomentComponent.EditorText>
      <MomentComponent.EditorCtrl>
        <MomentComponent.EditorButton>发布动态</MomentComponent.EditorButton>
      </MomentComponent.EditorCtrl>
    </MomentComponent.EditorPreviewer>
  )
}

const EditorStyle = {
  // height: '320px',
  width: '60%',
  display: 'block',
  height: '314px',
}

function Demo() {
  const { library } = useEthers();

  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  // Read more about useDapp on https://usedapp.io/
  const { error: contractCallError, value: tokenBalance } =
    useCall({
      contract: new Contract(addresses.ceaErc20, abis.erc20),
      method: "balanceOf",
      args: ["0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C"],
    }) ?? {};
  console.log('Demo', contractCallError, tokenBalance)

  const { loading, error: subgraphQueryError, data } = useQuery(GET_TRANSFERS);

  useEffect(() => {
    if (subgraphQueryError) {
      console.error("Error while querying subgraph:", subgraphQueryError.message);
      return;
    }
    if (!loading && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, subgraphQueryError, data]);

  return (
    <MomentComponent.Container>
      <Helmet>
        <title>Moments - Hayo</title>
        <meta name="application-name" content="Hayo"></meta>
        <meta charSet="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="renderer" content="webkit" />
        <meta name="google" content="notranslate" />
      </Helmet>
      <MomentComponent.Header>
        <SiteLogo />
        <WalletButton />
      </MomentComponent.Header>
      <MomentComponent.Body>
        <MomentComponent.Main>
          <MomentComponent.EditContent>
            <ReactQuill
              style={EditorStyle}
              theme="snow"
              value={value}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  ['image', 'link', 'code-block']
                ]
              }}
              onChange={(content, delta, source, editor) => {
                // console.log(content, editor.getText());
                setValue(content)
                setText(editor.getText())
              }} />
            <Previewer content={text} />
          </MomentComponent.EditContent>
          <MomentComponent.Content>
            <MomentComponent.Image src={logo} alt="ethereum-logo" />
            <p>
              Edit <code>packages/react-app/src/App.js</code> and save to reload.
            </p>
            <MomentComponent.RefLink href="https://reactjs.org">
              Learn React
            </MomentComponent.RefLink>
            <MomentComponent.RefLink href="https://usedapp.io/">Learn useDapp</MomentComponent.RefLink>
            <MomentComponent.RefLink href="https://thegraph.com/docs/quick-start">Learn The Graph</MomentComponent.RefLink>
          </MomentComponent.Content>
          <div>
            <div>
              <button onClick={() => {
                const signer = library.getSigner()

                signer.signMessage("Halo").then((message: any) => {
                  alert(message)
                  console.log("======>", message)
                }).catch((err: any) => {
                  console.log("======>", err)
                })

              }}>Sign</button>
              <button onClick={() => {
                RequestService.Instance().clientWithOptions({}).get(ApiConfig.api.user.list).then(response => {
                  console.log(response, '===>')
                  return response.data
                })

              }}>Request</button>
            </div>
          </div>
        </MomentComponent.Main>
      </MomentComponent.Body>
    </MomentComponent.Container>
  );
}

export default Demo;