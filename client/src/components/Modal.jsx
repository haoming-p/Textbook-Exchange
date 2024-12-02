import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', right: '10px', top: '10px' }}>
                    ✕
                </button>
                {children}
            </div>
        </div>
  )
}

export default Modal
