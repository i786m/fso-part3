import React from 'react';

const Filter = ({ filter, onChange }) => {
  return (
    <p>
      Filter by Name : <input type='text' value={filter} onChange={onChange} />
    </p>
  );
};

export default Filter;
