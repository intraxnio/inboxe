import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from '@mui/material';
import axios from "axios";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CircularProgress from '@mui/material/CircularProgress';
import useTheme from '@mui/system/useTheme';
import 'react-toastify/dist/ReactToastify.css';
import CheckCnameRecordStatusComponent from './CheckCnameRecordStatusButton'
import CheckTxtRecordStatusButton from "./CheckTxtRecordStatusButton";
import CheckDmarcRecordStatusButton from "./CheckDmarcRecordStatusButton";
import CheckSPFRecordStatusButton from "./CheckSPFRecordStatusButton";
import CheckMailFromTxtStatusButton from "./CheckMailFromTxtStatusButton";
import CheckMxRecordStatusButton from "./CheckMxRecordStatusButton";


// import dayjs from 'dayjs';
// import samplePost from '../../images/IMG_2533.jpg'


function VerificationProcessStarts() {


  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user = useSelector((state) => state.brandUser);
  const subdomain_id = searchParams.get("subdomain_id");
  const [loading, setLoading] = useState(false);
  const [recordStatus, setRecordStatus] = useState('');
  const [cnameRecordsStatus, setCnameRecordsStatus] = useState('');
  const [dmarcRecordStatus, setDmarcRecordStatus] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [subdomainData, setSubdomainData] = useState();
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const containerRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied');
  };



  const today = new Date();
  today.setDate(today.getDate() + 1); // Set the minimum allowed date to tomorrow



  const handleBackClick = () => {
    navigate(`/brand/subdomainRequestList`);

  };

  const fetchData = async () => {
    try {
      const res = await axios.post(baseUrl + "/get-subdomain-details", {
        subdomain_id: subdomain_id,
        user_id: user.user_id,
      });
      setSubdomainData(res.data.subdomainData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is stopped even if there is an error
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [user.user_id, subdomain_id]);
  
  

 

  return (
    <>
   <Button startIcon={<KeyboardBackspaceIcon />} onClick={handleBackClick}>Back</Button>

   <Grid container spacing={3} sx={{ padding: '20px' }}>
      {/* Title and Description */}
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Copy and paste authentication information
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
          After your email domain is <strong>verified</strong>, you'll copy some important pieces of information from your Mailchimp account into your domain's CNAME records.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
          Depending on your domain provider or management software, the steps and information you need to create your records may vary. We'll provide you with customized instructions based on the service you use. If your service isn't listed, you can choose a generic set of steps to guide you.
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '16px' }}>
          To find the instructions and authentication information for your domain, follow these steps:
        </Typography>
        <ol>
          <li>
            Click your profile icon and choose <strong>Account</strong>.
          </li>
          <li>Click <strong>Domains</strong>.</li>
          <li>
            Click <strong>Start Authentication</strong> next to the verified email domain you want to work with.
          </li>
        </ol>
      </Grid>

      {/* Table Section */}

      {loading ? (<CircularProgress />) : (<>

      {/* For Subdomain Verification  */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Record Type</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {subdomainData && subdomainData.length > 0 ? (
    <>
              <TableRow>
                <TableCell>TXT</TableCell>
                <TableCell>
                  {subdomainData[0].txtName}
                  <Tooltip title="txt Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].txtName)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].txtValue}
                  <Tooltip title="txt Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].txtValue)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                <CheckTxtRecordStatusButton subdomain_id={subdomain_id} userId={user.user_id} />
                </TableCell>
              </TableRow>
              </>
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">
      Server Error. Please try again later
      </TableCell>
    </TableRow>
  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* For Dmarc Verification  */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Record Type</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {subdomainData && subdomainData.length > 0 ? (
    <>
              <TableRow>
                <TableCell>TXT</TableCell>
                <TableCell>
                  {subdomainData[0].dmarcRecordName}
                  <Tooltip title="txt Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].dmarcRecordName)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].dmarcRecordValue}
                  <Tooltip title="txt Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].dmarcRecordValue)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell>
                <CheckDmarcRecordStatusButton subdomain_id={subdomain_id} userId={user.user_id} />
                </TableCell>
              </TableRow>
              </>
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">
      Server Error. Please try again later
      </TableCell>
    </TableRow>
  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* For SPF Verification  */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Record Type</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {subdomainData && subdomainData.length > 0 ? (
    <>
              <TableRow>
                <TableCell>TXT</TableCell>
                <TableCell>
                  {subdomainData[0].spfTxtName}
                  <Tooltip title="txt Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].spfTxtName)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].spfTxtValue}
                  <Tooltip title="txt Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].spfTxtValue)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell>
                <CheckSPFRecordStatusButton subdomain_id={subdomain_id} userId={user.user_id} />
                </TableCell>
              </TableRow>
              </>
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">
      Server Error. Please try again later
      </TableCell>
    </TableRow>
  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

       {/* For MAIL FROM Verification  */}
       <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Record Type</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {subdomainData && subdomainData.length > 0 ? (
    <>
              <TableRow>
                <TableCell>TXT</TableCell>
                <TableCell>
                  {subdomainData[0].mailFromTxtName}
                  <Tooltip title="txt Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].mailFromTxtName)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].mailFromTxtValue}
                  <Tooltip title="txt Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].mailFromTxtValue)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell>
                <CheckMailFromTxtStatusButton subdomain_id={subdomain_id} userId={user.user_id} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>MX</TableCell>
                <TableCell>
                  {subdomainData[0].mxName}
                  <Tooltip title="mx Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].mxName)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].mxValue}
                  <Tooltip title="mx Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].mxValue)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>

                <TableCell>
                <CheckMxRecordStatusButton subdomain_id={subdomain_id} userId={user.user_id} />
                </TableCell>
              </TableRow>
              </>
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">
      Server Error. Please try again later
      </TableCell>
    </TableRow>
  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* For DKIM (CNAME) Verification  */}
      <Grid item xs={12}>
        <TableContainer component={Paper} sx={{ maxWidth: '100%', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Record Type</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {subdomainData && subdomainData.length > 0 ? (
    <>

              <TableRow>
                <TableCell>CNAME</TableCell>
                <TableCell>
                  {subdomainData[0].cname1Name}
                  <Tooltip title="cname1 Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname1Name)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].cname1Value}
                  <Tooltip title="cname1 Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname1Value)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>CNAME</TableCell>
                <TableCell>
                  {subdomainData[0].cname2Name}
                  <Tooltip title="cname2 Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname2Name)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].cname2Value}
                  <Tooltip title="cname2 Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname2Value)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>


              <TableRow>
                <TableCell>CNAME</TableCell>
                <TableCell>
                  {subdomainData[0].cname3Name}
                  <Tooltip title="cname3 Name">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname3Name)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                {subdomainData[0].cname3Value}
                  <Tooltip title="cname3 Value">
                    <IconButton onClick={() => handleCopy(subdomainData[0].cname3Value)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
              </>
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">
        Server Error. Please try again later
      </TableCell>
    </TableRow>
  )}


            </TableBody>
          </Table>
        </TableContainer>

      <CheckCnameRecordStatusComponent subdomain_id={subdomain_id} userId={user.user_id} />


        <Box
      sx={{
        backgroundColor: '#f5f5f5',
        padding: '16px', 
        marginTop : '16px',
        marginBottom : '36px',
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        Note
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '12px' }}>
        Beginning February 2024, Gmail and Yahoo will require a custom authentication and a published Domain-based Message Authentication, Reporting & Conformance (DMARC) record for anyone sending more than 5,000 emails to Gmail or Yahoo addresses in a 24-hour period. To prevent your emails from bouncing, we strongly recommend authenticating your email domain and configuring DMARC.
      </Typography>
      <Typography variant="body1">
        Also, if you use a free email service like Gmail or Yahoo for your From email address, we strongly recommend you switch to an email address from a private domain, like the one you use for work or for your website.
      </Typography>


     
            
    </Box>
    
      </Grid>

      </>) }

   
    </Grid>

 

    <ToastContainer autoClose= {2000}/>

{/* Create New Code Dialog  */}


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

export default VerificationProcessStarts;
