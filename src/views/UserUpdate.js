import React from "react";
import { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import Loading from "../components/Loading";
import {withAuthenticationRequired } from "@auth0/auth0-react";



export const UserUpdateComponent = () => {
    const [email, setEmail] = useState('imatomo1234imatomo@gmail.com');
    const [givenName, setGivenName] = useState('Tomoya');
    const [familyName, setFamilyName] = useState('Imamura');
    const [password, setPassword] = useState('Tomo0105!');
    const [username, setUsername] = useState('Tomoyaimamu');
    const [picture, setPicture] = useState('https://lh3.googleusercontent.com/a/ACg8ocJGfciiQtHHOCAi2oT8x-5_WK_5yCTBVeHOwIoSj9bcIRjGkA=s96-c');
    const [nickname, setNickname] = useState('Tomoya Imamura');
    const [userId, setUserId] = useState('iamtomo1234');
    // const [connection, setConnection] = useState('Username-Password-Authentication');
    // const [verifyEmail, setVerifyEmail] = useState(false);
    // const [userMetadata, setUserMetadata] = useState({});
    // const [blocked, setBlocked] = useState(false);
    // const [emailVerified, setEmailVerified] = useState(false);
    const [name, setName] = useState("Tomoya Imamura");
    const [user, setUser] = useState({  
        "email": email,
        "user_metadata": {},
        "blocked": false,
        "email_verified": false,
        "given_name": givenName,
        "family_name": familyName,
        "name": name,
        "picture":picture,
        "nickname": nickname,
        "user_id": userId,
        "connection": "Username-Password-Authentication",
        "password": password,
        "verify_email": false,
        "username": username
    })


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


    const getUser = (async(token) =>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        (async() => {
                    
            await fetch(`https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users/${id}`, requestOptions)
                    .then(response => response.json())
                    .catch(error => console.log('error', error));
            }

        )()

    })

    const addUsers = (async(token) =>{
        if (token !== ""){

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);


            var raw = JSON.stringify(user);

              
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                
            };


            (async() => {
                await fetch("https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if(result.statusCode==409){ 
                        alert("すでに登録されています");
                        console.log(result);
                    }else if(result.statusCode==400){
                        alert(result.message);
                        console.log(result);                    
                    }else{
                        alert("追加しました。\n メールアドレス：" + email);
                    }
                    })
                .then(result => {return <Redirect to='/userlist'/>;})
                .catch(error => console.log('error', error));
            })()
        }else{
            console.log("no token")
        }
    })

    useEffect(()=> {
        getToken();
    });

    useEffect(()=> {
        setUser({
            "email": email,
            "user_metadata": {},
            "blocked": false,
            "email_verified": false,
            "given_name": givenName,
            "family_name": familyName,
            "name": name,
            "picture":picture,
            "nickname": nickname,
            "user_id": userId,
            "connection": "Username-Password-Authentication",
            "password": password,
            "verify_email": false,
            "username": username
        })
    },[email,givenName,familyName,name,picture,nickname,userId,password,username]);

     

   

  return (
    
    <Container className="mb-5">
    <h1>ユーザ追加</h1>
    
        <div>
            <label>Email:</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Given Name:</label>
            <input
            type="text"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Family Name:</label>
            <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Password:</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Username:</label>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Picture:</label>
            <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Nickname:</label>
            <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            />
        </div>
        <div>
            <label>User ID:</label>
            <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Name:</label>
            <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </div>
      <button onClick={()=>addUsers(token)}>Submit</button>
    </Container>
    

  );
};

export default withAuthenticationRequired(UserUpdateComponent, {
  onRedirecting: () => <Loading />,
});
