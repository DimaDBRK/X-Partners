import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Box, IconButton, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ItemCard = (props) => {
  const { item } = props;

  const getAge = (birthDateString) => {
    // birthDate is a string in the format "YYYY-MM-DDTHH:mm:ss.SSSZ"
    // Convert  to a Date object
    const birthDate = new Date(birthDateString);
    // Current date
    const currentDate = new Date();
    // diff in years
    const age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has occurred this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
    ) {
      // If the birthday hasn't occurred, subtract 1 from the age
      return  (age - 1)
    } else {
      return age;
    }
  }

  return (
    <Card 
      sx={{
      height: "250px",
      cursor: 'pointer',
      width: "250px",
    }}
    >
      < CardMedia
        image= {""}
        // alt={item.title}
        sx={{ 
          // width: '50%',
          height: '45%', 
          bgcolor: 'text.disabled', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingTop: 0, 
          
        }}
      >
        <Avatar
          alt="Avatar"
          src= { item?.photoUrl === "" ? "/images/avatar.jpg" : item.photoUrl }
          sx={{ width: 100, height: 100 }}
        />

      </CardMedia>
      <CardContent
        sx ={{
          height: '30%',
        }}
        >
        <Typography
              variant="h5"
              overflow="hidden"
              textOverflow="ellipsis"
              marginBottom={0}
              sx={{
                  textTransform: "none",
                  textAlign: "left",
              }}
          >
          {item?.name}
        </Typography>
        <Typography
              variant="b2"
              overflow="hidden"
              textOverflow="ellipsis"
              marginBottom={0}
              sx={{
                  textTransform: "none",
                  textAlign: "left",
              }}
          >
          {(item.birthDate && getAge(item.birthDate) > 7)? `Age: ${getAge(item.birthDate)}`: "No age info"}
        </Typography>
        
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" size="small">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share" size="small">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ItemCard;