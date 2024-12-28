import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const CheckTxtRecordStatusButton = ({ subdomain_id, userId}) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";



    const checkVerificationStatus = async () => {


        setLoading(true);

            try {
                const response = await axios.post(baseUrl + "/check-spf-txt-record-status", {
                  subdomain_id: subdomain_id,
                  user_id: userId,
                });
                setStatus(response.data);
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
    {status.txtRecordStatus === 'verified' ? (
       <Button 
             variant="outlined" 
             color="success" 
             sx={{ color: 'green', textTransform : 'none' }}
             >
             Verified
             </Button>
    ) : status.txtRecordStatus === 'pending' ? (
      <Button 
        variant="contained" 
        sx={{  backgroundColor: 'orange', color: 'white' }}
      >
       <Tooltip title="DNS migration might take 24-72hrs. We will let you know">
        Pending
    </Tooltip>
      </Button>
    ) : status.txtRecordStatus === 'No attributes found' ? (
      <Button 
        variant="outlined" 
        color="primary" 
        sx={{ marginTop: '16px' }}
        onClick={checkVerificationStatus}
      >
        Verify Now
      </Button>
    ) : null}
  </>
                    ) : ('')}
                    </> 
)}


        </div>
    );
};

export default CheckTxtRecordStatusButton;
