import React, { useState, useEffect } from "react";
import { format } from 'date-fns-tz';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Button, TableContainer } from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';
import { deepOrange, green, purple, blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FileCopyIcon from '@mui/icons-material/ContentCopy';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CopyIcon = ({ onClick }) => (
  <FileCopyIcon style={{ cursor: 'pointer', marginLeft: '8px', color: '#362FD9' }} onClick={onClick} />
);




const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: green[500],
    },
    warning: {
      main: purple[500],
    },
    info: {
      main: blue[500],
    },
  },
});





export default function DnsVerificationPage() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.brandUser);
  const [linkData, setLinkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));




  const truncateText = (linkTitle) => {

    if(linkTitle.length > 15){
      return linkTitle.substring(0, 15) + '...'
    }

    else
    return linkTitle;
  }
  
  const handleCopyClick = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
    }
  };


  const fetchData = async () => {
    try {

      await axios.post(baseUrl + "/all-subdomain-details", {
        userId: user.user_id,
      })
      .then((ress) => {
      setLinkData(ress.data.data);
      setLoading(false);
      })
      .catch((e) => {
        // Handle error
      });


    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {

    if(!user.user_id){
      navigate("/");

    }

    else if(user.user_id){
      fetchData();

    }
  }, []);


  const onSubmitVerifyNow = (subdomain_id) => {
    navigate(`/brand/subdomainVerificationPage?subdomain_id=${subdomain_id}`);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case false:
        return 'primary';
      case true:
        return 'secondary';
      default:
        return 'default';
    }
  };
  

  const columns = [
    { 
      field: 'id', 
      headerName: 'S.No', 
      width: 60,
    },

    { 
        field: 'subdomain', 
        headerName: 'Sub Domain', 
        width: 210,
        renderCell: (params) => (
          <div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {params.value.length > 45
                ? params.value.substr(0, 45) + '...'
                : params.value}
            </div>
          </div>
        ),
      },
  
    { 
      field: 'recordsStatus', 
      headerName: 'Status', 
      width: 210,
      renderCell: (params) => (
        <div>
           { params.value ? (
             <Chip
             size='small'
             label='Verified'
             variant="outlined"
             color={getStatusColor(params.value)}
           />
            ) : (
                <Chip
                size='small'
                label='Unverified'
                variant="outlined"
                color={getStatusColor(params.value)}
              />
            )
            }
        </div>
      ),
    },
  

    { 
      field: 'createdDate', 
      headerName: 'Created Date', 
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDateTime = format(date, 'dd-MM-yyyy', { timeZone: 'Asia/Kolkata' });
    
        return (
          <div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {formattedDateTime}
            </div>
          </div>
        );
      },
    },


    {
      field: 'subdomain_id',
      headerName: 'Actions',
      width: 160,
      renderCell: (params) => {

        const recordsStatus = params.row.recordsStatus;
    
        return (
          <>
            {recordsStatus === false ? (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => onSubmitVerifyNow(params.value)}
              >
                Verify Now
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => onSubmitVerifyNow(params.value)}
              >
                Details
              </Button>
            )}
          </>
        );
      },
    }
    


   
  
  
  ];

  const rows = linkData;

  const createCampaign = async (e) => {
    e.preventDefault();

      navigate("/brand/createSubdomain");

  };

  return (

<>
    <ThemeProvider theme={theme}>


    <Button
    startIcon = { < AddCircleOutlineOutlinedIcon />}
    variant="outlined"
    color="primary"
    onClick={createCampaign}
    sx={{ marginBottom: "14px", color: deepOrange[500], marginLeft : '26px' }}
    style={{
      cursor: 'pointer',
      textDecoration: 'none',
      textTransform: 'none'
    }} 
    >
   Add Subdomain
    </Button>

    <TableContainer sx={{ paddingX : '26px'}}>


      {loading ? (<CircularProgress />) : (<>

    {linkData !== null && linkData.length !== 0  ? (

      <DataGrid 
        rows={rows}
        columns={columns}
        sx={{
          "&:focus": {
            outline: "none", // Remove the red border on focus
          },
          paddingX : '10px'
        }}
        isRowSelectable={(params) => {
          return false; // Disable selection for all rows
        }}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection.selectionModel);
        }}
        selectionModel={selectedRows}
        getRowHeight={() => 80} // Set the desired row height
        pageSizeOptions={[10, 20]}
      />
    ) : ( 
      <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <iframe
        width="900"
        height="500"
        src='https://app.supademo.com/demo/xSanFv0U8ZKrRcAeKH7i_'
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        target="_blank"
      ></iframe>

    </div>
  
     )}
    </>) }


    </TableContainer>
    
    </ThemeProvider>

     




<ToastContainer autoClose= {2000}/>

    

    
    </>
  );
}
