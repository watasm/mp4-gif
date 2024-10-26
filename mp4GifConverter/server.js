const express = require('express');
const multer = require('multer');
const { Kafka } = require('kafkajs');
const path = require('path');

const app = express();

const upload = multer({ dest: 'uploads/' });

const kafka = new Kafka({
  clientId: 'mp4GifConverter-api',
  brokers: [process.env.KAFKA_BROKER]  
});

const producer = kafka.producer();
producer.connect();

app.post('/convert', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    await producer.send({
      topic: 'mp4-conversion-requests',
      messages: [{ value: JSON.stringify({ filePath }) }]
    });

    res.status(202).json({ message: 'File uploaded and conversion request sent to Kafka', filePath });
  } catch (error) {
    console.error('Error publishing to Kafka:', error);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));