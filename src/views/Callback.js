import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useHistory } from 'react-router-dom';

const Callback = () => {
  const { handleRedirectCallback } = useAuth0();
  const history = useHistory();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.has('code') && queryParams.has('state')) {
        const { appState } = await handleRedirectCallback();
        history.push(appState?.targetUrl || '/profile');
      }
    };

    handleAuthRedirect();
  }, [handleRedirectCallback, history]);

  return <div>Loading...</div>;
};

export default Callback;
