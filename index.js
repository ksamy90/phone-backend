const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

let phonelist = [
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
  response.send("<h1>Phone Application</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(phonelist);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonelist.find((phone) => phone.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonelist = phonelist.filter((phone) => phone.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const numpersons = phonelist.length;
  const timeNow = new Date();
  response.send(
    `<p>Phonebook has info for ${numpersons} people</p><p>${timeNow}</p>`
  );
});

const generateId = () => {
  const newId = Math.floor(Math.random() * 145);
  return newId + 3;
};
const userExists = (name) => {
  return phonelist.some((person) => {
    return person.name === name;
  });
};
app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.number || !body.name) {
    return response.status(400).json({
      error: "number and/or name missing",
    });
  }
  if (userExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  phonelist = [...phonelist, person];
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
