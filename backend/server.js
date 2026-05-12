require('dotenv').config();                 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable, with a fallback
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TODO';
const port     = process.env.PORT      || 5000;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log(`MongoDB connected to ${mongoUri}`))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Routes
app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/get', (req, res) => {
  TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndUpdate(id, { done: true }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  TodoModel.findByIdAndUpdate(id, { task }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = app;
