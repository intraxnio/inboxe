import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch} from 'react-redux';
import {login} from '../../store/brandSlice';
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";



function BrandLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, getEmail] = useState("");
  const [password, getPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.brandUser);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));



  
  useEffect(() => {

  

    if(user.user_id){

      navigate("/brand/linksCard");

    }
    


  }, []);


  const handleLoginSuccess = async (email_gm, firstName, lastName, picture) => {
  

    setIsLoading(true);

    // await axios.post("/api/usersOn/user-login-gmail",
      await axios.post(baseUrl + "/user-login-gmail",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      toast.warning("All fields are mandatory");
    }

    else{
      setIsLoading(true);

      // await axios.post("/api/usersOn/user-login",
        await axios.post(baseUrl + "/user-login",
        { email: email.toLowerCase(), password: password },
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
        if (err.response && err.response.data.error === "All fields are mandatory") {
          toast.warning("All fields are mandatory");
        } 

        else if (err.response && err.response.data.error === "User does not exists!") {
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

  const signupButton = async () => {

    navigate("/signup/brand");
    

  }

  return (
    <>

{isSmallScreen ? (

<Grid item xs={12} paddingX ={2}>


<form action="#" method="post">

{isLoading ? (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
 <CircularProgress color= 'success' />
</div>
) : ( <>
  <Box
    display="flex"
    flexDirection={"column"}
    maxWidth={450}
    margin="auto"
    marginTop={8}
    padding={1}
  >
   <Typography variant="h5" marginBottom={8} textAlign="center">
                Login to Dashboard
              </Typography>



    <GoogleOAuthProvider clientId="469920600033-ug826mid1h3sug98f30a1spjn90asjdh.apps.googleusercontent.com" >
              <GoogleLogin
                onSuccess={ async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  handleLoginSuccess(decoded.email, decoded.given_name, decoded.family_name, decoded.picture );
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                prompt="select_account"
                
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

              

    <TextField
      type="email"
      id="email"
      onChange={(e) => {
        getEmail(e.target.value);
      }}
      margin="normal"
      variant="outlined"
      label="Work Email"
    ></TextField>
    <TextField
      type="password"
      id="password"
      onChange={(e) => {
        getPassword(e.target.value);
      }}
      margin="normal"
      variant="outlined"
      label="Enter Password"
    ></TextField>

      <Typography variant="body2" sx={{display: 'flex', justifyContent: 'flex-end'}}>
      <Link href="/forgotPassword" underline="none" sx={{ color: '#362FD9'}}>
      Forgot password?
      </Link>
    </Typography>

    <Button
      type="submit"
      onClick={handleSubmit}
      variant="contained"
      sx={{
        marginTop: 2,
        textTransform: "capitalize",
        fontWeight: "300",
        fontSize: 16,
        background: '#362FD9'
      }}
      size="large"
    >
      Login
    </Button>
    <ToastContainer autoClose= {2000}/>

{/* 
    <Typography variant="body2" sx={{marginTop : '5px'}}>
      I agree to{" "}
      <Link href="https://www.broadreach.in/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
        Lynk.is's Terms of Service
      </Link>
    </Typography> */}

    <Button
      variant="outlined"
      size="large"
      sx={{
        marginTop: 3,
        textTransform: "capitalize",
        fontWeight: "400",
        fontSize: 16,
        color: '#362FD9'
      }}
      onClick={signupButton}
    >
      Create new Account Here
    </Button>
  </Box>
  </> )}
</form>
</Grid>
) : (


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
                Let's create a campaign.
              </Typography>

              <Typography textAlign="start"  sx={{fontSize: '22px', color: 'white', paddingX: '20px', paddingTop: '3%'}}>
              Cease the hunt for influencers.
              </Typography>

              </Box>


                <Box
                  display="flex"
                  flexDirection={"column"}
                  margin="auto"
                  padding={1}
                  sx={{ marginTop : '20%'}}
                >
                    
         

                <Typography textAlign="start"  sx={{fontSize: '22px', color: 'white', paddingX: '20px', paddingTop: '2%'}}>

              
              .Reach <br />
              .Engagement <br />
              .Conversions
                </Typography>



                </Box>




        </Grid>

        
        
        <Grid item xs={8}>


          <form action="#" method="post">

          {isLoading ? (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', marginTop: '30%' }}>
           <CircularProgress color= 'success' />
         </div>
         ) : ( <>
            <Box
              display="flex"
              flexDirection={"column"}
              maxWidth={450}
              margin="auto"
              marginTop={8}
              padding={1}
            >
              <Typography variant="h5" marginBottom={6} textAlign="center">
                Login to Dashboard
              </Typography>

              <GoogleOAuthProvider clientId="469920600033-ug826mid1h3sug98f30a1spjn90asjdh.apps.googleusercontent.com" >
              <GoogleLogin
                onSuccess={ async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  handleLoginSuccess(decoded.email, decoded.given_name, decoded.family_name, decoded.picture );
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                className="google-login-button"
                
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


              <TextField
                type="email"
                id="email"
                onChange={(e) => {
                  getEmail(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Work Email"
              ></TextField>

              <TextField
                type="password"
                id="password"
                onChange={(e) => {
                  getPassword(e.target.value);
                }}
                margin="normal"
                variant="outlined"
                label="Enter Password"
              ></TextField>

                <Typography variant="body2" sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Link href="/forgotPassword" underline="none" sx={{ color: '#362FD9'}}>
                Forgot password?
                </Link>
              </Typography>

              <Button
                type="submit"
                onClick={handleSubmit}
                variant="contained"
                sx={{
                  marginTop: 2,
                  textTransform: "capitalize",
                  fontWeight: "300",
                  fontSize: 16,
                  background: '#362FD9'
                }}
                size="large"
              >
                Login
              </Button>

              <ToastContainer autoClose= {2000}/>


              {/* <Typography variant="body2" sx={{marginTop : '5px'}}>
                I agree to{" "}
                <Link href="https://www.broadreach.in/terms-conditions" target="_blank" underline="none" sx={{color: '#362FD9'}}>
                  Lynk.is's Terms of Service
                </Link>
              </Typography> */}

              <Button
                variant="outlined"
                size="large"
                sx={{
                  marginTop: 3,
                  textTransform: "capitalize",
                  fontWeight: "400",
                  fontSize: 16,
                  color: '#362FD9'
                }}
                onClick={signupButton}
              >
                Create new Account Here
              </Button>

            

            </Box>
            </> )}
          </form>
        </Grid>


        

      </Grid>
) }
    </>
  );
}

export default BrandLogin;
