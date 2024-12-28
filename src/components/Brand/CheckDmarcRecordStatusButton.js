import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const CheckDmarcRecordStatusButton = ({ subdomain_id, userId}) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";



    const checkVerificationStatus = async () => {

            try {
                const response = await axios.post(baseUrl + "/check-dmarc-record-status", {
                  subdomain_id: subdomain_id,
                  user_id: userId,
                });
                setStatus(response.data.dmarcRecordStatus);
                setLoading(false);
             
        } catch (error) {
            setLoading(false);
            console.error('Error checking status:', error);
            // setStatus('Error fetching status');
        } finally {
            setLoading(false);
        }
    };


      useEffect(() => {
        setLoading(true);
        checkVerificationStatus();
      }, [userId, subdomain_id]);
      

    return (
        <div>

{loading ?  ( <CircularProgress
                  size={24}
                  style={{
                   color : 'orange'
                  }}
                />) : (
                    <>
                    { status != null ? (
                       
                        <>
    {status === 'verified' ? (
       <Button 
             variant="outlined" 
             color="success" 
             sx={{ color: 'green', textTransform : 'none' }}
             >
             Verified
             </Button>
             
    ) : status === 'policy-missing' ? (
      <Button 
        variant="contained" 
        sx={{  backgroundColor: 'orange', color: 'white' }}
        onClick={checkVerificationStatus}

      >
       <Tooltip title="DNS migration might take 24-72hrs. We will let you know">
        Policy Missing
    </Tooltip>
      </Button>
    ) : status === 'not-found' ? (
      <Button 
        variant="outlined" 
        color="primary" 
        sx={{ marginTop: '16px' }}
        onClick={checkVerificationStatus}
      >
        Verify Now
      </Button>
    ): status === 'error' ? (
      <Button 
        variant="outlined" 
        color="primary" 
        sx={{ marginTop: '16px' }}
        onClick={checkVerificationStatus}
      >
        Verify Now
      </Button>
    ) 
    
    : null}
  </>
                    ) : ('')}
                    </> 
)}


        </div>
    );
};

export default CheckDmarcRecordStatusButton;
