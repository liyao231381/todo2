// src/app/components/TodoModal.js
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const StyledButton = styled(Button)(() => ({
    fontFamily: 'sans-serif',
    '&:hover': {
        backgroundColor: '#0077CC', // Slightly darker blue on hover
    },
}));

const StyledTextField = styled(TextField)(() => ({
    '& .MuiInputBase-input': {
        fontFamily: 'sans-serif',
    },
}));

const StyledTypography = styled(Typography)(() => ({
    fontFamily: 'sans-serif',
}));

const StyledModalContent = styled(Box)(({ theme }) => ({
    maxWidth: '600px', // 设置模态框最大宽度
    margin: 'auto',
    marginTop: '5vh', // 距离顶部 10vh
    padding: theme.spacing(3),
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '12px',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        maxWidth: '95%', // 移动端使用 95% 的宽度
    },
}));

const TodoModal = ({ isOpen, onRequestClose, onAddTodo, onUpdateTodo, todo, isEditMode }) => {
    const addButtonRef = useRef(null);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [priority, setPriority] = useState('中');

    useEffect(() => {
        if (todo && isEditMode) {
            setTitle(todo.title);
            setDescription(todo.description || '');
            setTags(todo.tags || '');
            setDueDate(todo.dueDate || null);
            setPriority(todo.priority || '中');
        } else {
            setTitle('');
            setDescription('');
            setTags('');
            setDueDate(null);
            setPriority('中');
        }
    }, [todo, isEditMode]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && addButtonRef.current) {
                event.preventDefault();
                addButtonRef.current.focus(); // Focus the button
                addButtonRef.current.click(); // Trigger the click event
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [addButtonRef, onAddTodo, onUpdateTodo, isEditMode]);


    const handleAddOrUpdate = async () => {
        const updatedTodo = {
            ...todo,
            id: todo ? todo.id : uuidv4(),  // 如果是新增，则添加一个id
            title,
            description,
            tags,
            dueDate,
            priority,
        };
        if (isEditMode) {
            onUpdateTodo(updatedTodo);
        } else {
            onAddTodo(updatedTodo);
        }
        onRequestClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setTags('');
        setDueDate(null);
        setPriority('中');
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel={isEditMode ? "编辑待办事项" : "添加待办事项"}
            className="modal-overlay"
            overlayClassName="modal-overlay"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                }
            }}
        >
            <StyledModalContent>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <StyledTypography variant="h6" fontWeight="bold" mb={4} className="modal-title">
                    {isEditMode ? "编辑待办事项" : "添加待办事项"}
                </StyledTypography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <StyledTextField
                        label="标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <StyledTextField
                        label="描述"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <StyledTextField
                        label="标签 (逗号分隔)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <TextField
                            type="date"
                            label="截止日期"
                            value={dueDate || ''}
                            onChange={(e) => setDueDate(e.target.value)}
                            variant="outlined"
                            className="mr-2"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ flex: 1, mr: 1 }}
                        />
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            variant="outlined"
                            sx={{ flex: 1 }}
                        >
                            <MenuItem value="高">高</MenuItem>
                            <MenuItem value="中">中</MenuItem>
                            <MenuItem value="低">低</MenuItem>
                        </Select>
                    </Box>
                    <Box mt={4} display="flex" justifyContent="flex-end" >
                        <StyledButton ref={addButtonRef} onClick={handleAddOrUpdate} variant="contained" className="modal-button modal-button-confirm">
                            {isEditMode ? "保存" : "添加"}
                        </StyledButton>
                    </Box>
                </Box>
            </StyledModalContent>
        </Modal>
    );
};

export default TodoModal;
