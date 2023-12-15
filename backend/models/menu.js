import fs from "fs"
import { promises as fsPromises } from 'fs';

//get all Categories
export const getAllCategories = async (prisma) => {
  try {
    const allCategories  = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
      },
      // include: { items: true }, 
    })
    return allCategories
  } catch (e) {
    console.error('Error get all Categories from table Category:', e);
  throw e;
  }
}

// create category
export const createCategory = async (prisma, title) => {
  try {
    const newCategory = await prisma.category.create({
      data: {
        title,
      }
    })

    // After successful creation, fetch and return all categories
    const allCategories = await getAllCategories(prisma);
    return allCategories;

  } catch (e) {
    console.error('Error creating category in table Category:', e);
  throw e;
  }
}

// update category
export const updateCategory = async (prisma, id, title) => {
  try {
    const updatedCategory = await prisma.category.update({
      where: { id }, data: { title }
    })
    
  // After successful creation, fetch and return all categories
  const allCategories = await getAllCategories(prisma);
  return allCategories; 

  } catch (e) {
    console.error('Error updating category in table Category:', e);
  throw e;
  }
}

// delete category
export const deleteCategory = async (prisma, id) => {
  try {
    await prisma.category.delete({
      where: { id }, 
    })
    
  // After successful creation, fetch and return all categories
  const allCategories = await getAllCategories(prisma);
  return allCategories; 

  } catch (e) {
    console.error('Error during delete category in table Category:', e);
  throw e;
  }
}

// Items
//get all items
export const getAllItems = async (prisma) => {
  try {
    const allItems  = await prisma.item.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        categoryId: true,
        pictureUrl: true,
      },
      // include: { items: true }, 
    })
    return allItems
  } catch (e) {
    console.error('Error get all Items from table Item:', e);
  throw e;
  }
}

//create Item
export const createItem = async (prisma, title, description, price, categoryId, authorId) => {
  try {
    const newItem = await prisma.item.create({
      data: {
          title,
          description,
          price,
          categoryId,
          authorId,
      }
    });

    // get all Items
    const allItems = await getAllItems(prisma);
    return allItems; 
    
  } catch (e) {
    console.error('Error during creating new Item:', e);
    throw e;
  }
}

// delete Item
export const deleteItem = async (prisma, id) => {
  try {
    // check if Picture URL exist
    // Fetch  item's  pictureUrl
    const item = await prisma.item.findUnique({
      where: { id: id },
      select: { pictureUrl: true }
    });

    if (item && item.pictureUrl) {
       // picture URL
       const picturePath = `public${item.pictureUrl}`;
   
      // Check if the file exists and delete it
      await fsPromises.unlink(picturePath).catch((e) => console.log(`File not found: ${picturePath}`, e));
    }

    await prisma.item.delete({
      where: { id }, 
    })
    
  // After successful delete, fetch and return all categories
  const allItems = await getAllItems(prisma);
  return allItems; 

  } catch (e) {
    console.error('Error during delete item in table Item:', e);
  throw e;
  }
}

// update Item
export const updateItem = async (prisma, id, title, description, price) => {
  try {
    const updatedItem = await prisma.item.update({
      where: { id }, 
      data: { 
        title,
        description,
        price
       }
    })
    
  // After successful creation, fetch and return all categories
  const allItems = await getAllItems(prisma);
  return allItems; 

  } catch (e) {
    console.error('Error updating Item in table Item:', e);
  throw e;
  }
}


// updatePictureUrl

export const updatePictureUrl = async (prisma, id, pictureUrl) => {
  try {
    const updatedItem = await prisma.item.update({
      where: { id }, 
      data: { 
        pictureUrl,
      }
    })
    
  // After successful => fetch and return all categories
  const allItems = await getAllItems(prisma);
  return allItems; 

  } catch (e) {
    console.error('Error updating Item in table Item:', e);
  throw e;
  }
}

// delete Item Picture
export const deleteItemPicture = async (prisma, id) => {
  try {
    // Fetch  item's  pictureUrl
    const item = await prisma.item.findUnique({
      where: { id: id },
      select: { pictureUrl: true }
    });

    if (!item || !item.pictureUrl) {
      throw new Error('No item found or pictureUrl is not set.');
    }

    // picture URL
    const picturePath = `public${item.pictureUrl}`;
   
    // Check if the file exists and delete it
    await fsPromises.unlink(picturePath);

    // Remove the pictureUrl from the item in the database
    await prisma.item.update({
      where: { id },
      data: { pictureUrl: null },
    });

    // After successful => fetch and return all categories
    const allItems = await getAllItems(prisma);
    return allItems; 

  } catch (e) {
    console.error('Error during delete Item Picture file.');
    throw e;
  }
}