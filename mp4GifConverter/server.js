const express = require('express');
const multer = require('multer');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);
const cors = require('cors');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); 

app.use(express.static('public'));

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.post('/convert', upload.single('video'), (req, res) => {
    const filePath = req.file.path;
    const outputGifPath = `uploads/${req.file.filename}.gif`;

    ffmpeg(filePath)
        .output(outputGifPath)
        .outputOptions([
            '-vf scale=400:-1',
            '-r 5'
        ])
        .on('end', () => {
            fs.unlink(filePath, (err) => {
                if (err) console.error(err);
            });

            res.download(outputGifPath, (err) => {
                if (err) console.error(err);
                fs.unlink(outputGifPath, (err) => {
                    if (err) console.error(err);
                });
            });
        })
        .on('error', (err) => {
            console.error('Error: ' + err.message);
            res.status(500).send('Conversion failed.');
        })
        .run();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});