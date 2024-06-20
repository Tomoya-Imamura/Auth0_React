import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";

export const ProfileComponent = () => {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    user,
    isAuthenticated,
    logout,
    handleRedirectCallback,
  } = useAuth0();
  const config = getConfig();
  const [token, setToken] = useState("")
 

  useEffect(() => {
    const handleAuthRedirect = async () => {
      console.log(window.location)
   
        const { appState } = await handleRedirectCallback();
        console.log("リンク")
        const { primaryUserId, token1 } = JSON.parse(appState.state);

        linkAccounts(primaryUserId, token1);
      
    };

    handleAuthRedirect();
  }, [handleRedirectCallback]);

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

    const getToken = (()=> {
      const requestOptions = {
          method: 'POST',
          headers:{'Content-Type': 'application/json'},
      };

      (async() => {
          await fetch("https://jq37brbisg.execute-api.ap-northeast-1.amazonaws.com/deployment/translate", requestOptions)
          .then(response =>  response.json().then((result)=>{
              const new_token = (result.body.access_token.toString());
              setToken(new_token);
          })) 
          .catch(error => console.log('error', error))
      })()
  })
 
    const changePassword = async () => {
    await axios.post(
      `https://${config.domain}/dbconnections/change_password`,
      {
        client_id: config.clientId,
        email: user.email,
        connection: config.db,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    alert(user.email+"にパスワード変更メールを送信しました。");
  };


  const linkAccounts = async (primaryUserId, token1) => {
    console.log("リンクスタート");
    const secondaryUserId = user.sub;
    const response = await fetch( `https://${config.domain}/api/v2/users/${primaryUserId}/identities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        primaryUserId,
        secondaryUserId,
        secondaryProvider: 'google-oauth2',
      }),
    });

    if (response.ok) {
      console.log('アカウントがリンクされました');
    } else {
      console.error('アカウントのリンクに失敗しました');
    }
  };


  const handleLinkAccount = async () => {
    const token1 = await getAccessTokenSilently();

    await loginWithRedirect({authorizationParams: {
      connection: 'google-oauth2',
      state: JSON.stringify({ primaryUserId: user.sub, token1 }),
      redirect_uri: `${window.location.origin}/callback`,
    }
    });
  };

  const changeEmail = async () => {
    await axios.post(
      `https://${config.domain}/dbconnections/change_password`,
      {
        client_id: config.clientId,
        email: user.email,
        connection: config.db,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    alert(user.email+"に変更メールを送信しました。");
  };
  const deleteUser = (async(id) =>{

    let result = window.confirm('削除しますか');
    console.log(user.sub)

    if(result){
        if(token==""){
          getToken();
        }
        console.log('削除');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        (async() => {
                
            await fetch(`https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users/${id}`, requestOptions)
                    .then(response => response.text())
                    .then(result => {alert(`${id}は削除されました`); logoutWithRedirect(); })
                    .catch(error => console.log('error', error));
            }

        )()
        
    }else{
    console.log('削除をとりやめました');
    }
  })

  useEffect(()=> {
    getToken();
},[]);

  return (
    <Container className="mb-5">
      <h1>プロフィール画面</h1>
      <br/>
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
        {user.sub.match("auth0|.*") && 
           <>
           <button onClick={()=>changeEmail()}>メールアドレス変更</button> 
           <button onClick={()=>handleLinkAccount()}>Google連携</button> 
          <button onClick={()=>changePassword()}>パスワード変更</button> 
          <button onClick={()=>deleteUser(user.sub)}>退会</button>          
          </> 
        }
        
      </Row>
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
