// src/app/components/TagFilter.js
import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTagButton = styled(Button)(({ theme, variant }) => ({
    fontFamily: 'sans-serif',
    border: '1px solid #00aaff',
    borderRadius: '16px',
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(0.1, 1),
    fontSize: '12px',
    whiteSpace: 'nowrap',
    backgroundColor: variant === 'contained' ? theme.palette.primary.main : 'transparent',
    color: variant === 'contained' ? 'white' : 'black',
    '&:hover': {
        backgroundColor: variant === 'contained' ? theme.palette.primary.dark : '#e0f7fa',
    },
    minWidth: 'fit-content',
    maxWidth: 'auto',
    textTransform: 'none',
}));

const TagFilter = ({ tags, currentTagFilter, onTagFilter, onClearTagFilter }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            overflow="auto"
        >
            {tags.map((tag) => (
                <StyledTagButton
                    key={tag}
                    variant={currentTagFilter === tag ? 'contained' : 'outlined'}
                    onClick={() => onTagFilter(tag)}
                >
                    {tag}
                </StyledTagButton>
            ))}
            {currentTagFilter && (
                <StyledTagButton
                    variant="outlined"
                    onClick={onClearTagFilter}
                    className="ml-2"
                >
                    清除过滤
                </StyledTagButton>
            )}
        </Box>
    );
};

export default TagFilter;
