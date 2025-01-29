// src/app/auth/page.js
"use client";
import React, { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation';
import { Box, Tabs, Tab } from '@mui/material';

function AuthPage() {
    const [mode, setMode] = useState('login');
    const router = useRouter();

    useEffect(() => {
         const token = localStorage.getItem('token');
         if(token) {
             router.push('/');
         }
    }, []);

    const handleTabChange = (event, newMode) => {
        setMode(newMode);
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: 'auto', marginTop: '10vh', height: '90vh' }}>
             <Tabs value={mode} onChange={handleTabChange} centered>
                 <Tab label="登录" value="login" />
                 <Tab label="注册" value="signup" />
             </Tabs>
            {mode === 'login' ?
                <AuthForm mode="login" /> :
                <AuthForm mode="signup" />
            }
        </Box>
    );
}

export default AuthPage;
