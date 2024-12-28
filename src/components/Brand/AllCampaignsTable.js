import React from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TableContainer,
  Paper,
} from "@mui/material";

const CampaignsTable = () => {
  // Dummy data for campaigns
  const campaigns = [
    {
      id: 1,
      title: "New Year Sale Campaign",
      sent: 1000,
      delivered: 980,
      opened: 750,
      bounced: 20,
      status: "Completed",
    },
    {
      id: 2,
      title: "Spring Offers Campaign",
      sent: 1200,
      delivered: 1150,
      opened: 900,
      bounced: 50,
      status: "In-Progress",
    },
    {
      id: 3,
      title: "Black Friday Deals",
      sent: 2000,
      delivered: 1980,
      opened: 1700,
      bounced: 20,
      status: "Completed",
    },
    {
      id: 4,
      title: "End of Season Clearance",
      sent: 1500,
      delivered: 1450,
      opened: 1200,
      bounced: 50,
      status: "In-Progress",
    },
  ];

  return (
    <Box
      sx={{
        maxHeight: 480,
        overflowY: "auto",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
      }}
    >
      {/* Table Container */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Campaign Title</TableCell>
              <TableCell>Emails Sent</TableCell>
              <TableCell>Delivered</TableCell>
              <TableCell>Opened</TableCell>
              <TableCell>Bounced</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {campaigns.map((campaign, index) => (
              <TableRow key={campaign.id}>
                {/* Serial Number */}
                <TableCell>{index + 1}</TableCell>

                {/* Campaign Title */}
                <TableCell>{campaign.title}</TableCell>

                {/* Emails Sent */}
                <TableCell>{campaign.sent}</TableCell>

                {/* Emails Delivered */}
                <TableCell>{campaign.delivered}</TableCell>

                {/* Emails Opened */}
                <TableCell>{campaign.opened}</TableCell>

                {/* Emails Bounced */}
                <TableCell>{campaign.bounced}</TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    style={{
                      color: campaign.status === "Completed" ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {campaign.status}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => alert(`Viewing details for: ${campaign.title}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignsTable;
