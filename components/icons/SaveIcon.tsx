import React from 'react';

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7H5V5zm4 5a1 1 0 102 0v2a1 1 0 10-2 0v-2z" clipRule="evenodd" />
    <path d="M7 5a1 1 0 00-1 1v1a1 1 0 102 0V6a1 1 0 00-1-1z" />
  </svg>
);

export default SaveIcon;