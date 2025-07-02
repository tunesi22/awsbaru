// install: npm install aws-sdk express cors dotenv
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set AWS credentials & region (IAM user S3, jangan root!)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-2', // region S3 kamu (Singapore)
});

const s3 = new AWS.S3();

app.post('/generate-presigned-url', async (req, res) => {
  const { fileName, fileType } = req.body;
  const bucket = 'arenagogo'; 

  const params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 300, // URL berlaku 5 menit
    ContentType: fileType,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    const publicUrl = `https://cdnn.arenago.app/${fileName}`; // GANTI dengan domain CloudFront baru kamu!
    res.json({ uploadURL, publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ready at http://0.0.0.0:${PORT}`);
});
