import * as React from 'react';
import { useState, useContext } from "react";
import { 
  Alert, 
  Avatar, 
  Button, 
  TextField, 
  Link, 
  Grid, 
  Box, 
  Typography, 
  Container,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Date picker
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(dayjs());
  const [gender, setGender] = useState('no');
  const [msg, setMsg] = useState("");
  const [isButton, setIsButton] = useState(true);

  // file
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState(undefined);
  const [uploadFile, setUploadFile] = useState(undefined);
  const [cacheBustingTimestamp, setCacheBustingTimestamp ] = useState(new Date().getTime());
  
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  
  // regular exp for email
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // click on register button
  const handleClickRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    // -> Register
   console.log("gender=>", gender)
    try {
      const res = await axios.post(`/api/users/register`, 
      {
        name,
        email,
        password,
        'dateOfBirth': `${dateOfBirth.$y}-${dateOfBirth.$M}-${dateOfBirth.$D}`,
        gender
      },
      );
      if (res.status === 200 ||res.status === 201) {
        console.log(res.data);
        

        // Update Photo if file exist
        if (uploadFile) {
          setMsg("File uploading ...");
          console.log("Upload file");
          const id = res.data?.id
          console.log(id);
          itemPictureUpdate(id, uploadFile);
        }
        setMsg("");
        navigate("/login"); //to Login
        
      }
    } catch (err) {

      console.log(err.response.statusText
        );
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same alert part
    }
  }


// Picture Item update
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
      clearFileUpload();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg || err.response.statusText); // to show in the same part
    }
  } 


  // change name
  const handleChangeName = (e) => {
    setMsg(""); 
    const name = e.target.value;
    
    // if email
    if (name.length > 1) {
      setName(name);
   
    } else {
      setMsg("Very Short Name!"); 
   
    };
  }

  // change email
  const handleChangeEmail = (e) => {
    setMsg(""); 
    const address = e.target.value;
    
    // if email
    if (re.test(address)) {
      setEmail(address);
      if (password.length >= 3) {setIsButton(false)};
    } else {
      setMsg("Wrong email format!"); 
      setIsButton(true);
    };
  }

   // change password
  const handleChangePassword = (e) => {
    setMsg(""); 
    setPassword(e.target.value);
    // check length
    if (e.target.value.length >= 3 ) {
      if (re.test(email)) {setIsButton(false)};
    } else {
      setMsg("Password is less 3 symbols!"); 
      setIsButton(true);
    };
  }
    // change date of birth
  const handleChangeDateOfBirth = (e) => {
    setMsg(""); 
    
    setDateOfBirth(e);
    // check length
    if (e === "" ) {
      setMsg("No Date selected"); 
      setIsButton(true);
    };
  }

    // change gender
    const handleChangeGender = (e) => {
      setMsg(""); 
      setGender(e.target.value);
    }


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

  const clearFileUpload = () => {
    setUploadFileName(undefined);
    setUploadFile(undefined);
    setUploadFileUrl("");
  };
  
 
  return (
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 450,
                px: 2,
                py: 1,
                width: '100%'
          }}
        >
          { msg !== "" && <Alert severity="warning">{msg}</Alert>}
           
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
       

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  size = "small"
                  onChange ={ handleChangeName }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  size = "small"
                  onChange ={ handleChangeEmail }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete='off'
                  size = "small"
                  onChange ={ handleChangePassword }
                />
              </Grid>
              {/* Date of Birth */}
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                      label="Date of birth" 
                      slotProps={{ textField: { size: 'small' } }}
                      value={ dateOfBirth }
                      onChange={ handleChangeDateOfBirth}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            
            {/* Gender */}
              <Grid item xs={12}>
                <FormControl sx={{ mt: 0, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    value={gender}
                    label="Gender"
                    onChange={handleChangeGender}
                  >
                    <MenuItem value={"no"}>No</MenuItem>
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </Select>  
                </FormControl>
              </Grid>
           
              {/* Avatar */}
              <Grid 
                item xs={12}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent='flex-start'
                gap={1}
              >
                <Avatar
                  alt="photo"
                  src= { uploadFileUrl === "" ? "/images/avatar.jpg" : uploadFileUrl }
                  sx={{ width: 100, height: 100 }}
                />
                <Button
                  size='small'
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                    Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={ !uploadFile }
                  onClick={() => clearFileUpload() }
                >
                  Clear 
                </Button>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClickRegister}
              disabled={isButton}
            >
              SignUp
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/login")}}>
                Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box> 
       
        </Box>

  );
}

export default Register;