# X-Partners
![Logo](/docs/screens/XPlogo.png)
# Description: 
Home Page (route /):

1.1. Registration Form. Fields - name, email, password, date of birth, gender, profile photo;
1.2. Authorization Form;

Profile (route /account):

2.1. Form for editing fields - name, password, profile photo;

Accounts (route /people):

3.1. Display of user cards of other users;
Upon entering this page, a list of all users except the current one is displayed.
3.2. Account card consists of:
- Profile photo;
- Name;
- Age;


## Web Service Overview

The application allows viewing and editing the restaurant menu through a web interface.

- Frontend: React + Axios
- Backend: Node.js + MongoDB + Prisma
- Authentication System: basic, JWT-based

Demo video: TBC

![Accounts](/docs/screens/accounts.jpg)
## Table of Contents

- [X-Partners](#x-partners)
- [Description:](#description)
  - [Web Service Overview](#web-service-overview)
  - [Table of Contents](#table-of-contents)
  - [Database](#database)
  - [Backend and API](#backend-and-api)
  - [Frontend](#frontend)
  - [Authentication](#authentication)
  - [Installation](#installation)

## Database

Prisma automates every part of setup and running of MongoDB clusters.
For details check backend - prisma - schema.prisma
There are Tables:

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String    @unique
  name      String?
  password  String
  gender    String
  birthDate DateTime
  photoUrl  String
  tokens    Token[]
}

model Token {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  token     String    @unique
  userId    String    @db.ObjectId
  user      User      @relation(fields: [userId], references: [id])
}

## Backend and API

Node.js server.
List of API’s:

User
* POST /api/users/login
* POST /api/users/register
* GET /api/users/all
* GET /api/users/logout
* POST /api/users/update_photo/{ID}
* PATCH /api/users/update/{ID}
* DELETE /api/users/delete_picture/{ID}


## Frontend
Pages and main components.
![Profile](/docs/screens/profile.jpg)
Main components:
* Homepage - Login and Register
* Accounts - to show Users cards 
* Profile - edit name, password, update Picture (Photo)
![Register](/docs/screens/register.jpg)


Nav bar:
* Logo "XP" with link to Home page
* Accounts (if User Login) buttons
* Switch themes button
* User Photo, Name 
* Log out and Profile in additional menu

## Authentication

Simple token-based authentication employs one token, which stored in LocalStorage after LogIn and deleted after LogOut. Auth by email and password.

## Installation
1. .env file for server includes:
- PORT=3030 => by server side, could be modify (don't forget to change proxy settings on frontend)
- DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@CONNECTION/NAME"
  example: postgresql://username:password@localhost:5432/mydatabase 
- ACCESS_TOKEN_SECRET=...
- ACCESS_TOKEN_EXPIRES_IN=86400 #24h


Frontend: For correct cookies and requests Proxy set: in package.json: "proxy": "http://127.0.0.1:3030",

You can modify port, but pay attention If there is problem on MacOS: Mac OSX Monterey (12.x) and later currently uses ports 5000 and 7000 for its Control centre hence the issue. Try running your app from port other than 5000 and 7000 Change port on 5001 (example).

1. Clone the repository:

```bash
git clone REPO NAME
cd yourproject

2. Install the dependencies for the Node.js server:
cd backend
npm install

Start the Node.js server:
npm start

3.Install the dependencies for the React frontend:
cd ../frontend
npm install

Start the React development server:
npm start

4. Connect Prisma to DB
npx prisma migrate dev --name init
This command does two things:
It creates a new SQL migration file for this migration
It runs the SQL migration file against the database

5. The Node.js server will run and the React development server will run on http://localhost:3030. You can access the application by opening your web browser and navigating to http://localhost:3000.
