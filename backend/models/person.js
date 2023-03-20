const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [ 3 , 'Please add a name that is a minimum of 3 characters']
  },
  number: {
    type: String,
    required: [true, 'Please enter a phone number'],
    validate: {
      validator: (number) => number.length>8&&/^\d{2,3}-\d{5,}$/.test(number) ,
      message : 'Phone number should be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers'
    },
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
