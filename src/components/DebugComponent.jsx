import React, { useEffect } from 'react';

const DebugComponent = ({ name }) => {
  useEffect(() => {
    console.log(`Rendering component: ${name}`);
    
    return () => {
      console.log(`Unmounting component: ${name}`);
    };
  }, [name]);
  
  return null;
};

export default DebugComponent;