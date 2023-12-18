import React from 'react';
import { useState, useCallback, useContext, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import { AppContext } from "App";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const Layout = () => {
    const [msg, setMsg] = useState('');
    // media query desktop - true
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const { token, setToken } = useContext(AppContext);
    const { userinfo, setUserInfo } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);


    // for token
    useEffect(()=>{
      if (token) {
        const payload = jwtDecode(token);
        setUserInfo(payload);
        setIsLogin(true);
        console.log("userinfo from token=>", payload);
        // setCacheBustingTimestamp(new Date().getTime());  
        } 
    }, [token])
      
 // for token
   useEffect(()=>{
    if (localStorage.getItem("MmToken")) {
      readDataFromLocalStorage();
      } 
  })

   // read data from Local Storage
  const readDataFromLocalStorage = useCallback(() => {
      const response = localStorage.getItem("MmToken");
      if (response) {
        setToken(response);
      } 
  },[]);

  return (
    <Box 
      display={isNonMobile ? "flex": "block"} 
      // width="100%" 
      height="100%">
    
        <Box flexGrow={1}>
            <Navbar
              user={userinfo.name || ""}
            />
            <Outlet/>
        </Box>
    </Box>
  )
}

export default Layout;