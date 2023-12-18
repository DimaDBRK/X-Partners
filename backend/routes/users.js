import express from 'express';
import { 
  _getAllUsers, 
  _register,
  _login,
  _logout,
  _updateUserPhoto,
  _updateUser
} from '../controllers/users.js';

// it is traffic controller
const u_router = express.Router();

u_router.get('/all', _getAllUsers)
u_router.post("/register", _register);
u_router.post('/login', _login);
u_router.get('/logout', _logout);
u_router.post('/update_photo/:id', _updateUserPhoto);
u_router.patch('/update/:id', _updateUser);

export default u_router;