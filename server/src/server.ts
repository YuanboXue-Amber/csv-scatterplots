import express from 'express';
import multer from 'multer';
import cors from 'cors';

const server = express();
server.use(cors());

// store file in public folder with name date+originalName
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage }).single('file');

server.get('/', (req: any, res: any) => {
  return res.send('Hello Server');
});

server.post('/upload', (req: any, res: any) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(`Error uploading file ${err}`);
      return res.status(500).json(err);
    }

    if (req.file) {
      console.log(`File uploaded to ${req.file.filename}`);
      return res.status(200).send(req.file);
    }

    return res.status(500);
  });
});

server.listen(8000, () => {
  console.log('Backend server running on port 8000');
});
