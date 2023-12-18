import { 
  getAllUsers, 
  register,
  login,
  addToken,
  deleteToken,
  updatePictureUrl,
  updateItem
   } from "../models/users.js";

import { PrismaClient } from '@prisma/client'
import { isValidEmail } from "../helpers/isValidEmail.js"

const prisma = new PrismaClient()

import bcrypt from "bcrypt";
// tokens -> code in .env ACCESS_TOKEN_SECRET
import jwt from "jsonwebtoken";


// Save file and work with form data
import multer from "multer";
import path from "path";
import { upload } from "../helpers/fileUpload.js"

// GET  all users 
export const _getAllUsers = (req, res) => {
  getAllUsers(prisma) // it is function, return promise
    .then(data => {
      res.json(data)
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({ msg: "something went wrong! " }); // or e.message
    })
    .finally(async () => await prisma.$disconnect())
}

// Register - POST new user
export const _register = (req, res) => {
  // check if body exist
  console.log("register=>", req.body)

  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('password')) {
    return res.status(400).json({msg: "Wrong request, no email or other params."});
  }

  const { name, email, password, dateOfBirth, gender } = req.body;
  // check email format
  if (!isValidEmail(email)) { 
    return res.status(400).json({ msg: "Wrong email format" });
  }

  // encrypt the password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password + "", salt);


  register(prisma, { 
    name: name, 
    email: email.toLowerCase(), 
    hashPassword: hash,
    gender: gender,
    birthDate: new Date(dateOfBirth),
    photoUrl: "",

  }) // it is function, return promise
  .then(data => {
    // response with user info
    res.json({ msg: `User with email: ${data.email} created!`, id: data.id })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A user with this email already exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => {
    await prisma.$disconnect();
   
  })
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

      const acsessToken = jwt.sign({ id: data["id"], name: data["name"], email: data["email"], photoUrl: data["photoUrl"] }, secret,{
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


export const _updateUserPhoto = (req, res) => {
 
  const id = req.params.id; // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }

  // multer file upload from helpers folder
  upload(req, res, async (err) => {
    
    if (req.fileValidationError) {
      return res.status(400).json({ msg: req.fileValidationError });
    }

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send(`File size should not exceed ${maxFileSize / (1024 * 1024)}MB`);
    }

    if (err) {
      return res.status(500).send('An error occurred during the file upload');
    }

    if (!req.file) {
      return res.status(400).send('No file found. Please upload a file');
    }
     
    // File is uploaded => Update the item's Url
    const pictureUrl = "/images/" + id + path.extname(req.file.originalname);
    
    updatePictureUrl( prisma, id, pictureUrl ) 
      .then(data => {
        // response 
        if (!data)
        return res.status(404).json({ msg: "User not found" });

        // success login
        const secret = process.env.ACCESS_TOKEN_SECRET;
        // token life time
        const acsessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
        const acsessToken = jwt.sign({ id: data["id"], name: data["name"], email: data["email"], photoUrl: data["photoUrl"] }, secret,{
          expiresIn:`${acsessTokenExpiresIn}s`,
        });

          // Store in DB table users tokens (id user_id )
        addToken(prisma, acsessToken, data["id"]  )
        res.json({ msg: `Picture ${pictureUrl} for User ID ${id}  updated!`, token: acsessToken })
      })
      .catch(e => {
        console.log(e);
        // handle specific errors differently
        if (e.code === 'P2025') { // Prisma's unique constraint error
          return res.status(409).json({ msg: "An User with this id don't exists." });
        }
        res.status(500).json({ msg: "Internal server error." }); // or e.message
      })
      .finally(async () => await prisma.$disconnect())  

  });
}


// update user
export const _updateUser = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }
    
  if (!req.body.hasOwnProperty('name') && !req.body.hasOwnProperty('password')) {
    return res.status(400).json({msg: "Wrong request, no params for update."});
  }
  
  var value = "";
  var type = "";

  if (req.body.hasOwnProperty('name')) {
    value = req.body.name;
    type = "name";
  } else if (req.body.hasOwnProperty('password')) {
    value  = req.body.password;
    type = "password";
  }
 
  
  const id = req.params.id; // string 
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  updateItem( prisma, id, type, value ) 
    .then(data => {
    // response with category info
    // if user  does not exist
      if (!data)
        return res.status(404).json({ msg: "User not found" });

      // success login
      const secret = process.env.ACCESS_TOKEN_SECRET;
      // token life time
      const acsessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
      const acsessToken = jwt.sign({ id: data["id"], name: data["name"], email: data["email"], photoUrl: data["photoUrl"] }, secret,{
        expiresIn:`${acsessTokenExpiresIn}s`,
      });

        // Store in DB table users tokens (id user_id )
      addToken(prisma, acsessToken, data["id"]  )

      // return update token
      res.json({ msg: `User's ${type} updated!`, token: acsessToken })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "An Item with this title already exists." });
    }
    if (e.code === 'P2025') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "An Item with this id don't exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}
