import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";



export const UserListComponent = () => {
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


    const addUsers = (async(token) =>{
        if (token !== "") {
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);


            var raw = JSON.stringify({
                "email": "imatomo1234imatomo@gmail.com",
                "blocked": false,
                "email_verified": false,
                "phone_verified": false,
                "given_name": "Tomoya",
                "family_name": "Imamura",
                "name": "Tomoya Imamura",
                "nickname": "Tomoya Imamura",
                "user_id": "iamtomo1234",
                "connection": "Username-Password-Authentication",
                "password": "Tomo0105!",
                "verify_email": false,
                "username": "Tomoyaimamu"
              });

              
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
                body:raw
            };


            (async() => {
                await fetch("https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            })()
        }
    })

    useEffect(()=> {
        getToken();
    });

    // useEffect(()=> {
    //     if (token !== "") {
    //         getUsers(token); 
    //     }
    // },[token]);

     

   

  return (
    
    <Container className="mb-5">
        <h1>ユーザ追加</h1>
        <button onClick={()=>addUsers(token)}>ユーザ追加</button>
            
    </Container>
    

  );
};

export default withAuthenticationRequired(UserListComponent, {
  onRedirecting: () => <Loading />,
});
