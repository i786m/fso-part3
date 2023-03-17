require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

//morgan show post content config
morgan.token('postBody', request =>
  request.method === 'POST' ? JSON.stringify(request.body) : null
);

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postBody'
  )
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

//endpoints

//get homepage
app.get('/', (request, response) => {
  response.send(
    '<h1>Phonebook</h1><p><a href="/api/persons">View contacts</a><a href="/info">View info</a>'
  );
});

//info
app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  );
});

// get contacts
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons));
});

//get contact
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person=>
  person ? response.json(person) : response.status(404).end())
});

//delete contact
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

//post contact
// const generateId = () => {
//   return Math.floor(Math.random() * 100);
// };

app.post('/api/persons', (request, response) => {
  //error handling
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  // if (
  //   persons.some(
  //     person => person.name.toLowerCase() === request.body.name.toLowerCase()
  //   )
  // ) {
  //   return response.status(409).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  })

  person.save().then(savedPerson=>response.json(savedPerson))
});

//middleware
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
