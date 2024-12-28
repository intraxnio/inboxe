import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  Rating, 
  Avatar, 
  Stack, ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { toast } from "react-toastify";
import sideImage from "../../images/IMG_1025.jpg";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch} from 'react-redux';
import {login} from '../../store/brandSlice';







function BrandSignup() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  

  const handleLoginSuccess = async (email_gm, firstName, lastName, picture) => {
  

    setIsLoading(true);

    // await axios.post("/api/usersOn/user-login-gmail",
      await axios.post( baseUrl + "/user-login-gmail",
    { email: email_gm, firstName: firstName, lastName: lastName, picture : picture },
    {withCredentials: true}
  )
  .then((res) => {

      const user_id = res.data.userObj.user_id;
      const user_email = res.data.userObj.user_email;
      const userDetails = { user_email, user_id };

       dispatch(login(userDetails));
       setIsLoading(false);
      navigate("/brand/linksCard");

  })
  .catch((err) => {
      toast.error("An error occurred. Please try again later.");
  });

  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  const handleInputChange = (e) => {
    setHandle(e.target.value);
    setIsFocused(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    if (handle === '') {
      setIsFocused(false);
    }
  };

  async function submit(e) {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;

    if(!email || !password  ){
      toast.warning("All fields are mandatory");
    }

    else if(!emailRegex.test(email)){
      toast.warning("Invalid email address");
    }

    else{

      setIsLoading(true);

      try {
          // const response = await axios.post("/api/usersOn/signup-user", {
          const response = await axios.post(baseUrl + "/signup-user", {
          email: email,
          password: password,
        });
    
        if (response.data.success) {
          setIsLoading(false);
          

          setIsDialogOpen(true);

          

        } else {
          // Handle other errors or display a generic error toast
          setIsLoading(false);
          toast.error("An error occurred. Please try again later.");
        }
      

      } catch (error) {
        if (error.response && error.response.data.error === "User already exists") {
          setIsLoading(false);
          toast.warning("User already exists. Please login to continue...");
        }
        
        else if (error.response && error.response.data.error === "All fields are mandatory") {
          setIsLoading(false);
          toast.warning("All fields are mandatory");
        }
         else {
          setIsLoading(false);
          toast.error("Technical Error. Please try again later.");
        }
      }

    }
  
  
  }

  const checkPin = async (e) => {
    e.preventDefault();

    if(!emailCode){
        toast.warning("Enter valid 6-digit Pin");
      }

      else {


      // await axios.post("/api/usersOn/check-resetPin-withDb-brandTemps",
        await axios.post(baseUrl + "/check-resetPin-withDb-brandTemps",
        { email: email.toLowerCase(), pin : emailCode },
        {withCredentials: true}
      )
      .then((res) => {

            setLoading(true);

            if(!res.data.matching){
                setLoading(false);
                toast.error("Invalid Pin");

            }
            else if(res.data.matching){
                
                setLoading(false);
                setIsDialogOpen(false);
                toast.success("Account created successfully. Please login to continue...");

                setTimeout(() => {
                  navigate("/");
                }, 2000);
                  }

      })
      .catch((err) => {

        if (err.response && err.response.data.error === "User does not exists!") {
          toast.warning("User does not exists");
        } 

        else if (err.response && err.response.data.error === "email, password mismatch") {
          toast.warning("Invalid email or password");
        } 
        
        else {
          toast.error("An error occurred. Please try again later.");
        }
      });

    }

    
  };

  const loginButton = async () => {

    navigate("/login");
    

  }
  
  

  return (
    <>
{/* <Grid container spacing='2'> */}

{isSmallScreen ? ( 

<Grid item xs={12} paddingX={2}>
  
<form action='#' method='post'>


{isLoading ? (
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
<CircularProgress color= 'success' />
</div>
) : ( <>

    <Box 
    display='flex' 
    flexDirection={'column'} 
    maxWidth={450} 
    margin='auto'
    marginTop={15}
    padding={1}


    >
      <Typography variant='h5' textAlign='center' padding={3}>Create Account</Typography>

      <TextField type='email' id='email' sx={{ marginBottom : '12px'}} onChange={(e)=>{setEmail(e.target.value)}} variant='outlined' label='Work Email'></TextField>
      <TextField type='password' id="password"  sx={{ marginBottom : '12px'}} onChange={(e)=>{setPassword(e.target.value)}} variant='outlined' label='Create a Password'></TextField>


      <Button type='submit' onClick={submit} variant='contained' 
              sx={{
                    marginTop:3,
                    textTransform:'capitalize',
                    fontWeight: '300',
                    fontSize: 16,
                    background: '#362FD9'
                    }} 
              size='large'>Create Account</Button>

<Typography variant="body2" sx={{marginTop : '5px'}}>
              I agree to{" "}
              <Link href="https://www.broadreach.in/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
                Lynk.is's Terms of Service
              </Link>
            </Typography>
        <Button variant='outlined' size='large' 
      sx={{
        marginTop:3,
        textTransform:'capitalize',
        fontWeight: '300',
        fontSize: 16,
        fontWeight: "400",
        color: '#362FD9'

        }} 
        onClick={loginButton}
        >Already have an account? Login here</Button>
    </Box>

    </>)}

    <ToastContainer autoClose={2000} />


    </form>
</Grid> ) : (

<Grid container spacing="1" sx={{ height: '100vh' }}>



<Grid item xs={4} sx={{ background: '#362FD9' }}>

              <Box
              display="flex"
              flexDirection={"column"}
              margin="auto"
              padding={1}
              
               >
                      
              <Typography textAlign="start"  sx={{
                fontSize: '46px', 
                fontWeight: '500', 
                color: 'white', 
                paddingX: '20px', 
                paddingTop: '25%',

                }}>
                Welcome to our community.
              </Typography>

              <Typography textAlign="start"  sx={{fontSize: '22px', color: 'white', paddingX: '20px', paddingTop: '3%'}}>
               Unlock new horizons for unparalleled reach and engagement.
              </Typography>

              </Box>


                <Box
                  display="flex"
                  flexDirection={"column"}
                  margin="auto"
                  padding={1}
                  sx={{ marginTop : '20%'}}
                >
                    
                <Rating
                sx={{ paddingX : '20px'}} 
                name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />

                <Typography textAlign="start"  sx={{fontSize: '14px', color: 'white', paddingX: '20px', paddingTop: '2%'}}>
                "We're enthusiastic about BroadReach, a novel automated influencer marketing platform. It's a tool for marketers that we never knew existed until now!"
                </Typography>


                <Stack 
                display="flex"
                flexDirection={'row'}
                padding={1}
                sx={{marginTop : '5%', paddingX: '20px'}}
                >

                <Avatar alt="Travis Howard" src={sideImage} sx={{ width: 40, height: 40 }}/>
                <Box 
                display ='flex'
                flexDirection={'column'}
                >
                <Typography textAlign="start"  sx={{fontSize: '14px', color: 'white', paddingX: '20px' }}>
                Karan Jaiswal <br />
                </Typography>

                <Typography textAlign="start"  sx={{fontSize: '12px', color: '#E4F1FF', paddingX: '20px' }}>
                Marketing, BuzzerStudio
                </Typography>
                </Box>

                

                </Stack>



                </Box>




        </Grid>

  <Grid item xs={8}>
  
  <form action='#' method='post'>


{isLoading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
 <CircularProgress color= 'success' />
</div>
) : ( <>

      <Box 
      display='flex' 
      flexDirection={'column'} 
      maxWidth={450} 
      margin='auto'
      marginTop={8}
      >
        <Typography variant='h5' textAlign='center' marginBottom={8} >Create Account</Typography>


        <GoogleOAuthProvider clientId="469920600033-ug826mid1h3sug98f30a1spjn90asjdh.apps.googleusercontent.com" >
              <GoogleLogin
                onSuccess={ async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  handleLoginSuccess(decoded.email, decoded.given_name, decoded.family_name, decoded.picture );
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                
              />
              
                </GoogleOAuthProvider>


              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginTop={2}
              >
                <hr
                  style={{
                    flex: '1',
                    borderTop: '1px solid #ccc',
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ paddingX: 2 }}
                >
                  or
                </Typography>
                <hr
                  style={{
                    flex: '1',
                    borderTop: '1px solid #ccc',
                  }}
                />
              </Box>

        <TextField type='email' id='email' margin='normal' onChange={(e)=>{setEmail(e.target.value)}} variant='outlined' label='Work Email'></TextField>
        <TextField type='password' id="password"  margin='normal' onChange={(e)=>{setPassword(e.target.value)}} variant='outlined' label='Create a Password'></TextField>


        <Button type='submit' onClick={submit} variant='contained' 
                sx={{
                      marginTop:3,
                      textTransform:'capitalize',
                      fontWeight: '300',
                      fontSize: 16,
                      background: '#362FD9'
                      }} 
                size='large'>Create Account</Button>

<Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="https://www.broadreach.in/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
                  Lynk.is's Terms of Service
                </Link>
              </Typography>
          <Button variant='outlined' size='large' 
        sx={{
          marginTop:3,
          textTransform:'capitalize',
          fontWeight: '300',
          fontSize: 16,
          fontWeight: "400",
          color: '#362FD9'

          }} 
          onClick={loginButton}
          >Already have an account? Login here</Button>
      </Box>

      </>)}

      <ToastContainer autoClose={2000} />


      </form>
</Grid>


</Grid>
)}



{email && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            disableEscapeKeyDown
            keepMounted
          >
            <DialogTitle>Verify Email</DialogTitle>
            <DialogContent dividers>
          
            <Typography sx={{fontSize: '16px', marginTop: '5px'}} >
                Please enter 6-digit code which was sent to {email}
              </Typography>

              <TextField
                type="email"
                id="email"
                onChange={(e) => {
                    setEmailCode(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="6-digit code"
                value={emailCode}
              ></TextField>

        </DialogContent>
            <DialogActions>
              <Button onClick={()=> setIsDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="success" onClick={checkPin}>
                SUBMIT
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      )}



    </>
  )
}

export default BrandSignup