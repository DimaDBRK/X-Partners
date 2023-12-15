import { 
  getAllUsers, 
  register,
  login,
  addToken,
  deleteToken
   } from "../models/users.js";

import { PrismaClient } from '@prisma/client'
import { isValidEmail } from "../helpers/isValidEmail.js"

const prisma = new PrismaClient()

import bcrypt from "bcrypt";
// tokens -> code in .env ACCESS_TOKEN_SECRET
import jwt from "jsonwebtoken";

// GET  all users 
export const _getAllUsers = (req, res) => {
  getAllUsers(prisma) // it is function, return promise
    .then(data => {
      res.json(data)
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({ msg: "something went wrong!  " }); // or e.message
    })
    .finally(async () => await prisma.$disconnect())
}

// Register - POST new user
export const _register = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('password')) {
    return res.status(400).json({msg: "Wrong request, no email or other params."});
  }

  const { name, email, password } = req.body;
  // check email format
  if (!isValidEmail(email)) { 
    return res.status(400).json({ msg: "Wrong email format" });
  }

  // encrypt the password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password + "", salt);


  register(prisma, { name: name, email: email.toLowerCase(), hashPassword: hash }) // it is function, return promise
  .then(data => {
    // response with user info
    res.json({ msg: `User with email: ${data.email} created!` })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A user with this email already exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}


// login
export const _login = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
    return res.status(400).json({msg: "Wrong request, no email or other params."});
  }

  const { email, password } = req.body;
  // check email format
  if (!isValidEmail(email)) { 
    return res.status(400).json({ msg: "Wrong email format" });
  }

  // token life time
  const acsessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;

  // try to get password with username
  login(prisma, email)
    .then(data => {
      // if username does not exist
      if (!data)
        return res.status(404).json({ msg: "User email not found" });
  
      // check password
      const match = bcrypt.compareSync(password + "", data.password);
      
      // if password not match
      if (!match) return res.status(401).json({ msg: "Wrong password" });
      
      // success login
      const secret = process.env.ACCESS_TOKEN_SECRET;

      const acsessToken = jwt.sign({ id: data["id"], name: data["name"], email: data["email"] }, secret,{
        expiresIn:`${acsessTokenExpiresIn}s`,
      });

      // Store in DB table users tokens (id user_id )
      addToken(prisma, acsessToken, data["id"]  )

      res.json({ token: acsessToken })

    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ msg: "Internal server error." }); // or e.message
    })
    .finally(async () => await prisma.$disconnect())
}


  // logout
export const _logout = (req, res) => {
  console.log("controller _logout", req.headers['x-access-token']);
  const tokenValue = req.headers['x-access-token']
  if (tokenValue) {
    // delete refresh token from table
    deleteToken(prisma, tokenValue)
    .catch(e => {
      console.log(e);
    })
    .finally(async () => await prisma.$disconnect())
  }
  return res.sendStatus(200);
}
