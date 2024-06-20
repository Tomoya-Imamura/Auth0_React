import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";

export const ChangePasswordComponent = () => {
    const {
        user,
    } = useAuth0();
    const config = getConfig();
    const [token, setToken] = useState("")
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const getToken = (() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        (async () => {
            await fetch("https://jq37brbisg.execute-api.ap-northeast-1.amazonaws.com/deployment/translate", requestOptions)
                .then(response => response.json().then((result) => {
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
        alert(user.email + "にパスワード変更メールを送信しました。");
    };


    const handlePasswordChange = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
          }
        const url = `https://${config.domain}/api/v2/users/${user.sub}`;
    
        const data = {
          password: newPassword,
          connection: config.db
        };
    
        try {
          const response = await axios.patch(url, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
    
          setMessage('Password updated successfully.');
          console.log('Password updated successfully:', response.data);
          setLoading(false);
        } catch (error) {
          setMessage(error.response.data.message);
          console.error(error.response.data.message);
          setLoading(false);
        }
      };


    useEffect(() => {
        getToken();
    }, []);

    return (
        loading ? <Loading/> : 
        <Container className="mb-5">
            <h1>プロフィール画面</h1>
            <br />
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

            </Row>


            <Row>
                <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
            </Row>
            <div>
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
            <div>
          <label>
            New Password:
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </label>
        </div>
        <div>
          <label>
            Confirm Password:
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </label>
        </div>
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
            </div>
        </Container>
        
    );
    
};

export default withAuthenticationRequired(ChangePasswordComponent, {
    onRedirecting: () => <Loading />,
});
