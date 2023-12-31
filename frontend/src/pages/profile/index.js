import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Avatar, TextField, Box, Button, Typography, useTheme } from "@mui/material";
import Header from "components/Header";

import { useNavigate } from 'react-router-dom';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import axios from "axios";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const Profile = (props) => {
  
  const [msg, setMsg] = useState("");
  const { isLogin, setIsLogin, userinfo, setUserInfo, token, setToken } = useContext(AppContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdateButtonActive, setIsUpdateButtonActive] = useState(true);
  const [isPasswordUpdateButtonActive, setIsPasswordUpdateButtonActive] = useState(true);
  // file
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState(undefined);
  const [uploadFile, setUploadFile] = useState(undefined);
  const [cacheBustingTimestamp, setCacheBustingTimestamp ] = useState(new Date().getTime());
  
  
  
  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);

  useEffect(() => {
    setName(userinfo?.name || "");
    setCacheBustingTimestamp(new Date().getTime());
  },[userinfo]);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  
  const checkUpdateInput = (name) => {
    
    if (name != "" &&  name.length > 2) {
      return false
    }
    return true
  }

  const handleChangeName = (event) => {
    setMsg("");
    if (event.target.value.length < 25) {setName(event.target.value)};
    setIsUpdateButtonActive(checkUpdateInput(event.target.value));
  }

  const handleChangePassword = (event) => {
    setMsg("");
    setPassword(event.target.value);
    setIsPasswordUpdateButtonActive(checkUpdateInput(event.target.value));
  }

  // requests
  // Update Name
  const updateName = async (id) => {
    setMsg("");
    // -> 
    try {
      const res = await axios.patch(`api/users/update/${id}`, 
        {
          "name": name,
        }
        );
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        // store token to local storage
        localStorage.setItem('MmToken', res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same part
    }
  }

  // Update Password
  const updatePassword = async (id) => {
    setMsg("");
    // -> 
    try {
      const res = await axios.patch(`api/users/update/${id}`, 
        {
          "password": password,
        }
        );
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        // store token to local storage
        localStorage.setItem('MmToken', res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same part
    }
  }

   // Picture Photo update
   const itemPictureUpdate = async (id, file) => {
    console.log("Update image");
    setMsg("");
    if (!file) {
      setMsg("No file found");
      return;
    }

    // Create a FormData for file
    const formData = new FormData();
    formData.append('itemImage', file); // 'itemImage' is the field in API
    // -> 
    try {
      const res = await axios.post(
        `api/users/update_photo/${id}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        // prevent picture caching
        setCacheBustingTimestamp(new Date().getTime());
        // store token to local storage
        localStorage.setItem('MmToken', res.data.token);
        setToken(res.data.token);
        // ClearUpdatedFile
        clearFileUpload();

      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same part
    }
  }
   
  
  
  // Picture delete
  const itemPictureDelete = async (id) => {
    setMsg("");
    if (!id) {
      setMsg("No User ID for Picture delete found.");
      return;
    }
    // // -> delete
    try {
      const res = await axios.delete(`api/users/delete_picture/${id}`);
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        // prevent picture caching
        setCacheBustingTimestamp(new Date().getTime());
        // store token to local storage
        localStorage.setItem('MmToken', res.data.token);
        setToken(res.data.token);
        // ClearUpdatedFile
        clearFileUpload();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same part
    }
  }

  const clearFileUpload = () => {
    setUploadFileName(undefined);
    setUploadFile(undefined);
    setUploadFileUrl("");
  };
  

  // File upload
  const handleFileUpload = (e) => {
    setMsg("");
    setCacheBustingTimestamp(new Date().getTime());
    console.log("file upload ")
    if (!e.target.files) {
      setMsg("No file found!");
      return;
    }
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const { name } = file;
    
      
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        setUploadFileUrl(readEvent.target.result);
      };
      reader.readAsDataURL(file);
      setUploadFileName(name);
      setUploadFile(file);
    } else {
      setMsg("No file found!");
    }
  };

  
  return(
      <Box m="1.5rem 2.5rem">
        <Header title="PROFILE MANAGEMENT" subtitle="Edit Name, Password, User Photo " />
        { msg != "" && <Alert severity="warning">{msg}</Alert>}
      
         
        {/* Items */}
        <Box sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 400,
          px: 2,
          py: 1,
          width: '100%'}}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
        </Box>

        {/* User Name */}
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* name */}
            <Grid item xs={3}>
              <TextField
                disabled={false}
                size="small"
                // fullWidth
                id="user-name"
                label="Name"
                name="name"
                autoComplete="name"
                maxRows={1}
                value={ name }
                onChange ={ handleChangeName } // 
                // onBlur={()=>{}}
              />
            </Grid>
             
            <Grid item xs={3}>
                <Button
                  sx={{ mt: 0 }}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isUpdateButtonActive}
                  onClick={() => updateName(userinfo.id)}
                >
                  Update
                </Button>
              </Grid>

          </Grid>
        </Box>

        {/* Password */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* password */}
            <Grid item xs={3}>
              <TextField
                disabled={false}
                size="small"
                // fullWidth
                id="user-password"
                label="New password"
                name="password"
                autoComplete="password"
                maxRows={1}
                value={ password }
                onChange ={ handleChangePassword } // 
                // onBlur={()=>{}}
              />
            </Grid>
             
            <Grid item xs={3}>
                <Button
                  sx={{ mt: 0 }}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isPasswordUpdateButtonActive}
                  onClick={() => updatePassword(userinfo.id)}
                >
                  Update
                </Button>
              </Grid>
          </Grid>
        </Box>

         {/* Picture Image */}
         <Box sx={{ mt: 2}}>
            <Typography>
              Edit Photo
            </Typography>
            <Grid container spacing={2}>
              <Grid 
                item xs={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography>
                  Current
                </Typography>
                 {/* Current picture */}
                <Avatar
                  alt=""
                  src= { (userinfo?.photoUrl === "") ? "/images/avatar.jpg" : `${userinfo.photoUrl}?t=${cacheBustingTimestamp}` }
                  sx={{ width: 100, height: 100 }}
                />
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={userinfo.photoUrl === ""}
                  onClick={() => itemPictureDelete(userinfo.id)}
                >
                  Remove
                </Button>
                
              </Grid>
              <Grid 
                item xs={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography>
                  New
                </Typography>
               {/* New picture */}
                <Avatar
                  alt=""
                  src= { uploadFileUrl === "" ? "/images/avatar.jpg" : uploadFileUrl }
                  sx={{ width: 100, height: 100 }}
                />
                <Button
                  size='small'
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  New
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={!uploadFile}
                  onClick={() => itemPictureUpdate(userinfo.id, uploadFile)}
                >
                  Update
                </Button>
             </Grid>
          </Grid>
         
          </Box>
       </Box>
    )
}

export default Profile;