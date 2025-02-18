const express = require('express');
const multer = require('multer');
const { getStatus} = require('../controllers/statusController');
const { handleUpload,} = require('../controllers/uploadController');
const { validateCSV } = require('../middleware/validateCSV');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csv'), validateCSV, handleUpload);
router.get('/status/:requestId', getStatus);

module.exports = router;