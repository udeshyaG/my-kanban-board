const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');

const app = express();

// Routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const projectRoutes = require('./src/routes/projects');
const taskRoutes = require('./src/routes/tasks');
const commentRoutes = require('./src/routes/comments');

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// For the cookie session
app.set('trust proxy', true);
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1'],
  })
);

app.use('/api/', authRoutes);
app.use('/api/', userRoutes);
app.use('/api/', projectRoutes);
app.use('/api/', taskRoutes);
app.use('/api/', commentRoutes);

app.get('/', (req, res) => {
  res.send('Hello');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
