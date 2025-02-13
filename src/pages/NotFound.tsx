import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <Typography variant="h3" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Return to Home
      </Button>
    </div>
  );
};

export default NotFound; 