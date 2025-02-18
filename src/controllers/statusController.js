const Request = require('../models/Request');
const Product = require('../models/Product');

exports.getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await Request.findOne({ requestId });
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const products = await Product.find({ requestId });
    
    res.status(200).json({
      success: true,
      status: request.status,
      progress: {
        total: request.totalImages,
        processed: request.processedImages,
        percentage: (request.processedImages / request.totalImages) * 100
      },
      products: products.map(p => ({
        serialNumber: p.serialNumber,
        productName: p.productName,
        status: p.status,
        inputImageUrls: p.inputImageUrls,
        outputImageUrls: p.outputImageUrls
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching status',
      error: error.message
    });
  }
};
