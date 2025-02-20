const express = require('express');
const cors = require('cors');
const { pool } = require('./src/config/dbconfig');
const userRoutes = require('./src/routes/users');

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to the database');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
