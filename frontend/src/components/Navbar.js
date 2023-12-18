import React, { useState, useContext, useEffect} from 'react';
import { 
    LightModeOutlined, 
    DarkModeOutlined, 
    Menu as MenuIcon, 
    Search, 
    SettingsOutlined, 
    ArrowDropDownOutlined,
    ConstructionOutlined,
   
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from "state";
import { AppBar, IconButton, Toolbar, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { Link, Navigate } from "react-router-dom";
// import profileImage from "asset/profile.jpg"
import { AppContext } from "App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';


const Navbar = ({
    user
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    // Status
    const { isLogin, setIsLogin, userinfo, setUserInfo } = useContext(AppContext);
    //right button user info
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [cacheBustingTimestamp, setCacheBustingTimestamp ] = useState(new Date().getTime());
    // App logic
    const { token, setToken } = useContext(AppContext);
  
    const navigate = useNavigate();

    const logout = () => {
        setToken(null);
        setIsLogin(false);
        setUserInfo("");
        // delete from local storage
        localStorage.removeItem('MmToken');
        navigate("/");
    }

    useEffect(()=>{
        setCacheBustingTimestamp(new Date().getTime());
      }, [token])
      
  return (
    <AppBar 
        sx={{
        position: "static",
        // background: "none",
        boxShadow: "none",
    }}> 
        <Toolbar sx={{ justifyContent: "space-between"}}>
            {/* Left block */}
            <FlexBetween>
                <FlexBetween >
                    <Box display="flex" alignItems="center" gap="0.5rem">
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main} onClick={()=>{ navigate("/")}}>
                            XP
                        </Typography>
                    </Box>
                </FlexBetween>

                {/* Nav Bar Menu */}
                {isLogin && (
                    <Button  variant="h4" sx={{ my: 2, display: 'block' }} component={Link} to='/people' > 
                        Accounts
                    </Button>
                )} 
            </FlexBetween>

         {/* Right block */}
            <FlexBetween>
              {/* Login Box */}
              { false && (
              <Button 
                variant="contained"
                size="small"
                color="secondary"
                component={Link} to='/account'
              >
                Profile
              </Button>
              )}
              {/* Login Box end */}
              <IconButton onClick={()=>dispatch(setMode())}>
                  {theme.palette.mode === 'dark' ? (
                      <DarkModeOutlined sx={{ fontSize: "25px" }}/>
                  ): (
                      <LightModeOutlined sx={{ fontSize: "25px" }}/> 
                  )}
              </IconButton>
              
            {/* user info box */}
                <FlexBetween>
                    <Button
                    onClick={handleClick}
                    variant="h4"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textTransform: "none",
                        gap: "1rem",
                    }}
                    >
                        {isLogin && (
                        <Box
                            component="img"
                            alt="profile"
                            src={ (userinfo.photoUrl && userinfo?.photoUrl === "") ? "/images/avatar.jpg" : `${userinfo.photoUrl}?t=${cacheBustingTimestamp}` }
                            height="32px"
                            width="32px"
                            borderRadius="50%"
                            sx={{ objectFit: "cover", backgroundColor: theme.palette.primary.light}}
                            />
                        )}
                        {isLogin && (
                        <Box textAlign="left">
                            <Typography
                                fontSize="0.75rem"
                            >
                                User:
                            </Typography>
                            <Typography
                                fontWeight="bold"
                                fontSize="0.85rem"
                            >
                                { user.split(' ')[0].substring(0, 15) }
                            </Typography>
                        </Box>
                        )}
                        
                        <ArrowDropDownOutlined
                            sx={{ fontSize: "25px" }}
                        />
                    </Button>
                    <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <MenuItem onClick={()=>{handleClose(); logout()}}>Log Out</MenuItem>
                        {isLogin && <MenuItem onClick={()=>{handleClose(); navigate("/account")}}>Profile</MenuItem>}
                    </Menu>
                </FlexBetween>
                {/* end user info box */}
            </FlexBetween>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar;