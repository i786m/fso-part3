import { useState, useEffect } from 'react';

//components
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';

//services
import numberService from './services/numbers';

const App = () => {
  //state
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //initial render
  useEffect(() => {
    numberService.getAll().then(initialNumbers => setPersons(initialNumbers)).catch(error => console.log(error))
  }, []);

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const addPerson = event => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    //check if contact exists in directory
    const personExists = persons.some(
      p => p.name.toLowerCase() === newName.toLowerCase()
    );

    //add contact if not in directory

    if (!personExists) {
      numberService
        .addContact(personObject)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact));
          setNewName('');
          setNewNumber('');
          setErrorMessage(`${newName} has been added to the directory`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch(error => setErrorMessage(error.response.data.error));
    }

    // update contact if existing in directory
    else {
      const existingId = persons.find(
        p => p.name.toLowerCase() === newName.toLowerCase()
      ).id;

      window.confirm(
        `${personObject.name} already exists in the directory. Would you like to update the number`
      ) &&
        numberService
          .updateContact(existingId, personObject)
          .then(returnedPerson => {
            setPersons(
              persons.map(person =>
                person.id === existingId ? returnedPerson : person
              )
            );
            setNewName('');
            setNewNumber('');
            setErrorMessage(
              `Phone number for ${personObject.name} has been updated`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch(error => {
            console.log(error);
            setErrorMessage(
              error.response.status === 404 ?
              `${personObject.name} has previously been deleted from the directory. Updating...` :
              error.response.data.error
            );
            setTimeout(() => {
              setPersons(persons.filter(p => p.id !== existingId));
              setErrorMessage(null);
            }, 5000);
          });
    }
  };

  //delete contact
  const handleDelete = id => {
    const deletedName = persons.find(p => p.id === id).name;
    window.confirm(
      `Are you sure you want to delete ${deletedName} permanently?`
    ) &&
      numberService
        .deleteContact(id)
        .then(res => {
          setPersons(persons.filter(p => p.id !== id));
          setErrorMessage(`${deletedName} has been removed from the directory`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.log(error);
          setErrorMessage(
            `${deletedName} ${error.request.statusText.toLowerCase()} in the directory. Updating ...`
          );
          setTimeout(() => {
            setPersons(persons.filter(p => p.id !== id));
            setErrorMessage(null);
          }, 5000);
        });
  };

  return (
    <main>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>Add a new contact</h2>
      <PersonForm
        onSubmit={addPerson}
        name={{ value: newName, onChange: handleNameChange }}
        number={{ value: newNumber, onChange: handleNumberChange }}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </main>
  );
};

export default App;
