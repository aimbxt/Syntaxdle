const express = require('express');
const cors = require('cors');
const session = require('express-session')
const app = express();
const port = 3000;
const usersRouter = require('./routes/users')
const guessRouter = require('./routes/guess')

app.use(cors({
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60000 * 60
  }
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