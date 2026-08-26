const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});
const express = require('express');
const cors = require('cors');
const session = require('express-session')
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 5000;
const usersRouter = require('./routes/users')
const guessRouter = require('./routes/guess')

app.use(cors({
  credentials: true
}))
app.use(express.json())

//express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60000 * 60
  }
}))

//rate-limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
}))

app.use('/api/user', usersRouter)
app.use('/api/guess', guessRouter) 

app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});