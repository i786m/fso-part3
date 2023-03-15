import React from 'react';

const PersonForm = ({ name, number, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Name : <input value={name.value} onChange={name.onChange} />
      </div>
      <div>
        Number : <input value={number.value} onChange={number.onChange} />
      </div>
      <div>
        <button type='submit'>Add Contact</button>
      </div>
    </form>
  );
};

export default PersonForm;
