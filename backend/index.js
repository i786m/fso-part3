require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

//middleware
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

//morgan show post content config
morgan.token('postBody', request =>
  request.method === 'POST' ? JSON.stringify(request.body) : null
);

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postBody'
  )
);

//dummy data
// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

//endpoints

//info
app.get('/info', (request, response) => {
  Person.estimatedDocumentCount()
    .then(result => {
      response.send(
        `<p>Phonebook has info for ${result} people</p>
      <p>${new Date()}</p>`
      );
    })
    .catch(err => {
      next(err);
    });
});

// get contacts
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error));
});

//get contact
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person =>
      person ? response.json(person) : response.status(404).end()
    )
    .catch(error => next(error));
});

//delete contact
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error));
});

//post contact
app.post('/api/persons', (request, response, next) => {
  //error handling
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person
    .save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error));
});

//update contact
app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(data => {
      if (!data) {
        return response.status(404).end();
      }
      response.json({ ...person, id: request.params.id });
    })
    .catch(error => {
      console.log('error here');
      next(error);
    });
});

//middleware to handle request with unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// middleware to handle requests which result in errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
