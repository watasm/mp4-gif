const { Kafka } = require('kafkajs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const kafka = new Kafka({
  clientId: 'mp4GifConverter-worker',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'mp4GifConverter-group' });
consumer.connect();
consumer.subscribe({ topic: 'mp4-conversion-requests', fromBeginning: true });

consumer.run({
  eachMessage: async ({ message }) => {
    const { filePath } = JSON.parse(message.value.toString());
    console.log(`Received file path for conversion: ${filePath}`);

    try {
      const gifPath = await convertMp4ToGif(filePath);
      console.log(`Conversion complete: ${gifPath}`);
    } catch (error) {
      console.error('Error during conversion:', error);
    }
  }
});

async function convertMp4ToGif(filePath) {
    return new Promise((resolve, reject) => {
      const outputFilePath = path.join(
        path.dirname(filePath),
        `${path.basename(filePath, path.extname(filePath))}.gif`
      );
  
      ffmpeg(filePath)
        .outputOptions([
          '-vf', 'scale=iw*400/ih:400', 
          '-r', '5',                     
        ])
        .on('end', () => {
          console.log(`GIF created at ${outputFilePath}`);
          resolve(outputFilePath);
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err);
          reject(err);
        })
        .save(outputFilePath);
    });
  }