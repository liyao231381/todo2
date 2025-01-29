import React from 'react';
import Modal from 'react-modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    fontFamily: 'sans-serif',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    '&:last-child':{
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'sans-serif',
}));

const DeleteConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="确认删除"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <Box className="modal-inner">
                <StyledTypography variant="h6" className="modal-title">确认删除</StyledTypography>
                <StyledTypography>你确定要删除这个待办事项吗？</StyledTypography>
                <Box
                    mt="auto"
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    marginTop={"2rem"}
                >
                    <StyledButton onClick={onRequestClose} variant="contained" className="modal-button modal-button-confirm">
                        取消
                    </StyledButton>
                    <StyledButton onClick={onConfirm} variant="contained" className="modal-button modal-button-delete">
                        删除
                    </StyledButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;
