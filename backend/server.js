import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import u_router from "./routes/users.js";
import m_router from "./routes/menu.js";

dotenv.config();
const app = express();

// Body parser middleware to parse JSON bodies
app.use(express.json());

app.use(cors());
app.use('/api/users', u_router);
app.use('/api/menu', m_router);

// Function to serve all static files inside public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT, () => {
    console.log(`run on port ${process.env.PORT}`);
    });
    
