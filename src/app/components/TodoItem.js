// src/app/components/TodoItem.js
"use client"; // 确保这是一个客户端组件

import React from 'react';
import { Box, Typography, Checkbox, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// 获取优先级颜色
const getPriorityColor = (priority) => {
    switch (priority) {
        case '高':
            return '#ff6b6b'; // 红色
        case '中':
            return '#ffa500'; // 橙色
        case '低':
            return '#61cf65'; // 绿色
        default:
            return 'transparent';
    }
};

const StyledCard = styled(Box)(({ theme, completed }) => ({
    // 基础样式
    minWidth: '300px',  // 增加最小宽度，防止内容过少时宽度过小
    backgroundColor: completed === 'true' ? '#f0f0f0' : '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    padding: '4px',
    margin: '0', // 修改为统一的8px
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    filter: completed === 'true' ? 'grayscale(1)' : 'none',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    position: 'relative', // 添加相对定位，解决定位元素不显示问题

    // 移动端样式，宽度100%
    margin: '0 auto', // 添加移动端margin
    width: '100%',

    // 桌面端样式，宽度50%，通过媒体查询实现
    [theme.breakpoints.up('md')]: {  // 使用MUI的breakpoints
        width: '370px',   // 修改为calc函数，加上间距的考虑
    },

}));


// 自定义复选框样式
const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
    color: '#bbb', // 设置勾选框的颜色为黑色
    '&.Mui-checked': {
        color: '#bbb', // 勾选时的颜色为黑色
        backgroundColor: 'transparent', // 勾选框背景透明
    },
     '&.MuiCheckbox-root': {
        padding: '4px', // 减小勾选框的背景大小
     },
}));

const StyledDueDate = styled(Typography)(({ theme, priority }) => ({
    border: `1px solid ${getPriorityColor(priority)}`,
    borderRadius: '12px',
    padding: '2px 8px',
    backgroundColor: getPriorityColor(priority),
    fontSize: '12px',
    fontWeight: 'bold',
    color: "white",
    position: 'absolute',
    bottom: '8px',
    left: '8px',

}));

const StyledTag = styled(Typography)(({theme}) => ({
    border: '1px solid #00aaff',
    borderRadius: '10px',
    padding: '1px 6px',
    marginLeft: '4px',
    fontSize: '10px',
    whiteSpace: 'nowrap', // 文字不换行
    fontWeight: 'light',
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    color: '#00aaff',
}));

const DueDateContainer = styled(Box)({
    width: '138px',
    display: 'flex',
    alignItems: 'center',
});

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
    const isValidDate = (date) => {
        try {
          return date instanceof Date && !isNaN(date);
        } catch (e) {
            return false;
        }
      };

    return (
        <StyledCard completed={String(todo.completed)}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <StyledCheckbox
                        checked={todo.completed || false}
                        onChange={() => onToggleComplete(todo.id, !todo.completed)}
                    />
                    <Typography
                        variant="h6"
                        fontFamily="sans-serif"
                        fontSize="18px"
                        fontWeight="bold"
                        sx={{
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? '#999' : '#333',
                            flexGrow: 1,
                            marginLeft: '8px',
                        }}
                    >
                        {todo.title}
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={() => onEdit(todo)}>
                        <EditIcon sx={{ color: '#00aaff' }} />
                    </IconButton>
                    <IconButton onClick={() => onDelete(todo.id)}>
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                </Box>
            </Box>
            <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                    marginTop: '4px',
                    marginBottom: '28px',
                    marginLeft: '40px',
                    fontWeight: 'light',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#333',
                    // 添加以下两个属性实现自动换行
                    wordWrap: 'break-word',   // 兼容性较好，但不是标准
                    overflowWrap: 'break-word', // 标准属性，现代浏览器推荐使用
                }}
            >
                {todo.description}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginTop="8px">
                <DueDateContainer>
                    <StyledDueDate variant="caption" color="textSecondary" priority={todo.priority}>
                        🗓 {
                        todo.duedate === null ? '无' : (
                          (() => {
                            try {
                                const date = new Date(todo.duedate);
                                return isValidDate(date) ? date.toLocaleDateString() : 'Invalid Date';
                             } catch (e) {
                                return 'Invalid Date';
                             }
                          })()
                         )
                       }
                     </StyledDueDate>
                </DueDateContainer>
                <Box>
                    {todo.tags && todo.tags.split(',').map(tag => (
                        <StyledTag
                           key={tag}
                           variant="caption"
                            color="textSecondary"
                            >
                            {tag.trim()}
                        </StyledTag>
                    ))}
                </Box>
            </Box>
        </StyledCard>
    );
};

export default TodoItem;
