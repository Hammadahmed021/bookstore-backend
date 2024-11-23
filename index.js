const express = require('express')
const mongoose = require('mongoose');
const app = express()
const cors = require('cors')

const port = 3000
require('dotenv').config()

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173/"],
  credentials: true
}))

const bookRoutes = require("./src/books/book.route")
app.use("/api/book", bookRoutes)

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.get('/', (req, res) => {
    res.send('Hello World! ')
  })
}
main().then(() => {
  console.log("mongoose running");
}).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// DwkqdHSKfiXP1sdn
// hammadahmed4015