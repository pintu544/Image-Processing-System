const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;
const { URL } = require('url');
const Request = require('../models/Request');
const Product = require('../models/Product');
const { triggerWebhook } = require('./webhook');
const { logger } = require('./logger');

const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

const downloadImage = async (url) => {
  try {
    if (!isValidUrl(url)) {
      throw new Error(`Invalid URL or not a .jpg file: ${url}`);
    }
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    logger.error(`Error downloading image from URL ${url}:`, error);
    throw new Error(`Failed to download image from ${url}`);
  }
};

const processImage = async (imageBuffer) => {
  try {
    return sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .toBuffer();
  } catch (error) {
    logger.error('Error processing image:', error);
    throw new Error('Image processing failed');
  }
};

const saveImage = async (buffer, filename) => {
  try {
    const outputPath = path.join(process.env.IMAGE_STORAGE_PATH, filename);
    await fs.writeFile(outputPath, buffer);
    return outputPath;
  } catch (error) {
    logger.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

exports.processImages = async (requestId) => {
  try {
    const products = await Product.find({ requestId });
    const request = await Request.findOne({ requestId });

    let processedCount = 0;

    for (const product of products) {
      const outputUrls = [];

      for (const inputUrl of product.inputImageUrls) {
        try {
          const imageBuffer = await downloadImage(inputUrl);
          const processedBuffer = await processImage(imageBuffer);
          const filename = `${requestId}_${product.serialNumber}_${outputUrls.length + 1}.jpg`;
          const outputPath = await saveImage(processedBuffer, filename);

          outputUrls.push(outputPath);
          processedCount++;

          await Request.updateOne(
              { requestId },
              {
                processedImages: processedCount,
                status: processedCount === request.totalImages ? 'completed' : 'processing'
              }
          );
        } catch (error) {
          logger.error(`Error processing image for product ${product.productName} with URL ${inputUrl}:`, error);
          outputUrls.push(null);
        }
      }

      await Product.updateOne(
          { _id: product._id },
          {
            outputImageUrls: outputUrls,
            status: 'completed'
          }
      );
    }

    // Trigger webhook when all processing is complete
    await triggerWebhook(requestId);

  } catch (error) {
    logger.error('Image processing error:', error);
    await Request.updateOne({ requestId }, { status: 'failed' });
  }
};