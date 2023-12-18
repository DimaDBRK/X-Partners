import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import 
{ Alert,
  Box, 
  Typography, 
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails 
} from "@mui/material";
import Header from "components/Header";
import ItemCard from "components/Card";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from "axios";
import { unstable_gridFocusColumnGroupHeaderSelector } from "@mui/x-data-grid";

const Accounts = (props) => {
  
  // const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
   
  const { token, setToken, userinfo } = useContext(AppContext);

  
    //web page title for browser
    const title = props.title;
    useEffect(() => {
      document.title = title;
    },[]);
   
    //theme
    const theme = useTheme();
  
       
    // get Users list
    useEffect(()=>{
      getItems();
    }, [])
    
        
    const getItems = async () =>{
      // set the Authorization header - token
      try {
        const headers = {
          "x-access-token": `${token}`,
        };
        const res = await axios.get(`api/users/all`, { headers });
        console.log('res=>',res.data);
        setItems(res.data);
        // setMsg(res.data.msg);
        // setToken(res.data.access_token);
     
      } catch (err) {
        const errMsg = err.response.data.msg || err.response.statusText || "An error occurred";
        setMsg(errMsg);
      }
    };  

    return(
      <Box 
        m="1.5rem 2.5rem"
      >
        <Header title="Accounts" subtitle="Browsing User List" />
        { msg != "" && <Alert severity="warning">{msg}</Alert>}
        <div className="users">
          <Box
            display="flex"
            flexDirection="row" 
            flexWrap="wrap"
            justifyContent="flex-start"
            alignItems="center" 
            gap={1}
          >
            {/* {items.filter(item => item.categoryId === category.id).map(filteredItem => (
            
                < ItemCard key = {filteredItem.id} item = {filteredItem} />

            ))} */}

        {items
          .filter(item => item.id !== userinfo.id)
          .map(filteredItem => (
            <ItemCard key = {filteredItem.id} item = {filteredItem} />
        ))}
          </Box>
        </div>
      </Box>
    )
}

export default Accounts;