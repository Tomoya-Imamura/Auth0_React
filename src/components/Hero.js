import React from "react";
import { Container, Row, Col } from "reactstrap";
import logo from "../assets/logo.svg";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();


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
