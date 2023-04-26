const phonesRouter = require("express").Router();
const Phone = require("../models/phone");

let phonelist;
Phone.find({})
  .then((docs) => {
    phonelist = docs;
  })
  .catch((err) => {
    console.log(err);
  });
phonesRouter.get("/", (request, response) => {
  Phone.find({}).then((phones) => {
    response.json(phones);
  });
});

phonesRouter.get("/:id", (request, response) => {
  Phone.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

phonesRouter.get("/", (request, response) => {
  response.send("<h1>Phone Application</h1>");
});

phonesRouter.delete("/:id", (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

phonesRouter.put("/:id", (request, response, next) => {
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

phonesRouter.get("/info", (request, response, next) => {
  const timeNow = new Date();
  Phone.find({})
    .then((phones) => {
      response.send(
        `<p>Phonebook has info for ${phones.length} people</p><p>${timeNow}</p>`
      );
    })
    .catch((error) => next(error));
});

const userExists = (name) => {
  return phonelist.some((person) => {
    return person.name === name;
  });
};
phonesRouter.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (userExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Phone({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});
setTimeout(() => {
  console.log(phonelist);
}, 6000);

module.exports = phonesRouter;
