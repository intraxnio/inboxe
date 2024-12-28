
import React from "react";
import { Box, Grid, Typography, Paper, Button } from "@mui/material";
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import mailDelivered from '../../images/delivered.png';
import mail from '../../images/mail.png';
import emailBounced from '../../images/mailBounced.png';
import emailOpened from '../../images/mailOpened.png';
import CampaignsTable from "./AllCampaignsTable";

const MetricBox = ({ title, value, subtitle, image }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        padding: 2,
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        height: "180px",
      }}
    >
      {/* Image Section */}
      <Box sx={{ flex: 1, textAlign: "center" }}>
        <img src={image} alt={title} style={{ maxWidth: "60px", height: "auto" }} />
      </Box>

      {/* Text Section */}
      <Box sx={{ flex: 2, textAlign: "left" }}>
      <Typography variant="h6" fontWeight="400px">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="300px" color="primary" mt={1}>
        {value}
      </Typography>
      <Typography mt={2} sx={{ fontSize : '14px', color: '#A6AEBF' }}>
        {subtitle}
      </Typography>
      </Box>
    </Paper>
  );
};

const CampaignsDashboard = () => {
  const metrics = [
    { title: "Total sent", value: "13.5k", subtitle: "Everything you've sent.", image: mail },
    { title: "Delivered", value: "97.35%", subtitle: "Delivered out of emails sent.", image: mailDelivered },
    { title: "Open rate", value: "87.47%", subtitle: "Opened out of delivered emails.", image: emailOpened },
    { title: "Bounce rate", value: "0.12%", subtitle: "Bounced out of emails sent.", image: emailBounced },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Button
          startIcon={<EventOutlinedIcon />}
          variant="outlined"
          color="primary"
          sx={{ marginTop: "14px", marginBottom: "22px" }}
          style={{
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "none",
          }}
        >
          Create Campaign
        </Button>

        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MetricBox
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                image={metric.image}
              />
            </Grid>
          ))}
        </Grid>


            <div style={{ marginTop : '22px'}}>
            <CampaignsTable />

            </div>

      </Box>

    </>
  );
};

export default CampaignsDashboard;
