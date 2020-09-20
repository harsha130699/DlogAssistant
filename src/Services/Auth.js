import { useEffect, useState } from "react";
import axios from "../axios";

const createTokenProvider = () => {
  let _token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH")) || null;

  const getExpirationDate = (jwtToken) => {
    if (!jwtToken) {
      return null;
    }

    const jwt = JSON.parse(atob(jwtToken.split(".")[1]));

    // multiply by 1000 to convert seconds into milliseconds
    return (jwt && jwt.exp && jwt.exp * 1000) || null;
  };

  const isExpired = (exp) => {
    if (!exp) {
      return false;
    }

    return Date.now() > exp;
  };

  const getToken = async () => {
    if (!_token) {
      return null;
    }

    if (isExpired(getExpirationDate(_token.accessToken))) {
      const tokens = await axios.post("/auth/refresh-token", {
        refreshToken: _token.refreshToken,
      });

      setToken(tokens);
    }

    return _token && _token.accessToken;
  };
  const isLoggedIn = () => {
    console.log("Token:",_token)
    return !!_token;
  };
  let observers = [];
  const subscribe = (observer) => {
    observers.push(observer);
  };

  const unsubscribe = (observer) => {
    observers = observers.filter((_observer) => _observer !== observer);
  };
  const notify = () => {
    const isLogged = isLoggedIn();
    observers.forEach((observer) => observer(isLogged));
  };
  const setToken = (token) => {
    if (token) {
      localStorage.setItem("REACT_TOKEN_AUTH", JSON.stringify(token));
    } else {
      localStorage.removeItem("REACT_TOKEN_AUTH");
    }
    _token = token;
    notify();
  };
  return {
    getToken,
    isLoggedIn,
    setToken,
    subscribe,
    unsubscribe,
  };
};

export const createAuthProvider = () => {
  const tokenProvider = createTokenProvider();
  const login = (newTokens) => {
    tokenProvider.setToken(newTokens);
  };

  const logout = () => {
    tokenProvider.setToken(null);
  };

  const authPost = async (url, input) => {
    const token = await tokenProvider.getToken();
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    return axios.post(url, input,{headers});
  };

  const authGet = async (url) => {
    const token = await tokenProvider.getToken();
    console.log("Getting:"+url)
    console.log("token:",token)
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    return axios.get(url, {headers});
  };
  const authDelete = async (url) => {
    const token = await tokenProvider.getToken();
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    return axios.delete(url, {headers});
  };
  const authPatch = async (url, input) => {
    const token = await tokenProvider.getToken();
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    return axios.patch(url, input,{headers});
  };

  const useAuth = () => {
    const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());

    useEffect(() => {
      const listener = (newIsLogged) => {
        setIsLogged(newIsLogged);
      };

      tokenProvider.subscribe(listener);
      return () => {
        tokenProvider.unsubscribe(listener);
      };
    }, []);

    return [isLogged];
  };

  return {
    useAuth,
    authPost,
    authGet,
    authDelete,
    authPatch,
    login,
    logout,
  }
}