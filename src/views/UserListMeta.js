import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";



export const UserListMetaComponent = () => {
    const [users, setUsers] = useState([])
    const [token, setToken] = useState("")

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

    

    const getMetaUsers = (async(token) =>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        (async() => {
             await fetch("https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users?q=user_metadata.emailChanged:true&search_engine=v3", requestOptions)
            .then(response =>  response.json().then(result => { console.log(response); setUsers(result)}))       
            .catch(error => console.log('error', error));
        })()

    })

    const metaDataTrue = (async(token) =>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        let result = window.confirm('メールアドレス更新を確認しましたか？');

        if(result){

        if(users.length!=0){

        

        users.map( (user) =>{
            (async() => {
                 
                  // ユーザーの user_metadata を更新するリクエストを作成します
                  const updateRequest = JSON.stringify({
                    
                    "user_metadata":{
                        "beforeEmail": "",
                        "emailChanged": false
                      }
                  });
                var requestOptions = {
                    method: 'PATCH',
                    headers: myHeaders,
                    body:    updateRequest,
                    redirect: 'follow'
                    };


             
                await fetch(`https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users/${user.user_id}`, requestOptions)
                .then(response => response.text())
                .then(result => {console.log(result);window.location.reload();})
                .catch(error => console.log('error', error));
            })()
        })
        }else{
            alert("ゆーざがいません");
            window.location.reload();
        }
    }
    })

    const deleteUser = (async(id) =>{

        let result = window.confirm('削除しますか');

        if(result){
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
                        .then(result => {alert(`${id}は削除されました`);  })
                        .then(result => getMetaUsers(token))
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

    useEffect(()=> {
        if (token !== "") {
            getMetaUsers(token); 
        }
    },[token]);

     

   

  return (
    
    <Container className="mb-5">
    <h1>ログイン時にソーシャルのメアド変更が検知されたもの</h1>
      <br/>
      <button onClick={()=>metaDataTrue(token)}>メタデータのTrue化</button> 
        {users?.map((user,index) => {
          return(
            <div key={index}>
                <Row className="align-items-center profile-header mb-5 text-center text-md-left">
                    <Col md={2}>
                        <img
                            src={user?.picture}
                            alt="Profile"
                            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                        />
                    </Col>
                    <Col md={6}>
                      
                    <h2>{user?.name}</h2>
                    <p className="lead text-muted">{user?.email}</p>
                    </Col>
                </Row>
                <Row>
                    <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
                </Row>
            </div>
        )
        })}
            
    </Container>
    

  );
};

export default withAuthenticationRequired(UserListMetaComponent, {
  onRedirecting: () => <Loading />,
});
