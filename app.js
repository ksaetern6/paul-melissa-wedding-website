const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox');

// dotenv
require('dotenv').config({ silent: true });

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/');
//   },
//   filename: (req, file, cb) => {
//     // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${file.originalname}`); // -${uniqueSuffix}`);
//   },
// });
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
  res.render('upload', { title: 'Upload', message: '' });
});

app.post('/upload', upload.single('uploaded-file'), (req, res) => {
  // API connection to Dropbox
  const dbx = new Dropbox.Dropbox({ fetch, accessToken: process.env.DBX_API_KEY });

  //
  const uploadSizeLimit = 500 * 1024 * 1024; // 150 MB
  const contents = req.file.buffer;
  const fileSize = req.file.size;

  // Dropbox Upload file
  try {
    if (fileSize < uploadSizeLimit) {
      dbx.filesUpload({ path: `/wedding-website-uploads/${req.file.originalname}`, contents })
        .then((response) => {
          res.status(200).render('upload', { title: 'Upload', message: 'File Uploaded' });
        })
        .catch((e) => {
          throw Error(e);
        });
    } else {
      throw Error('File size too large');
    }
  } catch (e) {
    console.log(Error, e);
    res.status(500).render('upload', { title: 'Upload', message: 'Upload Error' });
  }
});

app.get('/registry', (req, res) => {
  res.render('registry', { title: 'Registry' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.listen(port, () => {
  // console.log('Server is up on port', port);
});
