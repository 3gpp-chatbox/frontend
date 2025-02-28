import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import styled from '@emotion/styled';

const StyledPaper = styled(Paper)`
  padding: 20px;
  height: calc(100vh - 40px);
  overflow: auto;
`;

const Layout = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Procedures List */}
        <Grid item xs={3}>
          <StyledPaper elevation={3}>
            <h2>3GPP Procedures</h2>
            {/* Add procedure list component here */}
          </StyledPaper>
        </Grid>

        {/* Graph Visualization */}
        <Grid item xs={6}>
          <StyledPaper elevation={3}>
            <h2>State Transition Graph</h2>
            {/* Add graph visualization component here */}
          </StyledPaper>
        </Grid>

        {/* Summary Section */}
        <Grid item xs={3}>
          <StyledPaper elevation={3}>
            <h2>Procedure Summary</h2>
            {/* Add summary component here */}
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout; 