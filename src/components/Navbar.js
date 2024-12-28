import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, List, ListItem, ListItemText, Hidden, Stack, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { deepOrange, blue, indigo, green, purple, brown } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
        main: blue[800],
      },
    },
  });


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <ThemeProvider theme={theme}>
        <div style={{ marginBottom : '86px'}}>
            {/* Header Section */}
            <AppBar position="fixed" sx={{ backgroundColor: '#F5F7F8', color: '#11009E', boxShadow: 'none', height: '76px' }}>
                <Toolbar sx={{ marginTop : '12px'}}>
                    {/* Brand/Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: '#11009E',
                            fontFamily: 'Poppins',
                            fontSize: '22px',
                            fontWeight: 500,
                        }}
                    >
                        Inbox<span style={{ color: '#D80032' }}>e</span>
                    </Typography>

                    {/* Menu/Close Icon for Mobile */}
                    <Hidden mdUp>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={toggleMenu}
                        >
                            {menuOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    </Hidden>

                    {/* Desktop and Tablet Navigation Links */}
                    <Hidden smDown>
    <Box sx={{ display: 'flex', maxWidth: '100%' }}>
        <List sx={{ display: 'flex', width: '100%', marginRight : '112px' }}>
            <ListItem component={Link} to="/" sx={{ color: '#11009E', whiteSpace: 'nowrap' }}>
                <ListItemText primary="Features" />
            </ListItem>
            <ListItem component={Link} to="/use-cases" sx={{ color: '#11009E', whiteSpace: 'nowrap' }}>
                <ListItemText primary="Pricing" />
            </ListItem>
            <ListItem component={Link} to="/pricing" sx={{ color: '#11009E', whiteSpace: 'nowrap' }}>
                <ListItemText primary="Support" />
            </ListItem>
        </List>

        <Stack sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', marginRight : '80px'}}>
          <Button variant='outlined' color="primary" sx={{ paddingX : '66px', height : '44px', textTransform : 'none'}}>Login</Button>
          <Button variant='contained' color="primary" sx={{ paddingX : '66px', height : '44px', marginLeft : '12px', textTransform : 'none', whiteSpace: 'nowrap'}}>Sign up</Button>
        </Stack>

    </Box>
</Hidden>

                </Toolbar>
            </AppBar>

            {/* Full-Screen Menu (Excluding Header) for Mobile */}
            {menuOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '64px', // Toolbar height
                        width: '100%',
                        height: 'calc(100vh - 64px)',
                        backgroundColor: '#F5F7F8',
                        zIndex: 1200,
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Navigation Links for Mobile */}
                    <Stack sx={{ display : 'flex', flexDirection : 'column', width: '100%', alignItems : 'flex-start', width: '100%', paddingX : '12px' }}>
                        <Button sx={{ textTransform : 'none', color : '#1B1833', fontSize : '16px', marginTop : '12px' }}>Features</Button>
                        <Button sx={{ textTransform : 'none', color : '#1B1833', fontSize : '16px', marginTop : '12px' }}>Pricing</Button>
                        <Button sx={{ textTransform : 'none', color : '#1B1833', fontSize : '16px', marginTop : '12px' }}>Support</Button>
                       

                        <Stack sx={{ display : 'flex', flexDirection : 'column', alignItems : 'center', marginRight : '80px', width: '100%', marginTop : '32px'}}>
          <Button variant='outlined' color="primary" sx={{ width : '100%', height : '44px', textTransform : 'none' }}>Log in</Button>
          <Button variant='contained' color="primary" sx={{ width : '100%', height : '44px', marginTop : '12px', textTransform : 'none'}}>Sign up</Button>
        </Stack>
                    </Stack>

                   
                </Box>
            )}
        </div>
        </ThemeProvider>
    );
}
