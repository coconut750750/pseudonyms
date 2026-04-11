import React, { useRef } from 'react';

import './LongPressButton.css';

const THRESHOLD = 1000;

export default function LongPressButton({ onLongPress, children }) {
  const timerRef = useRef(null);

  const startPress = () => {
    // Start a timer when the user presses down
    timerRef.current = setTimeout(() => {
      onLongPress();
    }, THRESHOLD);
  };

  const cancelPress = () => {
    // Clear the timer if the user releases or moves away before the threshold
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <button
      type="button"
      className="btn longpress"
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
    >
      {children}
    </button>
  );
}
