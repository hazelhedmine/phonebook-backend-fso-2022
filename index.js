const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 10000 + 1);
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(person);

  response.json(person);
});

app.get("/info", (request, response) => {
  const number = persons.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${number} people</p><p>${date}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
