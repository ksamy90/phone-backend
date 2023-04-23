require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Phone = require("./models/phone");
const app = express();

// https://stackoverflow.com/questions/51409771/logging-post-body-size-using-morgan-when-request-is-received

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);

app.get("/", (request, response) => {
  response.send("<h1>Phone Application</h1>");
});

let phonelist;
Phone.find({})
  .then((docs) => {
    phonelist = docs;
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/api/persons", (request, response) => {
  Phone.find({}).then((phones) => {
    response.json(phones);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Phone.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Phone.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const timeNow = new Date();
  Phone.find({})
    .then((phones) => {
      response.send(
        `<p>Phonebook has info for ${phones.length} people</p><p>${timeNow}</p>`
      );
    })
    .catch((error) => next(error));
});
setTimeout(() => {
  console.log(phonelist);
}, 6000);

const userExists = (name) => {
  return phonelist.some((person) => {
    return person.name === name;
  });
};
app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (body.number === undefined || body.name === undefined) {
    return response.status(400).json({
      error: "number and/or name missing",
    });
  }
  if (userExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Phone({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
