const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)

app.use(cors());
app.use(express.json());
app.use('/', require('./routes/index.js'))

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
)