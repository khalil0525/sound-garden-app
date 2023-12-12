import React from 'react';

import { Box, Modal as MuiModal, Typography } from '@mui/material';
import DeleteSongOverlay from './DeleteSongOverlay/DeleteSongOverlay';
import EditSongOverlay from './EditSongOverlay/EditSongOverlay';
import EditProfileOverlay from './EditProfileOverlay/EditProfileOverlay';
import LoginOverlay from './LoginOverlay/LoginOverlay';
import RegisterOverlay from './RegisterOverlay/RegisterOverlay';

const Modal = ({
  isOpen,
  onConfirm,
  onCancel,
  title,

  action,
  song,
  userInformation,
}) => {
  let modalContent = null;

  switch (action) {
    case 'signIn':
      modalContent = (
        <LoginOverlay
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      break;
    case 'createAccount':
      modalContent = (
        <RegisterOverlay
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      break;
    case 'deleteSong':
      modalContent = (
        <DeleteSongOverlay
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      break;
    case 'editSongInformation':
      modalContent = (
        <EditSongOverlay
          song={song}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      break;
    case 'editProfileInformation':
      modalContent = (
        <EditProfileOverlay
          userInformation={userInformation}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
      break;
    default:
      modalContent = null;
      break;
  }

  return (
    <>
      {isOpen && (
        <MuiModal
          open={isOpen}
          onClose={onCancel}>
          <Box>
            <Typography
              variant="h5"
              id="modal-title">
              {title}
            </Typography>

            {modalContent}
          </Box>
        </MuiModal>
      )}
    </>
  );
};

export default Modal;
