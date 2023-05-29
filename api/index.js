require('dotenv').config();
require('./config/database')

const express = require('express');
const cors = require('cors');
const { verifyAuth } = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.use('/api/auth', require('./routes/auth'))
app.use('/api/todos', verifyAuth, require('./routes/todos'))




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
})