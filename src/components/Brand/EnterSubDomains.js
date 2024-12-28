import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  TextField,
  Button,
  Dialog, DialogTitle, DialogActions, DialogContent, Typography
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
// import samplePost from '../../images/IMG_2533.jpg'








function EnterSubDomains() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subdomain, setSubDomain] = useState("");
  const user = useSelector((state) => state.brandUser);
  const [fileType, getFileType] = useState("image");
  const [caption, getCaption] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [dataForm, setDataForm] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Store the selected image file
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";





  const today = new Date();
  today.setDate(today.getDate() + 1); // Set the minimum allowed date to tomorrow

  

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
      setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  
  // const submitSubDomain = async() =>{

  //   setLoading(true);

  //   await axios.post(baseUrl + "/create-dns-records",
  //     { user_id: user.user_id, subdomain: subdomain },
  //     { withCredentials: true}
  //   )
  //   .then((res) => {
  //     setLoading(false);
  //     if(res.data.created)
  //     {

  //     setIsDialogOpen(false);
  //     navigate(`/brand/subdomainVerificationPage?subdomain_id=${res.data.subdomain_id}`);

  //     }

  //     else{
  //                 toast.warning("Invalid Subdomain");
              
  //     }
      
  //   })
  //   .catch((e) => {
  //     // Handle errors
  //   });
  // }



  const submitSubDomain = async () => {
    setIsDialogOpen(false); // Close the first confirmation dialog
    setLoadingDialogOpen(true); // Open the loading dialog
  
    try {
      const res = await axios.post(
        baseUrl + "/create-dns-records",
        { user_id: user.user_id, subdomain: subdomain },
        { withCredentials: true }
      );
  
  
      if (res.data.created) {
      setLoadingDialogOpen(false); // Close the loading dialog
      console.log('frontend hit good');

        navigate(`/brand/subdomainVerificationPage?subdomain_id=${res.data.subdomain_id}`);
      } else {

        console.log('frontend hit');

        setLoadingDialogOpen(false); // Close the loading dialog
        setShowAlert(true);
        setErrorMessage("Invalid Subdomain");
      }
    } catch (error) {
      setLoadingDialogOpen(false); // Close the loading dialog
      setShowAlert(true);
      setErrorMessage("An error occurred while creating DNS records.");
    }
  };
  

  

  const handleBackClick = () => {
    navigate(`/brand/subdomainRequestList`);

  };


  return (
    <>
   {/* <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button> */}
   <Button sx={{ marginBottom : '22px'}}startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>


        <Grid container>



                <Grid item xs={12}>
                  <Typography margin="auto">
                            We need a new subdomain of your main domain to send promotional emails on behalf. Click Here to know how to create a subdomain.
                        </Typography>
                    <Box
                      display="flex"
                      flexDirection={"column"}
                      maxWidth={450}
                      padding={1}
                    >
                        
                        <TextField
                        type="text"
                        id="subdomain"
                        onChange={(e) => {
                          setSubDomain(e.target.value);
                        }}
                        error={Boolean(errorMessage)}
                        helperText={errorMessage}
                        FormHelperTextProps={{
                          sx: {
                           marginTop : '6px'
                           
                          },
                        }}
                        margin="normal"
                        variant="outlined"
                        label="Sub Domain"
                        InputLabelProps={{
                          shrink: true,
                        }}
                         placeholder="Sub Domain"
                      ></TextField>

                    
                    <ToastContainer autoClose={3000}/>
                    
             
                      <Button
                        variant="contained"
                        label="Next"
                        size="large"
                        endIcon={<ArrowRightAltIcon />}
                        sx={{
                          marginTop: "30px",
                          maxWidth: "250px",
                        }}
                        onClick={handleSubmit}
                      >
                        Next
                        {loading && (
                <CircularProgress
                  size={24}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -12, // Center the CircularProgress
                    marginLeft: -12, // Center the CircularProgress
                  }}
                />
              )}
                      </Button>

                      {/* {loading && (
          <CircularProgress size={24} sx={{ marginLeft: '10px' }} /> // Include a material icon here
        )} */}
                    </Box>
                </Grid>

              

        </Grid>


        {subdomain && (
        <ClickAwayListener onClickAway={handleClickAway}>
    <Dialog
  open={isDialogOpen}
  onClose={handleDialogClose}
  disableEscapeKeyDown
  keepMounted
>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent dividers>
    <Typography gutterBottom>
      Please cross-check the entered subdomain. DNS records will be created on the given subdomain.
    </Typography>
    <br />
    <Typography gutterBottom>
      {subdomain ? "1. " + subdomain : ""}
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsDialogOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={submitSubDomain} color="success">
      Proceed
    </Button>
  </DialogActions>
</Dialog>
        </ClickAwayListener>
      )}


{subdomain && (
  <ClickAwayListener onClickAway={handleClickAway}>
<Dialog
open={loadingDialogOpen}
disableEscapeKeyDown
keepMounted
>
<DialogTitle>Fetching Domain Details</DialogTitle>
<DialogContent dividers>
<Box
display="flex"
justifyContent="center"
alignItems="center"
minHeight="100px"
>
<CircularProgress />
</Box>
</DialogContent>
</Dialog>
</ClickAwayListener>

)}


{/* {showAlert && (
  <Alert
    severity="error"
    style={{
      position: "fixed",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    }}
    onClose={()=>{setShowAlert(false)}}
  >
    <AlertTitle>Error</AlertTitle>
    {errorMessage}
  </Alert>
)} */}

    
    </>
  );
}

export default EnterSubDomains;
