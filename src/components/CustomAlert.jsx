import React, { useState, useEffect } from "react";

const CustomAlert = ({ message, isVisible, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 5000); // Alert will be visible for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {message}
    </div>
  );
};

export default CustomAlert;
