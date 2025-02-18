# API Endpoints - Image Processing System

**Date:** 2025-02-18 06:13:32 UTC
**Author:** pintu kumar

## 1. Upload API

### Endpoint

```
POST /api/upload
```

### Description

Accepts a CSV file and initiates the image processing job.

### Request

- **Headers:**
  - `Content-Type: multipart/form-data`
- **Body:**
  - `csv` (file): The CSV file containing product and image data.

### Response

- **Status 200 OK:**
  ```json
  {
    "success": true,
    "requestId": "unique-request-id",
    "message": "File uploaded successfully. Processing started."
  }
  ```
- **Status 400 Bad Request:**
  ```json
  {
    "success": false,
    "message": "No CSV file uploaded"
  }
  ```
  ```json
  {
    "success": false,
    "message": "Uploaded file must be a CSV"
  }
  ```
- **Status 500 Internal Server Error:**
  ```json
  {
    "success": false,
    "message": "Error processing upload",
    "error": "Error message"
  }
  ```

## 2. Status API

### Endpoint

```
GET /api/status/:requestId
```

### Description

Returns the processing status of a given request ID.

### Request

- **Headers:**
  - `Content-Type: application/json`
- **Parameters:**
  - `requestId` (string): The unique request ID.

### Response

- **Status 200 OK:**
  ```json
  {
    "success": true,
    "status": "processing",
    "progress": {
      "total": 10,
      "processed": 5,
      "percentage": 50
    },
    "products": [
      {
        "serialNumber": 1,
        "productName": "SKU1",
        "status": "processing",
        "inputImageUrls": [
          "https://www.public-image-url1.jpg",
          "https://www.public-image-url2.jpg",
          "https://www.public-image-url3.jpg"
        ],
        "outputImageUrls": [
          "https://www.public-image-output-url1.jpg",
          null,
          null
        ]
      },
      {
        "serialNumber": 2,
        "productName": "SKU2",
        "status": "pending",
        "inputImageUrls": [
          "https://www.public-image-url1.jpg",
          "https://www.public-image-url2.jpg",
          "https://www.public-image-url3.jpg"
        ],
        "outputImageUrls": []
      }
    ]
  }
  ```
- **Status 404 Not Found:**
  ```json
  {
    "success": false,
    "message": "Request not found"
  }
  ```
- **Status 500 Internal Server Error:**
  ```json
  {
    "success": false,
    "message": "Error fetching status",
    "error": "Error message"
  }
  ```

## 3. Webhook for Processing Completion

### Endpoint

```
POST /webhook
```

### Description

Receives notifications when image processing is completed.

### Request

- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "requestId": "unique-request-id",
    "status": "completed",
    "timestamp": "2025-02-18T06:13:32.000Z"
  }
  ```

### Response

- **Status 200 OK:**
  ```json
  {
    "success": true,
    "message": "Webhook received"
  }
  ```
- **Status 500 Internal Server Error:**
  ```json
  {
    "success": false,
    "message": "Error processing webhook",
    "error": "Error message"
  }
  ```


