import React, { useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Divider, List, ListItem, Typography, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";





export default function Support() {

  const user = useSelector(state => state.brandUser);
  const navigate = useNavigate();

  useEffect(() => {

    if(!user.user_id){

      navigate("/login/brand");

    }
    


  }, []);


  return (
    <>

    <Grid container justifyContent="center" spacing={4} sx={{marginTop: 5}}>
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" sx={{marginBottom: 3}}>Email Support</Typography>
            <Divider />
            <List>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Priority Email Support
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; 48hr Resolution Window
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Account Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Campaign Setup
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; Bugs Resolution
              </ListItem>
              <ListItem>
                <CheckIcon color="primary" />
                &nbsp;&nbsp; On-demand Reports (PDF)
              </ListItem>
             
            </List>
            <Divider />
          </CardContent>
          <CardActions>
        
            {/* <Typography variant="subtitle1">{getPrice() + '/'}{pricing === 'year' ? 'year' : 'month'}</Typography> */}


            <Button
              variant="outlined"
              color="secondary"
              startIcon={<MailOutlineIcon />}
              style={{marginLeft: '16px', textTransform: 'lowercase'}}
            >
              support@linck.one
            </Button>
          </CardActions>
        </Card>
      </Grid>

    </Grid>
    </>
  );
}