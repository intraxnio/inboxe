import React, { useState, useEffect } from "react";
import FileUploader from "./FileUploader";
import OrganizeContacts from "./OrganizeFileContacts";
import { useSelector } from "react-redux";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Tooltip, Link
} from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import axios from "axios";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';




  

const BulkContactsUpload = () => {

  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fetchedTags, setFetchedTags] = useState([]);
  const statuses = ["Subscribed", "Unsubscribed"];
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const user = useSelector((state) => state.brandUser);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidEmails, setInvalidEmails] = useState();
  const [validEmailsCount, setValidEmailsCount] = useState(0);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };


  const fetchData = async () => {
    try {
      const res = await axios.post(baseUrl + "/get-all-tags", {
        user_id: user.user_id,
      });
      setFetchedTags(res.data.tags);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is stopped even if there is an error
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [user.user_id]);
  
  

  const handleContinue = async (formData) => {
    if (!uploadedFile) {
      console.error("File not uploaded");
      return;
    }

    const fullData = new FormData();
    fullData.append("file", uploadedFile);
    fullData.append("status", formData.selectedStatus);
    fullData.append("fetchedTags", formData.selectedTags);
    fullData.append("updateExisting", formData.updateExisting);
    fullData.append("user_id", user.user_id);

    try {

      setLoading(true);
      // await fetch(baseUrl + "/upload-bulk-contacts", {
      //   method: "POST",
      //   body: fullData,
      // })
      
      await axios.post(baseUrl + "/upload-bulk-contacts", fullData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((result) => {
          setLoading(false);
          setInvalidEmails(result.data.data.allInvalidEmails);
          setValidEmailsCount(result.data.data.validContactsLength);
          setIsDialogOpen(true);


        })
        .catch((e) => {
          // Handle errors
        });
  
  } catch (error) {
      console.error("Error submitting form and file:", error);
    }
  };


  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const createCampaign = async() =>{

      setIsDialogOpen(false);
      navigate("/brand/createCampaign");
  }

  const goToContactsScreen = async() =>{

    setIsDialogOpen(false);
    navigate("/brand/allContacts");
 
}

  

  return (
    <>
    <div>
      {!uploadedFile ? (
        <FileUploader onFileUpload={handleFileUpload} />
        
      ) : (
        <OrganizeContacts
          statuses={statuses}
          tags={fetchedTags}
          onContinue={handleContinue}
        />
      )}
    </div>

    <ClickAwayListener onClickAway={handleClickAway}>
  <Dialog
    open={isDialogOpen}
    onClose={handleDialogClose}
    disableEscapeKeyDown
    keepMounted
    fullWidth
    maxWidth="md"
  >
    {validEmailsCount !== undefined ? (
      validEmailsCount > 0 ? (
        <>
          {/* Content for successful upload with valid emails */}
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <DoneAllOutlinedIcon style={{ color: 'green', marginRight: 8 }} />
              {validEmailsCount} Contacts Uploaded Successfully
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {invalidEmails && (
            <Typography gutterBottom>
              {invalidEmails.length} out of {invalidEmails.length + validEmailsCount} contacts are{' '}
            
              <Tooltip title="These contacts might have incorrect email addresses or formatting issues.">
                <span style={{ color: '#7E1891', cursor: 'pointer' }}>invalid</span>
              </Tooltip>{' '}
              and could not be uploaded. You can download the below invalid contacts{' '}
              <Link
                href="/path-to-sample-file.csv"
                target="_blank"
                sx={{
                  color: '#7E1891',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                    color: '#F26B0F',
                    fontSize: '14px',
                  },
                }}
              >
                here
              </Link>
              .
            </Typography>
      )}

            <TableContainer component={Paper} style={{ maxHeight: 300, marginTop: 16 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invalidEmails &&
                    invalidEmails.map((email, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{email}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </>
      ) : (
        <>
          {/* Content for when there are no valid emails */}
          <DialogTitle>
            <Box display="flex" alignItems="center" color="red">
              <ErrorOutlineOutlinedIcon style={{ color: 'red', marginRight: 8 }} />
              No Contacts Uploaded
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {invalidEmails && (
            <Typography gutterBottom>
              All {invalidEmails.length} contacts are invalid and could not be uploaded. Please
              check the formatting of the email addresses and try again. You can download the
              invalid contacts{' '}
              <Link
                href="/path-to-sample-file.csv"
                target="_blank"
                sx={{
                  color: '#7E1891',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                    color: '#F26B0F',
                    fontSize: '14px',
                  },
                }}
              >
                here
              </Link>
              .
            </Typography>

)}

            <TableContainer component={Paper} style={{ maxHeight: 300, marginTop: 16 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invalidEmails &&
                    invalidEmails.map((email, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{email}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </>
      )
    ) : (
      <>
        {/* Content for when the response is still loading */}
        <DialogTitle>
          <Box display="flex" alignItems="center" color="orange">
            <CircularProgress size={24} style={{ marginRight: 8 }} />
            Loading Contacts...
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>Please wait while we process the data...</Typography>
        </DialogContent>
      </>
    )}
    <DialogActions>
      {validEmailsCount > 0 && (
        <Button onClick={createCampaign} color="success">
          Create Campaign
        </Button>
      )}
      <Button onClick={goToContactsScreen} color="primary">
        Done
      </Button>
    </DialogActions>
  </Dialog>
</ClickAwayListener>




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

<ToastContainer autoClose={3000}/>



    </>
  );
};

export default BulkContactsUpload;
