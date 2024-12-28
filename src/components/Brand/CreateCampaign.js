import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Stack, Grid, Box, Autocomplete, Chip } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import EmailTemplate from './EmailTemplate1';
import { useSelector } from "react-redux";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';



const CreateCampaign = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Untitled');
  const [tempTitle, setTempTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFromInput, setShowFromInput] = useState(false);
  const [showSubjectInput, setShowSubjectInput] = useState(false);
  const [fromText, setFromText] = useState('');
  const [fromSubject, setFromSubject] = useState('');
  const [fromPreview, setFromPreview] = useState('');
  const [subjectText, setSubjectText] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [tempFromText, setTempFromText] = useState('');
  const [tempSubjectText, setTempSubjectText] = useState('');
  const [tempPreviewText, setTempPreviewText] = useState('');
  const [isTemplateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [fetchedTags, setFetchedTags] = useState([]);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";
  const user = useSelector((state) => state.brandUser);
  const [loading, setLoading] = useState(false);


 const fetchData = async () => {
    try {
      const res = await axios.post(baseUrl + "/get-all-tags-with-count", {
        user_id: user.user_id,
      });
      console.log('Tags : ', res.data.tags);
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



  const handleEditClick = () => {
    setTempTitle(title); // Set the temporary title to the current title when editing starts
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (tempTitle.trim() !== '') {
      setTitle(tempTitle); // Update the title with the new value
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Close the text view without saving changes
  };

  const handleTagChange = (event, newValue) => {

    const allContactsTag = newValue.find((option) => option.tag === 'All Contacts');
    if (allContactsTag) {
      setSelectedTags([{ tag: 'All Contacts', _id: allContactsTag.tag_id, count : allContactsTag.count }]);
    } else {
      // Map the newValue to the desired format
      const formattedTags = newValue.map((option) => ({
        tag: option.tag,
        _id: option.tag_id,
        count: option.count,
      }));
  
      setSelectedTags(formattedTags);
    }
  };
  

  const handleFromSave = () => {
    setFromText(tempFromText); // Save the tempFromText to fromText
    setShowFromInput(false); // Close the input section
  };


  const handleFromCancel = () => {
    setShowFromInput(false); // Close the input section without saving
    setTempFromText(fromText); // Revert to original text
  };

  const handleSubjectSave = () => {
    setSubjectText(tempSubjectText); // Save the tempFromText to fromText
    setPreviewText(tempPreviewText); // Save the tempFromText to fromText
    setShowSubjectInput(false); // Close the input section
  };


  const handleSubjectCancel = () => {
    setShowSubjectInput(false); // Close the input section without saving
    setTempSubjectText(fromSubject); // Revert to original text
    setTempPreviewText(fromPreview); // Revert to original text
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={6} md={6} sx={{ paddingX : '12px'}}>
          {isEditing ? (
            <TextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              variant="outlined"
              color="secondary"
              label="Edit Title"
              fullWidth
            />
          ) : (
            <Typography sx={{ fontSize: '26px' }}>{title}</Typography>
          )}

          {isEditing ? (
            <Stack direction="row" spacing={2} sx={{ marginTop: '16px' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSaveClick}
                sx={{ paddingX: '22px', textTransform: 'none' }}
              >
                Save
              </Button>
              <Button
                color="primary"
                onClick={handleCancelClick}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <Button
              onClick={handleEditClick}
              sx={{ fontSize: '14px', textTransform: 'none' }}
            >
              Edit title
            </Button>
          )}
        </Grid>
      </Grid>

      <Box display="flex" flexDirection="column" sx={{paddingX: '12px' }}>
        <Typography sx={{ marginTop: '44px' }}>To</Typography>

        <div style={{ maxWidth: '800px', marginTop: '10px', marginBottom: '12px' }}>
        <Autocomplete
  multiple
  options={fetchedTags} // Options: [{ tag: 'New Year', count: 12, _id: 'tag_id123' }]
  getOptionLabel={(option) => `${option.tag} (${option.count})`}
  value={selectedTags}
  onChange={(event, newValue) => handleTagChange(event, newValue)} // Pass newValue to handler
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={option._id}
        label={`${option.tag} (${option.count || ''})`}
        sx={{ margin: '4px', backgroundColor: '#D4EBF8' }}
        {...getTagProps({ index })}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="Select Contacts"
      placeholder="Choose Contacts"
    />
  )}
  disableCloseOnSelect
/>



          <Typography sx={{ fontSize: '14px', color: '#3C3D37', marginTop: 1 }}>
            It will help to identify contacts based on tag. Ex: Hyderabad List, Christmas Offer etc.
          </Typography>
        </div>

        {/* From Section */}
      <Box  sx={{ marginTop: '12px', marginBottom: '12px',  cursor: 'pointer' }}>
        {/* Collapsible Box with "From" Text and Arrow */}
        <Box
        onClick={() => setShowFromInput(!showFromInput)}
          sx={{
            display: 'flex',
            alignItems: 'center',
           
          }}
         
        >
          <Typography sx={{ flex: 1, color: '#3C3D37' }}>
            From
          </Typography>
          {showFromInput ? <ArrowDropUp /> : <ArrowDropDown />} {/* Toggle arrow */}
        </Box>

        {/* Input Field displayed when the box is expanded */}
        {showFromInput ? (
          <Box >
            <Typography sx={{ fontSize: '14px', color: '#3C3D37', marginBottom: '8px' }}>
              Who is sending this campaign?
            </Typography>
        <div style={{ maxWidth: '800px', marginTop: '16px' }}>

            <TextField
              label="Name"
              value={tempFromText}
              onChange={(e) => setTempFromText(e.target.value)}
              fullWidth
            />
            </div>
            <Typography sx={{ fontSize: '14px', color: '#3C3D37', marginBottom: 2, marginTop: 1 }}>
            Use something subscribers will instantly recognize, like your company name.
          </Typography>
            <Stack direction="row" spacing={2} sx={{ marginTop: '16px', marginBottom: '16px' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleFromSave}
                sx={{ textTransform: 'none', paddingX : '22px' }}
              >
                Save
              </Button>
              <Button
                color="primary"
                onClick={handleFromCancel}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography sx={{ fontSize: '14px', color: '#3C3D37'}}>{fromText || 'Who is sending this campaign?'}</Typography>
        )}
      </Box>


 {/* Subject Section */}
      <Box  sx={{ marginTop: '12px', marginBottom: '12px',  cursor: 'pointer' }}>
        {/* Collapsible Box with "From" Text and Arrow */}
        <Box
        onClick={() => setShowSubjectInput(!showSubjectInput)}
          sx={{
            display: 'flex',
            alignItems: 'center',
           
          }}
          
        >
          <Typography sx={{ flex: 1, color: '#3C3D37' }}>
            Subject
          </Typography>
          {showSubjectInput ? <ArrowDropUp /> : <ArrowDropDown />} {/* Toggle arrow */}
        </Box>

        {/* Input Field displayed when the box is expanded */}
        {showSubjectInput ? (
          <Box >
            <Typography sx={{ fontSize: '14px', color: '#3C3D37', marginBottom: '8px' }}>
             What is the subject line for this campaign?
            </Typography>
        <div style={{ maxWidth: '800px', marginTop: '16px' }}>

            <TextField
              label="Subject"
              value={tempSubjectText}
              onChange={(e) => setTempSubjectText(e.target.value)}
              fullWidth
              sx={{ marginBottom : '16px'}}
            />

            <TextField
              label="Preview Text"
              value={tempPreviewText}
              onChange={(e) => setTempPreviewText(e.target.value)}
              fullWidth
            />

<Typography sx={{ fontSize: '14px', color: '#3C3D37', marginBottom: 2, marginTop: 1 }}>
            Preview text appears in the inbox after the subject line.
          </Typography>


            </div>
            <Stack direction="row" spacing={2} sx={{ marginTop: '44px', marginBottom: '24px' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSubjectSave}
                sx={{ textTransform: 'none', paddingX : '22px' }}
              >
                Save
              </Button>
              <Button
                color="primary"
                onClick={handleSubjectCancel}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
            <>
          <Typography sx={{ fontSize: '14px', color: '#3C3D37'}}>{subjectText || 'What is the subject line for this campaign?'}</Typography>
          <Typography sx={{ fontSize: '14px', color: '#3C3D37'}}>{previewText ? 'Preview Text : '+ previewText :''}</Typography>
          </>
        )}
      </Box>

      {/* Content Section */}
      <Box  onClick={() => setTemplateEditorOpen(!isTemplateEditorOpen)} sx={{ marginTop: '12px', marginBottom: '12px',  cursor: 'pointer' }}>
        
  <Stack sx={{ display: 'flex', flexDirection: 'column' }}>
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ color: '#3C3D37' }}>
        Content
      </Typography>
      {isTemplateEditorOpen ? <ArrowDropUp /> : <ArrowDropDown />}
    
    </Stack>
    <Typography sx={{ color: '#3C3D37', fontSize: '14px' }}>
      Design the content for your email
    </Typography>
  </Stack>
</Box>

{isTemplateEditorOpen && (
        <div className="inline-template-editor">
          <EmailTemplate    
         campaignTitle={title}
         tags={selectedTags}
         from={fromText}
         subject={tempSubjectText}
         previewText={tempPreviewText}/>
        </div>
      )}

     
      </Box>

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
      
    </>
  );
};

export default CreateCampaign;
