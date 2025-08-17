const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.use('/api/auth', require('./routes/authRoutes'));

// LSMS routes
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/overtime', require('./routes/overtimeRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));

// Export the app object for testing or start the server if run directly
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
