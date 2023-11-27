import React from 'react';
import Modal from 'react-modal';

const PopupMessage = ({ isOpen, onClose, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Fetched Data Popup"
    >
      <h2>Fetched Data:</h2>
      {data.map((item, index) => (
        <p key={index}>{item[0]}</p>
      ))}
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default PopupMessage;
