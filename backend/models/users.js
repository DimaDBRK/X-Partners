
// register new user
export const register = async (
  prisma, 
  {
    name,
    email,
    hashPassword 
  }) => {
  // ... your Prisma Client queries will go here
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    })
    console.log(newUser)
    return newUser
  } catch (e) {
    console.error('Error creating record in table User:', e);
  throw e;
  }
}

//get all users
export const getAllUsers = async (prisma) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    })
    return allUsers
  } catch (e) {
    console.error('Error get all users from table User:', e);
  throw e;
  }
}

// login
export const login = async (prisma, email) => {
  // find by email
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }, 
      
    })

    return user;
  } catch (e) {
    console.error('Error in DB connection - table User:', e);
  throw e;
  }
}


// add token to white - list table
export const addToken =  async (prisma, tokenValue, userId) => {
  try {
    const token = await prisma.token.create({
      data: {
        token: tokenValue,
        userId: userId,
      },
    });
    return token;
  } catch (e) {
      console.error('Error storing token:', e);
    throw e;
  }
}

// deleteToken
export const deleteToken =  async (prisma, tokenValue) => {
  try {
    const token = await prisma.token.delete({
      where: {
        token: tokenValue,
      },
      
    });
    return token;
  } catch (e) {
    // if token does not exist
    if (e.code === 'P2025') {
      console.error('No token found for deletion.');
    } else {
      console.error('Error deleting token:', e);
    }
  }
}