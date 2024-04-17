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

    

    const getUsers = (async(token) =>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        (async() => {
             await fetch("https://dev-ahsivo00r84wgtro.jp.auth0.com/api/v2/users", requestOptions)
            .then(response =>  response.json().then(result => { setUsers(result)}))       
            .catch(error => console.log('error', error));
        })()

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
                        .then(result => getUsers(token))
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
            getUsers(token); 
        }
    },[token]);

     

   

  return (
    
    <Container className="mb-5">
      
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

export default withAuthenticationRequired(UserListComponent, {
  onRedirecting: () => <Loading />,
});
