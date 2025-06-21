index.js
const express = require('express'); 
const cors = require('cors');
require("dotenv").config(); // ✅ Load .env variables

const apodRoutes = require('./routes/apod');
const neoRoutes = require('./routes/neo');
const marsRouter = require("./routes/mars");
const epicRouter = require("./routes/epic");
const imageRouter = require("./routes/image");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/apod', apodRoutes);
app.use('/api/neo', neoRoutes);
app.use('/api/mars', marsRouter);
app.use('/api/epic', epicRouter);
app.use('/api/image', imageRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
