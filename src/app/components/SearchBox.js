import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        height: '60px',
    },
    '& .MuiInputBase-input': {
        fontWeight: 300,
        color: '#777',
        paddingLeft: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
    },
}));

const SearchBox = ({ value, onChange, onSearch }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <StyledTextField
            label="搜索待办事项..."
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            variant="outlined"
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={onSearch}>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBox;
