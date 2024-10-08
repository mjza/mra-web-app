import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmDialog = ({
  show,
  onHide,
  onConfirm,
  onCancel,
  title,
  message,
  type = 'primary',
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancel'
}) => {
  // Function to get button variant, icon, and color based on the type
  const getTypeDetails = (type) => {
    switch (type) {
      case 'danger':
        return { variant: 'danger', icon: faTimesCircle, color: 'text-danger' };
      case 'warning':
        return { variant: 'warning', icon: faExclamationCircle, color: 'text-warning' };
      case 'success':
        return { variant: 'success', icon: faCheckCircle, color: 'text-success' };
      case 'info':
        return { variant: 'info', icon: faInfoCircle, color: 'text-info' };
      default:
        return { variant: 'primary', icon: null, color: 'text-primary' };
    }
  };

  const { variant, icon, color } = getTypeDetails(type);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {icon && <FontAwesomeIcon icon={icon} className={`me-2 ${color}`} />}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="justify-content-center">
        {onCancel &&
          <Button variant="secondary" onClick={onCancel}>
            {cancelButtonText}
          </Button>
        }
        <Button variant={variant} onClick={onConfirm}>
          {onConfirm ? confirmButtonText : 'Close'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
