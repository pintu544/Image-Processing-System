const { parse } = require('csv-parse');
const fs = require('fs');
const { promisify } = require('util');

exports.parseCSV = async (filePath) => {
  const parsePromise = promisify(parse);
  const fileContent = await fs.promises.readFile(filePath);
  
  const records = await parsePromise(fileContent, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map(record => ({
    serialNumber: parseInt(record['S. No.']),
    productName: record['Product Name'],
    inputImageUrls: record['Input Image Urls'].split(',').map(url => url.trim())
  }));
};