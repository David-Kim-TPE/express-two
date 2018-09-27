const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
let router = express.Router();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

var fileUploadOptions = {}

app.use(cors(corsOptions));
app.use(fileUpload(fileUploadOptions));
app.use('/', router);

router.get('/files/:filename', (req,res) => {
    var path = require('path');
    let filename=req.params.filename;

    //res.send(hash);
    var dir = path.resolve(".")+'/files/';
    var filePath = dir + filename;
    res.download(filePath);
 
});
 
router.post('/upload', (req, res) => {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  let file = req.files.file;
  let fileExtention = file.name.split(".").pop().toUpperCase();
  let md5 = file.md5();
  let filename = md5 + "." + fileExtention;
  let newFilePath = "./files/" + filename;
  file.mv(newFilePath, function(err) {
    if (err)
      return res.status(500).send(err);
 
    let path = req.protocol + '://' + req.get('host');
    res.status(200).json({ filepath: path+'/files/' + filename });
  });
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});
