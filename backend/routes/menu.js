import express from 'express';
import { 
  _getAllCategories,
  _createCategory,
  _updateCategory,
  _deleteCategory,
  _getAllItems,
  _createItem,
  _deleteItem,
  _updateItem,
  _updateItemPicture,
  _deleteItemPicture
} from '../controllers/menu.js';

// it is traffic controller
const m_router = express.Router();

m_router.get('/categories/all', _getAllCategories);
m_router.post('/categories/create', _createCategory);
m_router.put('/categories/update/:id', _updateCategory);
m_router.delete('/categories/delete/:id', _deleteCategory);
m_router.get('/items/all', _getAllItems);
m_router.post('/items/create', _createItem);
m_router.delete('/items/delete/:id', _deleteItem);
m_router.put('/items/update/:id', _updateItem);
m_router.post('/items/update_picture/:id', _updateItemPicture);
m_router.delete('/items/delete_picture/:id', _deleteItemPicture);

export default m_router;