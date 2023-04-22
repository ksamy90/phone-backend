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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
