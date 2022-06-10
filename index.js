require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// eslint-disable-next-line no-unused-vars
morgan.token('data', function (request, response) {
  return JSON.stringify(request.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)
app.use(cors())

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    )
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      // successfully deleting returns 204 no content
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // response sent inside of the callback function for the save operation
  // ensures that the response is sent only if the operation succeeded
  person
    .save()
    .then((savedPerson) => {
      // using the formatted version created with toJSON
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
// no routes or middleware will be called after the response
// has been sent by unknown endpoint middleware
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.code === 11000) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

// ------------------- before mongoDB
// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

// app.get("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const person = persons.find((person) => person.id === id);
//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// });

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);

//   response.status(204).end();
// });

// app.post("/api/persons", (request, response) => {
//   const id = Math.floor(Math.random() * 10000 + 1);
//   const body = request.body;

//   if (!body.name) {
//     return response.status(400).json({
//       error: "name is missing",
//     });
//   } else if (!body.number) {
//     return response.status(400).json({
//       error: "number is missing",
//     });
//   }

//   const person = {
//     id: id,
//     name: body.name,
//     number: body.number,
//   };

//   persons = persons.concat(person);
//   console.log(person);

//   response.json(person);
// });

// app.get("/info", (request, response) => {
//   const number = persons.length;
//   const date = new Date();
//   response.send(`<p>Phonebook has info for ${number} people</p><p>${date}</p>`);
// });
