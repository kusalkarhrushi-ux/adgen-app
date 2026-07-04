const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { runPipeline } = require('./pipeline');

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const OUTPUT_DIR = path.join(__dirname, '..', 'outputs');
[UPLOAD_DIR, OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/outputs', express.static(OUTPUT_DIR));
app.use(express.static(path.join(__dirname, '..', 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `product_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// In-memory job tracking (fine for a single-user local app; swap for a DB if you scale)
const jobs = {};

app.post('/api/generate', upload.single('product'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  const jobId = `job_${Date.now()}`;
  const { productName = 'Your Product', tagline = '', tone = 'exciting' } = req.body;

  jobs[jobId] = { status: 'processing', progress: 0, step: 'starting' };

  // Run pipeline async so we can respond immediately and let frontend poll progress
  runPipeline({
    imagePath: req.file.path,
    productName,
    tagline,
    tone,
    outputDir: OUTPUT_DIR,
    onProgress: (step, progress) => {
      jobs[jobId] = { status: 'processing', step, progress };
    }
  })
    .then(result => {
      jobs[jobId] = { status: 'done', progress: 100, step: 'complete', videoUrl: `/outputs/${result.filename}` };
    })
    .catch(err => {
      console.error('Pipeline error:', err);
      jobs[jobId] = { status: 'error', error: err.message };
    });

  res.json({ jobId });
});

app.get('/api/status/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.listen(PORT, () => {
  console.log(`\nAdGen server running at http://localhost:${PORT}\n`);
});
