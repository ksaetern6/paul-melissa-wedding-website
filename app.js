const express = require('express');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.originalname}-${uniqueSuffix}`);
  },
});
const upload = multer({ storage });

const app = express();
const port = process.env.PORT || 3000;

// Template Engine using Pug
app.set('views', './views');
app.set('view engine', 'pug');

// Static file path
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
// app.use(express.static(path.join(__dirname, 'node_modules/@popperjs')));
// app.use(express.static(path.join(__dirname, 'node_modules/jquery')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', message: 'Hello World!' });
});

app.get('/upload', (req, res) => {
  res.render('upload', { title: 'Upload' });
});

app.post('/upload', upload.single('uploaded-file'), (req, res) => {
  console.log(req.file, req.body);
});
app.listen(port, () => {
  // console.log('Server is up on port', port);
});
