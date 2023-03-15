import React from 'react';

const Person = ({ id, name, number, handleDelete }) => {
  return (
    <li key={id} id={id}>
      {name} : {number} {' '}
      <button onClick={()=>handleDelete()}>delete</button>
    </li>
  );
};

export default Person;
