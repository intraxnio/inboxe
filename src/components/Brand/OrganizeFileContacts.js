import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  TextField,
  Chip,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { useSelector } from "react-redux";
import axios from "axios";



const OrganizeContacts = ({ statuses, tags, onContinue }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const user = useSelector((state) => state.brandUser);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [searchTag, setSearchTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState(tags); // Initially show all tags
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  // const baseUrl = "http://localhost:8001/usersOn";
  const baseUrl = "/api/usersOn";


  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTag(value);
  
    if (value) {
      // Filter tags dynamically based on input
      const matches = tags.filter((tagObj) =>
        tagObj.tag.toLowerCase().includes(value.toLowerCase())
      );
      
      // If no matches are found, show the dynamic "Create tag" option
      if (matches.length > 0) {
        setFilteredTags(matches);  // Show matching tags
      } else {
        setFilteredTags([{ tag: `+ Create tag: ${value}`, tag_id: value }]); // Show the "Create tag" option
      }
  
      setIsDropdownOpen(true);
    } else {
      // Show all tags if input is cleared
      setFilteredTags(tags);
      setIsDropdownOpen(true);
    }
  };
  
  

  const handleTagSelect = (tagObj) => {
    const tag = tagObj.tag; // Extract the tag name from the object
  
    if (tag.startsWith("+ Create tag:") && searchTag) {
      // Add the custom tag if "Create Tag" is clicked
      const newTag = searchTag.trim();
      if (!selectedTags.some((t) => t.tag === newTag)) {  // Check if the tag already exists
        setSelectedTags([
          ...selectedTags,
          { tag: newTag, tag_id: newTag }  // For custom tags, use tag as the id
        ]);
        setIsDropdownOpen(false);
      }
    } else if (!selectedTags.some((t) => t.tag === tag)) {  // Check if tag exists before adding
      const selectedTagObj = tags.find((t) => t.tag === tag);  // Find tag object from existing tags
      if (selectedTagObj) {
        setSelectedTags([...selectedTags, selectedTagObj]);
        setIsDropdownOpen(false);
      }
    }
  
    setSearchTag("");  // Clear the search input
    setFilteredTags(tags);  // Reset the dropdown
  };

  
  
  

const handleClickOutside = (event) => {
  if (
    dropdownRef.current &&
    !dropdownRef.current.contains(event.target)
  ) {
    setIsDropdownOpen(false);
  }
};

useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Handle removing a tag
  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag.tag_id !== tagToRemove.tag_id));
  };

  const handleContinue = async () => {


    const newTags = selectedTags.filter(tag => !tags.some(existingTag => existingTag.tag === tag.tag));

    if (newTags.length > 0) {
      // Proceed with the API call only if new tags are detected
      try {
        const newTagResponse = await axios.post(baseUrl + "/create-new-tag", {
          user_id: user.user_id,
          selectedTags: selectedTags,
        });

        if(newTagResponse.data.created){

          const allSelectedTags = newTagResponse.data.tag_ids;

          onContinue({
            selectedStatus,
            updateExisting,
            selectedTags: allSelectedTags
          });


        }
  
      } catch (error) {
        console.error('Error creating new tags:', error);
      }
    }

    else{

      onContinue({
        selectedStatus,
        updateExisting,
        selectedTags: selectedTags.map((tagObj) => tagObj.tag_id),  // Send only tag_id to onContinue
      });

    }

    
  };
  

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={6}>
        <Typography sx={{ fontSize: "26px", marginBottom: "06px" }}>
          Organize your contacts
        </Typography>

        {/* Status Selector */}
        <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 2 }}>
          <InputLabel id="status-select-label"
          sx={{
            opacity: selectedStatus ? 0 : 1, // Hide label after selection
          }}>
            Select a status
          </InputLabel>
          <Select
            labelId="status-select-label"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            displayEmpty
            sx={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                paddingLeft: 1.5,
              },
            }}
          >
            {statuses.map((status, index) => (
              <MenuItem key={index} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography sx={{ fontSize: "14px", marginBottom: "26px", color: "#3C3D37" }}>
          When you choose the "Subscribed" status for your contacts, it indicates
          that you've gained permission to market to them. Learn more about the{" "}
          <Link
            href="/path-to-sample-file.csv"
            target="_blank"
            sx={{
              color: "#7E1891",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
                color: "#F26B0F",
                fontSize: "14px",
              },
            }}
          >
            Importance of Permission.
          </Link>
        </Typography>

        {/* Display Selected Tags */}
<div style={{ display: "flex", flexWrap: "wrap", marginBottom: "8px" }}>
  {selectedTags.map((tagObj, index) => (
    <Chip
      key={index}
      label={tagObj.tag}  // Display the tag name
      onDelete={() => handleTagRemove(tagObj)}  // Pass the entire tag object to handle removal
      sx={{ margin: "4px", backgroundColor: "#D4EBF8" }}
    />
  ))}
</div>



        {/* Search and Dropdown for Tags */}
        <div
      ref={dropdownRef}
      style={{ position: "relative", marginBottom: "16px" }}
    >
      <TextField
        value={searchTag}
        onChange={handleSearchChange}
        onFocus={() => setIsDropdownOpen(true)} // Open on focus
        label="Search or create a custom tag"
        variant="outlined"
        fullWidth
        sx={{
          backgroundColor: "#fff",
          borderRadius: "4px",
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            paddingLeft: 1.5,
          },
        }}
      />



      {isDropdownOpen && filteredTags.length > 0 && (
        <List
          sx={{
            position: "absolute",
            width: "100%",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            zIndex: 10,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
           {filteredTags.map((tag, index) => (
    <ListItem key={index} disablePadding>
      <ListItemButton onClick={() => handleTagSelect(tag)}>
        <ListItemText primary={tag.tag} />
      </ListItemButton>
    </ListItem>
  ))}
        </List>



      )}
    </div>

        <Typography sx={{ fontSize: "14px", color: "#3C3D37", marginBottom: 2 }}>
          It will help to identify contacts based on tag. Ex: Hyderabad List,
          Christmas Offer etc.
        </Typography>

        {/* Checkbox for updating existing contacts */}
        <div>
  <FormControlLabel
    control={
      <Checkbox
        checked={updateExisting}
        onChange={(e) => setUpdateExisting(e.target.checked)}
        color="primary"
        sx={{ alignSelf: 'flex-start' }}
      />
    }
    label={
      <div style={{ display: 'flex', flexDirection: 'column', marginTop : '8px' }}>
        <span>Update any existing contacts</span>
        <Typography sx={{ fontSize: "14px", color: "#686D76", marginTop: "4px" }}>
                We'll automatically replace their information with the data from
                your import. Otherwise, these duplicates won't be imported.
              </Typography>
      </div>
    }
    sx={{ alignItems: 'flex-start' }}
  />
</div>


        {/* Submit Button */}
        <Button
          variant="contained"
          disabled={!selectedStatus || !selectedTags || !updateExisting}
          startIcon={<BackupOutlinedIcon />}
          onClick={handleContinue}
          sx={{ marginTop: "22px", textTransform: "none" }}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrganizeContacts;
