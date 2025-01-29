// src/app/components/TodoList.js
import React from 'react';
import TodoItem from './TodoItem';
import { Box } from '@mui/material';

const TodoList = ({ todos, onEdit, onDelete, onToggleComplete }) => {
    return (
        <Box
            p={1}
            sx={{
                backgroundColor: 'rgba(255, 166, 0, 0.05)',
                borderRadius: '16px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // 自动填充列，每列至少300px
                gap: '8px',
                '@media (max-width: 767px)': {
                    gridTemplateColumns: '1fr', // 移动端单列布局
                  },
            }}
        >
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                 />
            ))}
        </Box>
    );
};

export default TodoList;
