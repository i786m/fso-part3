import React from 'react';
import Person from './Person';

const Persons = ({ persons, filter, handleDelete }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const viewPersons = !filter ? persons : filteredPersons;

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
