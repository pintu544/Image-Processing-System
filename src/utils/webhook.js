const axios = require('axios');
const { logger } = require('./logger');

exports.triggerWebhook = async (requestId) => {
  try {
    const response = await axios.post(process.env.WEBHOOK_URL, {
      requestId,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
    
    logger.info(`Webhook triggered for requestId: ${requestId}`);
    return response.data;
  } catch (error) {
    logger.error(`Webhook error for requestId ${requestId}:`, error);
    throw error;
  }
};