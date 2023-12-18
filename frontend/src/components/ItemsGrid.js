import React from 'react'
import { AppContext } from "App";
import { Box, Button, Typography, useTheme, Autocomplete, TextField, Grid } from "@mui/material";
import { DataGrid, GridToolbar, GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useContext,  useState, useEffect } from "react";
import axios from "axios";
import { RequestPageSharp } from '@mui/icons-material';


const ItemsGrid = (props) => {
  const {  userinfo } = useContext(AppContext);
  const theme = useTheme();
  
  //get data
  const [data, setData] = useState([]);

  const [checkboxSelection, setCheckboxSelection] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [isAddSection, setIsAddSection] = useState(false);
  // New Item
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [isAddButtonActive, setIsAddButtonActive] = useState(true);
  const [isUpdateButtonActive, setIsUpdateButtonActive] = useState(true);
  const [selectedItem, setSelectedItem] = useState(undefined);
  // file
  const [uploadFileName, setUploadFileName] = useState(undefined);
  const [uploadFile, setUploadFile] = useState(undefined);
  const [uploadFileUrl, setUploadFileUrl] = useState(null);
  const [cacheBustingTimestamp, setCacheBustingTimestamp ] = useState(new Date().getTime());
  
  const setMsg = props.setMsg;
  const setItems = props.setItems;
  const category = props.category;
  const title = props.title;
  

  useEffect(()=>{
    setData(filterByCategory(props.items, category));
    setCacheBustingTimestamp(new Date().getTime());
  }, [props])
  
  // functions

  // filter list
  const filterByCategory = (items, categoryId) => {
    // Use the filter 
    return items.filter(item => item.categoryId === categoryId);
  }

  // New Item
  const handleChangeNewItemTitle = (event) => {
    console.log(event.target.value);
    setNewItemTitle(event.target.value);
    setIsAddButtonActive(checkInput(event.target.value, newItemDescription, newItemPrice, category, userinfo.id));
  }

  const handleChangeNewItemDescription = (event) => {
    console.log(event.target.value);
    setNewItemDescription(event.target.value);
    setIsAddButtonActive(checkInput(newItemTitle, event.target.value, newItemPrice, category, userinfo.id ));

  }

  const handleChangeNewItemPrice = (event) => {
    // Regex matches integers and floats (including those with decimals)
    const numberRegex = /^(\d+)?(\.\d{0,2})?$/;
    if (event.target.value === '' || numberRegex.test(event.target.value)) {
      // parse if the value is not empty
        setNewItemPrice(event.target.value);
        setIsAddButtonActive(checkInput(newItemTitle, newItemDescription, event.target.value, category, userinfo.id ));
    }
  }

  const checkInput = (title, description, price, category, id) => {
    console.log("category", category)
    if (title != "" &&  description != "" && price > 0 && id) {
      return false
    }
    return true
  }

  const clearNewItemInputs = () => {
    setNewItemPrice('');
    setNewItemDescription('');
    setNewItemTitle('');
    setIsAddButtonActive(true);
  }

  // Selected Item change

  const handleChangeSelectedItemPrice = (event) => {
    // Regex matches integers and floats (including those with decimals)
    const numberRegex = /^(\d+)?(\.\d{0,2})?$/;
    if (numberRegex.test(event.target.value)) {
      setSelectedItem({
        ...selectedItem, price: event.target.value
      });
      // setIsAddButtonActive(checkInput(newItemTitle, newItemDescription, event.target.value, category, userinfo.id ));
    } 
    setIsUpdateButtonActive(checkUpdateInput(selectedItem.title, selectedItem.description, event.target.value, selectedItem.id));
  }

  const handleChangeSelectedItemTitle = (event) => {
    console.log(selectedItem)
    setSelectedItem({
      ...selectedItem, title: event.target.value
    });
    setIsUpdateButtonActive(checkUpdateInput(event.target.value, selectedItem.description, selectedItem.price, selectedItem.id));
  }

  const handleChangeSelectedItemDescription = (event) => {
    console.log(selectedItem)
    setSelectedItem({
      ...selectedItem, description: event.target.value
    });
    setIsUpdateButtonActive(checkUpdateInput(selectedItem.title, event.target.value, selectedItem.price, selectedItem.id));
    
  }
  
  const getSelectedItemInfoById = (items, id) => {
    console.log("data", items, id[0])
    if (items.length === 0) {
      console.error('Items array is null, undefined, or empty');
      return {};
    }
    const selectedItem = items.find(item => item.id === id[0]);
    console.log(selectedItem);
    return selectedItem;
  }

  const checkUpdateInput = (title, description, price, id) => {
    console.log("category", category)
    if (title != "" &&  description != "" && price > 0 && id) {
      return false
    }
    return true
  }

  const clearSelectedItem = () => {
    setSelectedItem({});
  }

  const clearFileUpload = () => {
    setUploadFileName(undefined);
    setUploadFile(undefined);
    setUploadFileUrl(null);
  }

  // Requests

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
      setUploadFileName(name)
      setUploadFile(file)
    } else {
      setMsg("No file found!");
    }

   
  };
  
  // delete Item
  const deleteItem = async (id) => {
    console.log("Button delete Item =>", id)
    setMsg("");
    // // -> delete
    try {
      const res = await axios.delete(`/api/menu/items/delete/${id}`);
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        setItems(res.data.items);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }
  
  // Add Item
  const addItem = async () => {
    console.log("Button Add Item =>", userinfo.id);
    setMsg("");
    // add req
    try {
      const res = await axios.post(`/api/menu/items/create`, 
        {
          "title": newItemTitle,
          "description": newItemDescription,
          "categoryId": category,
          "price": parseFloat(newItemPrice),
          "authorId": userinfo.id
        }
        );
      if (res.status === 200 || res.status === 201) {
        console.log(res.data);
        setMsg(res.data.msg);
        console.log(res.data.data)
        setItems(res.data.items);
        clearNewItemInputs();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }

  // Update Item
  const updateItem = async (id) => {
    console.log("Button Update Item =>");
    setMsg("");
    // -> 
    try {
      const res = await axios.put(`api/menu/items/update/${id}`, 
        {
          "title": selectedItem.title,
          "description": selectedItem.description,
          "price": parseFloat(selectedItem.price),
        }
        );
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        setItems(res.data.items);
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
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
        `api/menu/items/update_picture/${id}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
        setItems(res.data.items);
        // setSelectedItem(getSelectedItemInfoById(res.data.items, [id]));
        // prevent picture caching
        setCacheBustingTimestamp(new Date().getTime());
        // set new url
        setSelectedItem(getSelectedItemInfoById(res.data.items, [id]));
        // setSelectedItem({
        //   ...selectedItem, pictureUrl: `${selectedItem.pictureUrl}?t=${cacheBustingTimestamp}`
        // });
        // ClearUpdatedFile
        clearFileUpload();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }
   
  
  
  // Picture Item delete
  const itemPictureDelete = async (id) => {
    console.log("Button delete Item Picture=>", id)
    setMsg("");
    if (!id) {
      setMsg("No Item ID for Picture delete found.");
      return;
    }
    // // -> delete
    try {
      const res = await axios.delete(`/api/menu/items/delete_picture/${id}`);
      if (res.status === 200 || res.status === 201) {
        setMsg(res.data.msg);
      
        setSelectedItem(getSelectedItemInfoById(res.data.items, [id]));
        setItems(res.data.items);
        clearFileUpload();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
    }
  }


  //start 
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.3,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.2,
    },
    {
      field: "pictureUrl",
      headerName: "Picture",
      flex: 0.2,
    },
    
    
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0.3,
    // },
  ]
 
  return (
  
    <Box
    
    // minHeight="40vh"
    width="100%"
    >
      {/* Add Item section */}
     { !isAddSection && (
       <Button
        variant="outlined"
        sx={{ mb: 1, mt: 1 }}
        size="small"
        onClick={()=>{setIsAddSection(true)}}
      >
        Add Item
      </Button>
      )}
      { isAddSection && (
        <>
      <Typography variant="h6"  sx={{ mb: 1, mt: 1 }}>
        Add Item
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1, mb: 1, mx: 1}}
          onClick={()=>{ setIsAddSection(false); setMsg(""); clearNewItemInputs() }}
        >
        Close
        </Button>
        
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {/* Item title */}
          <Grid item xs={6}>
            <TextField
              disabled= {false}
              size="small"
              fullWidth
              id="item-title"
              label="Title"
              name="itemtitle"
              autoComplete="title"
              maxRows={1}
              value={newItemTitle}
              onChange ={handleChangeNewItemTitle} // 
              // onBlur={()=>{}}
            />
          </Grid>
        {/* Item description */}
          <Grid item xs={6}>
            <TextField
              disabled= {false}
              size="small"
              fullWidth
              id="item-description"
              label="Description"
              name="itemdescription"
              autoComplete="description"
              multiline
              maxRows={3}
              value={newItemDescription}
              onChange ={handleChangeNewItemDescription} // 
              // onBlur={()=>{}}
            />
          </Grid>
           {/* Item price */}
           <Grid item xs={3}>
            <TextField
              disabled= {false}
              size="small"
              fullWidth
              id="item-price"
              label="Price"
              name="itemdprice"
              autoComplete="price"
              multiline
              maxRows={3}
              value={newItemPrice}
              onChange ={handleChangeNewItemPrice} // 
              // onBlur={()=>{}}
            />
          </Grid>

        </Grid>
      </Box>
    
 
      <Button
          disabled={isAddButtonActive}
          variant="contained"
          color="success"
          size="small"
          sx={{ mt: 1, mb: 1, mx: 1}}
          onClick={()=>{ addItem() }}
          // disabled={newUsers.length === 0}
        >
        add
        </Button>
      </>
      )}
    { data.length > 0 ? (
    <Box>
      <Typography>
        Items in {category}
      </Typography>
      <DataGrid
        loading={data?.length < 1}
        getRowId={(row) => row.id}
        rows={data || []}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        // checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
          setMsg("");
          setSelectedItem(getSelectedItemInfoById(data, newRowSelectionModel));
          // console.log(rowSelectionModel)
        }}
      /> 
      {/* Edit menu start */}
      { title != "User" && (
      <Button
        sx={{ mt: 1}}
        variant="outlined"
        onClick={() => {
          setCheckboxSelection(!checkboxSelection); 
          setMsg("");
          setSelectedItem(getSelectedItemInfoById(data, rowSelectionModel))
        
        }}
        size="small"
      >
        Edit mode
      </Button>
      )}
      { (checkboxSelection) && (
        <Box>
          <Typography>
            { rowSelectionModel.length === 0 ? "Select Item" : "Item ID selected: " + rowSelectionModel }
          </Typography>
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            color="error"
            size="small"
            disabled={rowSelectionModel.length === 0}
            onClick={() => deleteItem(rowSelectionModel)}
          >
            Delete
          </Button>
         
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* Selected Item title */}
              <Grid item xs={6}>
                <TextField
                  disabled={rowSelectionModel.length === 0}
                  size="small"
                  fullWidth
                  id="item-title"
                  label="Title"
                  name="itemtitle"
                  autoComplete="title"
                  maxRows={1}
                  value={ selectedItem? selectedItem.title : "" }
                  onChange ={handleChangeSelectedItemTitle} // 
                  // onBlur={()=>{}}
                />
              </Grid>
            {/* Item description */}
              <Grid item xs={6}>
                <TextField
                  disabled={rowSelectionModel.length === 0}
                  size="small"
                  fullWidth
                  id="item-description"
                  label="Description"
                  name="itemdescription"
                  autoComplete="description"
                  multiline
                  maxRows={3}
                  value={ selectedItem? selectedItem.description : "" }
                  onChange ={handleChangeSelectedItemDescription} // 
                  // onBlur={()=>{}}
                />
              </Grid>
              {/* Item price */}
              <Grid item xs={3}>
                <TextField
                  disabled={rowSelectionModel.length === 0}
                  size="small"
                  fullWidth
                  id="item-price"
                  label="Price"
                  name="itemdprice"
                  autoComplete="price"
                  multiline
                  maxRows={3}
                  value={ selectedItem? selectedItem.price : "" }
                  onChange ={handleChangeSelectedItemPrice} // 
                  // onBlur={()=>{}}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isUpdateButtonActive}
                  onClick={() => updateItem(selectedItem.id)}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
           {/* Picture Image */}
          <Box>
            <Typography>
              Edit image
            </Typography>
            <Grid container spacing={2}>
              <Grid 
                item xs={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography>
                  Current
                </Typography>
                 {/* Current picture */}
                <Box
                  component="img"
                  src= { selectedItem? (selectedItem.pictureUrl != null ? `${selectedItem.pictureUrl}?t=${cacheBustingTimestamp}` : "/images/icon.jpg") : "/images/icon.jpg"}
                  // alt="Current picture"
                  sx={{ 
                    width: '100px',
                    height: '100px', 
                    bgcolor: 'text.disabled', 
                    // display: 'flex', 
                    // alignItems: 'start', 
                    // justifyContent: 'end',
                  }}
                />
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={rowSelectionModel.length === 0}
                  onClick={() => itemPictureDelete(selectedItem.id)}
                >
                  Remove Picture
                </Button>
                
              </Grid>
              <Grid 
                item xs={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography>
                  New
                </Typography>
               {/* New picture */}
                <Box
                  component="img"
                  src= { uploadFileUrl === "" ? "/images/icon.jpg" : uploadFileUrl }
                  // alt="New picture"
                  sx={{ 
                    width: '100px',
                    height: '100px', 
                    bgcolor: 'text.disabled', 
                    // display: 'flex', 
                    // alignItems: 'start', 
                    // justifyContent: 'end',
                  }}
                />
                <Button
                  size='small'
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Select File
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
                <Button
                  sx={{ mt: 1 }}
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={(rowSelectionModel.length === 0)}
                  onClick={() => itemPictureUpdate(selectedItem.id, uploadFile)}
                >
                  Update
                </Button>
             </Grid>
          </Grid>
         
          </Box>
        </Box>
      )}
       

      {/* Edit menu end */}

    </Box>)
    : (<Typography>
        No Menu Items in Category found
      </Typography>
      )
    }
     
    </Box>
  )
}

export default ItemsGrid;