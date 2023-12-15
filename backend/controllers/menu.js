import { 
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllItems,
  createItem,
  deleteItem,
  updateItem,
  updatePictureUrl,
  deleteItemPicture
  } from "../models/menu.js";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Save file
import multer from "multer";
import path from "path";
import { upload } from "../helpers/fileUpload.js"
// Categories
// GET  all Categories
export const _getAllCategories = (req, res) => {
  getAllCategories(prisma) 
    .then(data => {
      res.json({ categories: data })
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({ msg: "something went wrong!  " }); // or e.message
    })
    .finally(async () => await prisma.$disconnect())
}

// Create new category
export const _createCategory = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('title')) {
    return res.status(400).json({msg: "Wrong request, no title or other params."});
  }

  const { title } = req.body;
  

  createCategory(prisma, title) 
  .then(data => {
    // response with category info
    res.json({ msg: `Category ${title} created!`, categories: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A category with this title already exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}

// Update category
export const _updateCategory = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('title')) {
    return res.status(400).json({msg: "Wrong request, no title or other params."});
  }
  
  const { title } = req.body;
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  updateCategory(prisma, id, title) 
  .then(data => {
    // response with category info
    res.json({ msg: `Category ${title} updated!`, categories: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A category with this title already exists." });
    }
    if (e.code === 'P2025') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A category with this id don't exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}

// Delete category
export const _deleteCategory = (req, res) => {
  
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  deleteCategory(prisma, id) 
  .then(data => {
    // response with category info
    res.json({ msg: `Category deleted!`, categories: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2025') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "A category with this id don't exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}

// Items
// GET  all Items
export const _getAllItems = (req, res) => {
  getAllItems(prisma) 
    .then(data => {
      res.json({ items: data })
    })
    .catch(e => {
      console.log(e);
      res.status(404).json({ msg: "something went wrong!  " }); // or e.message
    })
    .finally(async () => await prisma.$disconnect())
}

// Create new Item
export const _createItem = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }

  if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('authorId')) {
    return res.status(400).json({msg: "Wrong request, no title or other params."});
  }

  const { title, description, price, categoryId, pictureUrl, authorId } = req.body;
  
  createItem(prisma, title, description, price, categoryId, authorId)
  .then(data => {
    // response with Items info
    res.json({ msg: `Item ${title} created!`, items: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2002') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "An Item with this title already exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}


// Delete Item
export const _deleteItem = (req, res) => {
  
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  deleteItem(prisma, id) 
  .then(data => {
    // response with category info
    res.json({ msg: `Item with ID ${id} deleted!`, items: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2025') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "An Item with this id don't exists." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}

// Update Item
export const _updateItem = (req, res) => {
  // check if body exist
  if (!req.body) { 
    return res.status(400).json({ msg: "Wrong request body." });
  }
    
  if (!req.body.hasOwnProperty('title') || !req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('price')) {
    return res.status(400).json({msg: "Wrong request, no title or other params."});
  }
  
  const { title, description, price } = req.body;
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  updateItem( prisma, id, title, description, price ) 
  .then(data => {
    // response with category info
    res.json({ msg: `Item ID ${id} ${title} updated!`, items: data })
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


export const _updateItemPicture = (req, res) => {
 
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
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
     
    // File is uploaded => Update the item's pictureUrl
    const pictureUrl = "/images/" + id + path.extname(req.file.originalname);
    
    updatePictureUrl( prisma, id, pictureUrl ) 
      .then(data => {
        // response with category info
        res.json({ msg: `Picture ${pictureUrl} for Item ID ${id}  updated!`, items: data })
      })
      .catch(e => {
        console.log(e);
        // handle specific errors differently
        if (e.code === 'P2025') { // Prisma's unique constraint error
          return res.status(409).json({ msg: "An Item with this id don't exists." });
        }
        res.status(500).json({ msg: "Internal server error." }); // or e.message
      })
      .finally(async () => await prisma.$disconnect())  

  });
}

// Delete Item
export const _deleteItemPicture = (req, res) => {
  
  const id = parseInt(req.params.id, 10); // string should be parsed as a base-10 number
  if (!id) {
    return res.status(400).json({msg: "Wrong request, no id or other params."});
  }
  
  deleteItemPicture(prisma, id) 
  .then(data => {
    // response with category info
    res.json({ msg: `Picture Item with ID ${id} deleted!`, items: data })
  })
  .catch(e => {
    console.log(e);
    // handle specific errors differently
    if (e.code === 'P2025') { // Prisma's unique constraint error
      return res.status(409).json({ msg: "An Item Picture with this id don't exists." });
    }
    if (e.code === 'ENOENT') { //No file or directory
      return res.status(409).json({ msg: "Picture file not found." });
    }
    res.status(500).json({ msg: "Internal server error." }); // or e.message
  })
  .finally(async () => await prisma.$disconnect())
}
