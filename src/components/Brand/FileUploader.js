import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Typography, Link } from "@mui/material";
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const FileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const user = useSelector((state) => state.brandUser);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "text/csv") {
      setFile(uploadedFile);
      setError("");
      setMessage("");
    } else {
      setError("Please upload a valid .csv file");
      setFile(null);
    }
  };


  const handleFileRemove = () => {
    setFile(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = () => {

    if (file) {
      onFileUpload(file);
      setMessage("File submitted successfully!");
    }
  };

  return (
    <>
    
    <Typography sx={{ fontSize : '26px', marginBottom : '06px'}}>Upload a file</Typography>
    <Typography sx={{ fontSize: '14px', marginBottom: '26px' }}>
  Not sure how to format your file?{' '}
  <Link
    href="/path-to-sample-file.csv"
    target="_blank"
    sx={{
      color: '#7E1891',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
        color: '#F26B0F',
        fontSize : '14px'
      },
    }}
  >
    click here
  </Link>{' '}
  to download the sample file.
</Typography>
      <div style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", maxWidth: "800px" }}>
        {!file ? (
          <label>
            <input
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            
            <p>Browse or Drag & Drop</p>
            <div>.CSV file</div>
          </label>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{file.name}</span>
            <button onClick={handleFileRemove} style={{ marginLeft: "10px" }}>
              X
            </button>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <Button
        variant="contained"
        disabled={!file}
        endIcon={<ChevronRightOutlinedIcon />}
        onClick={handleSubmit}
        sx={{ marginTop : '22px'}}
      >
        Continue
      </Button>

      {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
    </>
  );
};

export default FileUploader;
