import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [cartValue, setCartValue] = useState(0); // new cart state

  // load from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedCart = localStorage.getItem("cartValue"); // load cart from localStorage

    storedUser && setUser(JSON.parse(storedUser));
    storedToken && setAccessToken(storedToken);
    storedCart && setCartValue(JSON.parse(storedCart)); // set cart state if it exists
  }, []);

  useEffect(() => {
    localStorage.setItem("cartValue", cartValue); // update localStorage whenever cartValue changes
  }, [cartValue]);

  const incrementCart = () => {
    setCartValue((prev) => {
      const newValue = prev + 1;
      localStorage.setItem("cartValue", JSON.stringify(newValue)); // update localStorage
      return newValue;
    });
  };

  const decrementCart = () => {
    setCartValue((prev) => {
      const newValue = Math.max(prev - 1, 0); // prevent negative cart value
      localStorage.setItem("cartValue", JSON.stringify(newValue)); // update localStorage
      return newValue;
    });
  };

  // login function
  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setCartValue(0); // set cart value on login

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("cartValue", JSON.stringify(cartValue));
  };

  // logout function
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setCartValue(0); // reset cart on logout

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cartValue");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        cartValue,
        login,
        logout,
        incrementCart,
        decrementCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
