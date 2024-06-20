import React from "react";
import { Container, Row, Col } from "reactstrap";
import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../config";
import {
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
const Hero = () => {

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const auth0Domain = getConfig().domain;
  const clientId = getConfig().clientId;
  const connection = 'google-oauth2';
  const redirectUri = encodeURIComponent('http://localhost:3000');
  const state = 'YOUR_STATE'; // 任意のランダム文字列を生成することを推奨
  const scope = 'openid profile email';
  
  const authUrl = `https://${auth0Domain}/authorize?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `connection=${connection}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${state}&` +
    `scope=${encodeURIComponent(scope)}`;
  
    const SyncGoogleAuth  = (async()=> {
    
      await loginWithRedirect({authorizationParams: {
        screen_hint: "signup",
        connection: 'google-oauth2',
      }
    })
  })

  return(
  <div className="text-center hero my-5">
    {/* <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" /> */}
    <h1 className="mb-4">CIC検証アプリ</h1>

    <p className="lead">
      <a href="https://reactjs.org">React.js</a>を使ったCIC検証のためのサンプルSPA

      </p>

      {!isAuthenticated? (
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={12}>
        
        <p>・ログインは右上のナビゲーション画面</p>
        </Col>
      </Row>
      ):(
        <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={12}>

        <Button
            id="qsLoginBtn"
            color="primary"
            className="btn-margin"
            onClick={() => loginWithRedirect({authorizationParams: {
              screen_hint: "signup",
              connection: "google-oauth2",
            }})}
          >
          
      </Button>
        <p>・ログイン後ナビゲーション画面</p>
        <p>・Profileはログインユーザの情報</p>
        <p>・ユーザ一覧はAuth0に登録されたユーザ表示・削除が可能</p>
        <p>・メアド変更確認はmetadataのフラグで判断している</p>
        </Col>
      </Row>
      )}

  </div>
  );
}
export default Hero;
