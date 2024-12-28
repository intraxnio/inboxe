import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  List, ListItem, ListItemButton, ListItemText, Chip, DialogContentText, Stack
} from '@mui/material';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Slide from '@mui/material/Slide';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";




const Contacts = () => {
  const [selectedTab, setSelectedTab] = useState("AllContacts");
  const navigate = useNavigate();
  const user = useSelector((state) => state.brandUser);
  const dropdownRef = useRef(null);
  const [filterTag, setFilterTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [invalidEmailDialog, setInvalidEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const statuses = ["Subscribed", "Unsubscribed"];  
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadSuccessDialog, setUploadSuccessDialog] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const baseUrl = "/api/usersOn";

  
  
  
  


  const itemsPerPage = 20;

  // Fetch paginated contacts with optional tag filter
  const fetchData = async (page = 1, tag = "") => {
    setLoading(true);
    try {
      const res = await axios.post(baseUrl + "/get-all-contacts", {
        user_id: user.user_id,
        page,
        limit: itemsPerPage,
        tag, // Pass the selected tag to the backend
      });
      setAllContacts(res.data.contacts);
      setTotalContacts(res.data.total);

      const fetchAllTags = await axios.post(baseUrl + "/get-all-tags", {
        user_id: user.user_id });
        setAllTags(fetchAllTags.data.tags);

    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, filterTag);
  }, [user.user_id, currentPage, filterTag]); // Refetch data when user, page, or filter changes

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedContacts((prevState) =>
      prevState.includes(id)
        ? prevState.filter((contactId) => contactId !== id)
        : [...prevState, id]
    );
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTag(value);
  
    if (value) {
      // Filter tags dynamically based on input
      const matches = allTags.filter((tagObj) =>
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
      setFilteredTags(allTags);
      setIsDropdownOpen(true);
    }
  };

  const handleTagSelect = (tagObj) => {
    console.log('selected :', tagObj);
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
      const selectedTagObj = allTags.find((t) => t.tag === tag);  // Find tag object from existing tags
      if (selectedTagObj) {
        setSelectedTags([...selectedTags, selectedTagObj]);
        setIsDropdownOpen(false);
      }
    }
  
    setSearchTag("");  // Clear the search input
    setFilteredTags(allTags);  // Reset the dropdown
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

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Open dialog
  const handleDialogOpen = () => {
    setEmail("");
    setName("");
    setDialogOpen(true);
  };

  const handleBulkUpload = () => {
    setEmail("");
    setName("");
    navigate('/brand/bulkContactsUpload');
  };

  // Close dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };


  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleCloseInvalidEmailDialog = () => {
    setInvalidEmailDialog(false);
  };

  const handleClickAway = () => {
    //this function keeps the dialogue open, even when user clicks outside the dialogue. dont delete this function
  };


  const handleSave = async () => {

    setDialogOpen(false);

    setLoading(true);

    const newTags = selectedTags.filter(tag => !allTags.some(existingTag => existingTag.tag === tag.tag));

    if (newTags.length > 0) {
      // Proceed with the API call only if new tags are detected
      try {
        const newTagResponse = await axios.post(baseUrl + "/create-new-tag", {
          user_id: user.user_id,
          selectedTags: selectedTags,
        });

        if(newTagResponse.data.created){

          const allSelectedTags = newTagResponse.data.tag_ids;

         
    try {
      const res = await axios.post(baseUrl + "/upload-single-contact", {
        user_id: user.user_id,
        email: email,
        name: name,
        tags: allSelectedTags,
        status: selectedStatus,
      });

      if(res.data.created){

        setLoading(false);
        setUploadSuccessDialog(true);
        setTimeout(() => {
          setUploadSuccessDialog(false);
          window.location.reload();
          
        }, 2000);
        }

        else {
          setLoading(false);
          setInvalidEmailMessage(res.data.message);
          setInvalidEmailDialog(true);

        }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }

        }
  
      } catch (error) {
        console.error('Error creating new tags:', error);
      }
    }

    else{

          
    try {
      const res = await axios.post(baseUrl + "/upload-single-contact", {
        user_id: user.user_id,
        email: email,
        name: name,
        tags: selectedTags.map((tagObj) => tagObj.tag_id),
        status: selectedStatus,
      });

      if(res.data.created){

        setLoading(false);
        setUploadSuccessDialog(true);
        setTimeout(() => {
          setUploadSuccessDialog(false);
          window.location.reload();
          
        }, 2000);
        }

        else {
          setLoading(false);
          setInvalidEmailMessage(res.data.message);
          setInvalidEmailDialog(true);

        }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); 
    }
    }

    // tag creation 
    
   
  };

  const handleDelete = async () => {
    try {
      // Make the DELETE request to your backend with the selected contact IDs
      const deletedRes = await axios.post(baseUrl + '/delete-contacts', { ids: selectedContacts });
      
      if(deletedRes.data.deleted){

      setSelectedContacts([]);
      toast.success('Contact(s) Successfully Deleted !');
      
       fetchData();
       setDeleteDialog(false)
      }

      else{
        setSelectedContacts([]);
        toast.warning(deletedRes.data.message);
  
        }
      // Optionally reset the selectedContacts array after successful deletion
      
      // You can also show a success message or perform any other action after deletion
    } catch (error) {
      console.error("Error deleting contacts:", error);
      alert("An error occurred while deleting the contacts");
    }
  };
  


  return (
    <Box p={2}>
      {/* Title and Add Contacts Dropdown */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
        <Typography variant="h5">Contacts</Typography>
        <Typography variant="h5" sx={{ fontSize : '18px', marginLeft : '8px'}}>({totalContacts})</Typography>


        </Stack>
        <FormControl size="small" sx={{ ml: 2, minWidth: 160 }} variant="outlined">
          <InputLabel id="upload-contacts" >Add Contact</InputLabel>
          <Select
  labelId="upload-contact-label"
  value=""
  label="Add Contact"
>
  <MenuItem value="Single" onClick={handleDialogOpen}>
    Single Contact
  </MenuItem>
  <MenuItem value="Bulk" onClick={handleBulkUpload}>
    Bulk Upload
  </MenuItem>
</Select>

        </FormControl>
      </Box>

      {/* Header with Tabs and Filter */}
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          sx={{ textTransform : 'none', fontSize : '16px'}}
          variant={selectedTab === "AllContacts" && !filterTag ? "contained" : "outlined"}
          onClick={() => { setSelectedTab("AllContacts"); setFilterTag(""); }}
        >
          All Contacts
        </Button>

        <FormControl size="small" sx={{ ml: 2, minWidth: 200 }} variant="outlined">
  <InputLabel id="filter-by-tags-label">Filter by Tags</InputLabel>
  <Select
    labelId="filter-by-tags-label"
    value={filterTag}
    onChange={(e) => setFilterTag(e.target.value)}
    label="Filter by Tags"
  >
    {allTags && allTags.map((tag, index) => (
      <MenuItem key={index} value={tag.tag_id}>
        {tag.tag}
      </MenuItem>
    ))}
  </Select>
</FormControl>

{selectedContacts.length > 0 && (
  <Box display="flex" justifyContent="flex-start" ml={2}>
    <Button 
      variant="outlined" 
      color="secondary" 
      onClick={()=> setDeleteDialog(true)}
    >
      DELETE
    </Button>
  </Box>
)}



      </Box>

      {/* Contacts Table */}
      <Box sx={{ maxHeight: 480, overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px" }}>
       

        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox disabled />
              </TableCell>
              <TableCell>S.No</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allContacts.map((contact, index) => (
              <TableRow key={contact.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleCheckboxChange(contact.id)}
                  />
                </TableCell>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Typography mt={2}>Total Contacts: {totalContacts}</Typography>
      <Pagination
        count={Math.ceil(totalContacts / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ display: 'flex', justifyContent: 'center' }}
      />

      {/* Dialog for adding/editing a contact */}
          <ClickAwayListener onClickAway={handleClickAway}>
      
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

       {/* Tag  */}

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
      {/* Status  */}

            <FormControl size="small" sx={{minWidth: 200, mt: 2, ml: 1 }} >
                    <InputLabel id="status-select-label"
                    sx={{
                      opacity: selectedStatus ? 0 : 1,
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


        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={handleSave} color="primary">
            SAVE
          </Button>
        </DialogActions>
      </Dialog>

      </ClickAwayListener>

      <Dialog
        open={uploadSuccessDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Contact Uploaded
          </DialogContentText>
        </DialogContent>
       
      </Dialog>

      <ClickAwayListener onClickAway={handleClickAway}>
      <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {selectedContacts.length} contacts?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          CANCEL
        </Button>
        <Button onClick={handleDelete} color="secondary">
          YES
        </Button>
      </DialogActions>
    </Dialog>
    </ClickAwayListener>

    <ClickAwayListener onClickAway={handleClickAway}>
      <Dialog open={invalidEmailDialog} onClose={handleCloseInvalidEmailDialog}>
      <DialogTitle>Invalid</DialogTitle>
      <DialogContent>
       {invalidEmailMessage} : {email}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseInvalidEmailDialog} color="primary">
          Ok
        </Button>
       
      </DialogActions>
    </Dialog>
    </ClickAwayListener>

        <ToastContainer autoClose={2000} />
    

      {/* Loading Spinner */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Contacts;
