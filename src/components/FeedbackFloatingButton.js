import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const FeedbackFloatingButton = ({ onShow }) => {
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterVisible, setTypewriterVisible] = useState(true);
  const typewriterFullText = 'Rate your experience with us';

  useEffect(() => {
    let timeout, hideTimeout;
    let i = 0;
    function type() {
      setTypewriterText(typewriterFullText.slice(0, i));
      if (i < typewriterFullText.length) {
        timeout = setTimeout(() => {
          i++;
          type();
        }, 60);
      } else {
        hideTimeout = setTimeout(() => {
          setTypewriterVisible(false);
          setTimeout(() => {
            setTypewriterText('');
            setTypewriterVisible(true);
            i = 0;
            type();
          }, 3000);
        }, 2000);
      }
    }
    setTypewriterVisible(true);
    setTypewriterText('');
    i = 0;
    type();
    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1050, display: 'flex', alignItems: 'center' }}>
      {typewriterText && typewriterVisible && (
        <span style={{
          background: 'rgba(255,255,255,0.95)',
          color: '#333',
          borderRadius: 20,
          padding: '8px 16px',
          marginRight: 12,
          fontWeight: 500,
          fontSize: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
          border: '1px solid #eee',
          letterSpacing: '0.5px',
          transition: 'opacity 0.3s',
        }}>{typewriterText}<span className="typewriter-cursor">|</span></span>
      )}
      <button
        className="btn btn-primary"
        style={{ borderRadius: '50%', width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        onClick={onShow}
        title="Give Feedback"
      >
        <i className="fa fa-commenting-o fa-lg"></i>
      </button>
    </div>,
    document.body
  );
};

export default FeedbackFloatingButton; 