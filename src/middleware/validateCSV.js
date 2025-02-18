const { logger } = require('../utils/logger');

exports.validateCSV = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No CSV file uploaded'
    });
  }

  if (req.file.mimetype !== 'text/csv') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file must be a CSV'
    });
  }

  next();
};