import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import { snakeCaseToTitle } from "src/utils";
import {
  getCachedUser,
  getCachedAccessToken,
  setCachedAccessToken,
  setCachedUser,
} from "src/utils/cache";

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [user, setUser] = useState({});

  const isTokenValid = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      const isTokenExpired = new Date().getTime() > decodedToken.exp * 1000;
      if (isTokenExpired) {
        console.log("Token has expired");
        window.localStorage.clear();
        return false;
      }
      // Token is valid;
      return true;
    } catch (error) {
      console.log("Token verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    setIsInitialized(true);
    const cachedAccessToken = getCachedAccessToken();
    const cachedUser = getCachedUser();
    const isValid = isTokenValid(cachedAccessToken);
    setSelectedRole(snakeCaseToTitle(cachedUser.role));
    if (isValid) {
      setUser(cachedUser);
      setAccessToken(cachedAccessToken);
      setIsAuthenticated(true);
    } else if (window.location.pathname !== "/") {
      window.location.href = "";
    }
  }, []);

  const setIncomingAuthData = (data) => {
    const accessToken = data.token;
    const user = data.user;
    if (accessToken && user) {
      setUser(user);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      setCachedAccessToken(accessToken);
      setCachedUser(user);
    } else {
      console.error("Failed to get tokens and user from auth response data");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        accessToken,
        selectedRole,
        setSelectedRole,
        setIncomingAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
