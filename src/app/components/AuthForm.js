// src/app/components/AuthForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 3),
    borderRadius: '8px',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
}));


const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxWidth: '400px',
    margin: theme.spacing(4, 'auto'),
    padding: theme.spacing(4),
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      maxWidth: '95%',
    },

}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
       borderRadius: '8px',
        '&:hover .MuiOutlinedInput-notchedOutline': {
           borderColor: '#00aaff' ,
       }
     },
    '& .MuiInputBase-input': {
        fontFamily: 'sans-serif',
        padding: theme.spacing(1.5, 2),
    },
    '& .MuiFormHelperText-root': {
        fontFamily: 'sans-serif',
    }
}));



const AuthForm = ({ mode = 'signup' }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
          let url = '/api/auth';
            if (mode === "signup") {
               url = '/api/auth?mode=signup'
            } else {
                url = '/api/auth?mode=login'
            }
            const response = await axios.post(url, data);
             if(mode === "signup") {
              setMessage(response.data.message);
             } else {
               localStorage.setItem('token', response.data.token);
               router.push('/');
            }
        } catch (error) {
            if(error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage("网络错误，请重试！");
            }
        }
    };
    

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" align="center" gutterBottom>
                {mode === 'signup' ? '注册' : '登录'}
            </Typography>
            <StyledTextField
                label="用户名"
                {...register('username', { required: '用户名不能为空' })}
                error={!!errors.username}
                helperText={errors.username?.message}
                fullWidth
            />
            <StyledTextField
                label="密码"
                type="password"
                {...register('password', { required: '密码不能为空' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
            />
            <StyledButton type="submit" variant="contained" color="primary" >
                {mode === 'signup' ? '注册' : '登录'}
            </StyledButton>
            {message &&
                <Box mt={2} color={ mode === "signup" ? "green" : "red" }>
                    {message}
                </Box>}
        </StyledForm>
    );
};

export default AuthForm;

