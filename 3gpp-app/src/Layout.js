import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, AppBar, Toolbar } from '@mui/material';
import styled from '@emotion/styled';
import ProcedureView from './components/ProcedureView';

const StyledPaper = styled(Paper)`
  padding: 20px;
  height: calc(100vh - 100px);
  overflow: auto;
  margin-top: 20px;
`;

const MainContainer = styled(Box)`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Layout = () => {
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            3GPP Procedures Visualization
          </Typography>
        </Toolbar>
      </AppBar>
      
      <MainContainer>
        <Grid container spacing={3}>
          {/* Main Content Area */}
          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <ProcedureView 
                selectedProcedure={selectedProcedure}
                onProcedureSelect={setSelectedProcedure}
              />
            </StyledPaper>
          </Grid>
        </Grid>
      </MainContainer>
    </>
  );
};

export default Layout; 