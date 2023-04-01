const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    uuidv4 = require('uuid/v4');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
const DIR = './uploads/';
app.use('/images', express.static(DIR));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

app.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
    const user = {
        ...(JSON.parse(req.body.formData)),
        profileImg: req.file.filename
    };
    
    res.send({'message': 'Date recieved and pic uploaded successfully', user})
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Connected to port ' + port))
