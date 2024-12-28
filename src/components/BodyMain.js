import React from "react";
import { Link } from 'react-router-dom';
import { Typography, Box, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';





function BodyMain() {


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));



  return (
    <>
      <div className="container mx-auto row">

        <div className="container col-md-12 col-lg-12 main-hero-section">
          {/* <div className="row txt-1 megaRes">
            Enhanced
          </div> */}

          <h1 className="row txt-2"  
          style={{
                  lineHeight: '1.3',
  }}>
          Emails That Always
            <br />
            Land Right.
          </h1>

          <h2 className="row txt-4">
          We ensure your emails land where they matter—in your clients' inboxes, not spam folders.
          </h2>

        
        </div>
       

      <div className="col-md-4 col-12 get-started-button-credit-card " >
          <Link to="/login" style={{textDecoration: 'none'}}>
            <button className="btn signup-btn-grad btn-g-fonts" >
              Get Started
            </button>
          </Link>
          <p className="subtext">No credit card required.</p>
      </div>

      </div>

      {isSmallScreen ? (

            <>
      <Box sx={{ background : '#CDC1FF', color: 'black'}}>

            <Stack sx={{ justifyContent : 'center', alignItems : 'center'}}>
                <Typography sx={{ paddingTop : '20%', fontSize : '28px', fontWeight : 500, paddingX : '8%'}}>Why we're best-in-class for Realtors</Typography>
                <Typography sx={{ marginTop : '12px', fontSize : '18px', paddingX : '8%'}}>The #1 email marketing and NO SPAM platform that recommends ways to get more opens, clicks and sales.</Typography>
              </Stack>
      
      
      
            <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '8%', paddingTop : '10%'}}>
      
            <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
              <Typography sx={{ fontSize : '24px', fontWeight : 400}}>Up to 25x ROI</Typography>
              <Typography>seen by Inboxe users*</Typography>
            </Stack>
      
            <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '46px'}}>
              <Typography sx={{ fontSize : '24px', fontWeight : 400}}>4.7 Rating</Typography>
              <Typography>of Inboxe globally</Typography>
            </Stack>
      
              </Stack>


              
            <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '8%', paddingTop : '10%', paddingBottom : '20%'}}>
      
      <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
        <Typography sx={{ fontSize : '24px', fontWeight : 400}}>22 years experience</Typography>
        <Typography>helping businesses sell more</Typography>
      </Stack>

      <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '46px'}}>
        <Typography sx={{ fontSize : '24px', fontWeight : 400}}>97.6% deliverability</Typography>
        <Typography>on average*</Typography>
      </Stack>

        </Stack>
      
      
      
    

      </Box>

      
      </>
      
      
      

      ) : (
        <div className = "hero-card-main-div-frame">

        <div className="row col-md-12 col-lg-12 hero-main-card-design ">
        <div className="col-md-4 col-12 " >
  
        <div className = "main-card-sec-1">
            <Typography sx={{ fontSize : '28px', fontWeight : 500}}>Why we're best-in-class for Realtors</Typography>
            <Typography sx={{ marginTop : '12px', fontSize : '18px', paddingRight : '22px'}}>The #1 email marketing and NO SPAM platform that recommends ways to get more opens, clicks and sales.</Typography>
          </div>
  
        </div>
  
        <div className="col-md-4 col-12 main-card-sec-2">
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '56px'}}>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>Up to 25x ROI</Typography>
          <Typography>seen by Inboxe users*</Typography>
        </Stack>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '56px'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>4.7 Rating</Typography>
          <Typography>of Inboxe globally</Typography>
        </Stack>
  
          </Stack>
  
        </div>
  
        <div className="col-md-4 col-12 main-card-sec-2">
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', paddingX : '56px'}}>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>22 years experience</Typography>
          <Typography>helping businesses sell more</Typography>
        </Stack>
  
        <Stack sx={{ display : 'flex', flexDirection : 'column', marginTop : '56px'}}>
          <Typography sx={{ fontSize : '24px', fontWeight : 400}}>97.6% deliverability</Typography>
          <Typography>on average*</Typography>
        </Stack>
  
          </Stack>
  
        </div>
  
  
  
        </div>
  
        </div>
      )}

     




{/* 
      <div className="container row justify-content-center mt-1 mb-5 pt-4 pb-4 mx-auto">
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          1.2 M <br />{" "}
          <span className="body-bottom-tag-styles">Short Links</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          {"99.9%"} <br />{" "}
          <span className="body-bottom-tag-styles">Uptime SLA</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          250+ <br />{" "}
          <span className="body-bottom-tag-styles">Brands</span>
        </div>
        <div className="container col-6 col-md-3 col-lg-3 text-center body-tag-styles">
          50 M+ <br />{" "}
          <span className="body-bottom-tag-styles">Clicks</span>
        </div>
      </div> */}

      
    </>
  );
}

export default BodyMain;
