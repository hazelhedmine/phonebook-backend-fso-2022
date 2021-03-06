/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// for exercise 3.12

const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    'Please follow this format: node mongo.js <password> [optional]<name> [optional]<number>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.j7af5.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      console.log('phonebook:')
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const person = new Person({
        name: name,
        number: number,
      })

      return person.save()
    })
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
