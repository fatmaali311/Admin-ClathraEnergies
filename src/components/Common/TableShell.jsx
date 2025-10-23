import React from 'react';

// TableShell: wrapper around MUI TableContainer that preserves header controls and styling.
// Props: header (JSX for header controls), children (the Table component or table body)
const TableShell = ({ header = null, children }) => {
  return (
    <div className="">
      <div className="mb-3">{header}</div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden" style={{ borderRadius: 12 }}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(TableShell);
