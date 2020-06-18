const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Template Engine using Pug
app.set('views', './views');
app.set('view engine', 'pug');

// Static file path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Hello World!' });
});

app.listen(port, () => {
  // console.log('Server is up on port', port);
});
