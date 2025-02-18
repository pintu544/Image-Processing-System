const { v4: uuidv4 } = require('uuid');
const { parseCSV } = require('../utils/csvParser');
const { processImages } = require('../utils/imageProcessor');
const Request = require('../models/Request');
const Product = require('../models/Product');
const { logger } = require('../utils/logger');

exports.handleUpload = async (req, res) => {
  try {
    const requestId = uuidv4();
    const csvData = await parseCSV(req.file.path);
    
    // Create request record
    const request = new Request({
      requestId,
      totalImages: csvData.reduce((acc, row) => acc + row.inputImageUrls.length, 0),
      status: 'pending'
    });
    await request.save();

    // Create product records
    const products = csvData.map(row => ({
      serialNumber: row.serialNumber,
      productName: row.productName,
      inputImageUrls: row.inputImageUrls,
      requestId
    }));
    await Product.insertMany(products);

    // Start processing images asynchronously
    processImages(requestId).catch(err => logger.error('Image processing error:', err));

    res.status(200).json({
      success: true,
      requestId,
      message: 'File uploaded successfully. Processing started.'
    });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error.message
    });
  }
};