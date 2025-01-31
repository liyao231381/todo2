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
        backgroundColor: '#00aaff', // Slightly darker blue on hover
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
    marginTop: '5vh', // 距离顶部 5vh
    padding: theme.spacing(3),
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '12px',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        maxWidth: '95%', // 移动端使用 95% 的宽度
    },
}));

const TodoModal = ({ isOpen, onRequestClose, onAddTodo, onUpdateTodo, todo, isEditMode, existingTags }) => {
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

    const handleTagClick = (tag) => {
        // 检查标签是否已存在
        setTags((prevTags) => {
            const tagsArray = prevTags.split(',').map(tag => tag.trim()).filter(tag => tag); // 移除空标签
            if (tagsArray.includes(tag)) {
                // 如果标签已存在，移除该标签
                return tagsArray.filter(t => t !== tag).join(', ');
            } else {
                // 如果标签不存在，添加标签，前面加上逗号
                return tagsArray.length > 0 ? `${prevTags.trim()}, ${tag}` : tag; // 处理逗号
            }
        });
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
                    {/* 渲染现有标签 */}
                    <Box mt={1}>
                        {existingTags.map((tag, index) => (
                            <Button
                                key={index}
                                variant="outlined"
                                size="small"
                                onClick={() => handleTagClick(tag)}
                                sx={{
                                    marginRight: '5px',
                                    marginBottom: '5px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backgroundColor: '#00aaff',   
                                    border: '1px solid #00aaff',
                                    minWidth: 'fit-content',
                                }}
                            >
                                {tag}
                            </Button>
                        ))}
                    </Box>
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
