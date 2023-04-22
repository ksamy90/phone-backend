const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://todojs:${password}@cluster0.xlsfe.mongodb.net/phone-app?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

if (process.argv.length === 5) {
  const phone = new Phone({
    name,
    number,
  });
  phone.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Phone.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((phone) => {
      console.log(`${phone.name} ${phone.number}`);
    });
    mongoose.connection.close();
  });
}
