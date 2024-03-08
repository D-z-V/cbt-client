import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TestPage from '../components/testportal';

const Home: React.FC = () => {
  const [showTestPage, setShowTestPage] = useState<boolean>(false);

  const handleCreateTaskClick = () => {
    setShowTestPage(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!showTestPage ? (
        <Button variant="contained" onClick={handleCreateTaskClick}>Create Task</Button>
      ) : (
        <TestPage />
      )}
    </div>
  );
};

export default Home;
