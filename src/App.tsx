import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CssBaseline, Toolbar } from '@mui/material';

import { ThemeProviderWrapper } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import './index.css';

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <ThemeProviderWrapper>
            <CssBaseline />
            <Header onMenuClick={toggleSidebar} />
            <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />
            <Toolbar />
            <Outlet />
        </ThemeProviderWrapper>
    );
};

export default App;
