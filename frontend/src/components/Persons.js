import React from 'react';
import Person from './Person';

const Persons = ({ persons, filter, handleDelete }) => {
  
  if(persons===null) return null

  const viewPersons = !filter ? 
  persons : 
  persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))

  if (filter && !viewPersons.length)
    return 'Oops! No contacts match your criteria';

  return (
    <ul>
      {viewPersons.map(x => (
        <Person
          key={x.id}
          name={x.name}
          number={x.number}
          handleDelete={() => handleDelete(x.id)}
        />
      ))}
    </ul>
  );
};

export default Persons;
