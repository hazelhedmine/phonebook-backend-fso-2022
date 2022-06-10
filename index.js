require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

morgan.token("data", function (request, response) {
  return JSON.stringify(request.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then((result) => {
    // successfully deleting returns 204 no content
    response.status(204).end();
  });
  // .catch(error => next(error))
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  // response sent inside of the callback function for the save operation
  // ensures that the response is sent only if the operation succeeded
  person.save().then((savedPerson) => {
    // using the formatted version created with toJSON
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

// app.get("/api/persons", (request, response) => {
//   Person.find({}).then((persons) => {
//     response.json(persons);
//   });
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
