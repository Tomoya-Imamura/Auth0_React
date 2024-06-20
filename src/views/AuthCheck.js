import React, { useState } from 'react';
import { getConfig } from "../config";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";
// Auth0の設定を行います
const config = getConfig();
const clientId = config.clientId;
const clientSecret = 'oOER8qchtaKwCHCG79eNUsPZUVS6jPquQtMVzzsocxS_dFSMAV7Qxz0kgKVJNAAg';
const tokenUrl = `https://${config.domain}/oauth/token`;
const realm =config.db

export const AuthCheckComponent = () => {

  const config = getConfig();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    const payload = {
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password,
      scope: 'openid profile email',
      realm: realm 
    };

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access_token);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData);
        setAccessToken(null);
      }
    } catch (error) {
      setError(error);
      setAccessToken(null);
    }
  };

  return (
    <div className="App">
      <h1>Auth0 Authentication</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
      {accessToken && (
        <div>
          <h2>Authentication Successful</h2>
          <p>Access Token: {accessToken}</p>
        </div>
      )}
      {error && (
        <div>
          <h2>Authentication Failed</h2>
          <p>Error: {JSON.stringify(error)}</p>
        </div>
      )}
    </div>
  );
}

export default withAuthenticationRequired(AuthCheckComponent, {
    onRedirecting: () => <Loading />,
});
