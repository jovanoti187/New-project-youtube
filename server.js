import express from 'express';
import ytdl from 'ytdl-core';
import fs from 'fs';
import OpenAI from 'openai';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph } from 'docx';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/transcribe', async (req, res) => {
  const { url } = req.body;
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Ongeldige URL' });
  }
  const audioPath = `temp_${Date.now()}.mp3`;
  try {
    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(audioPath);
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1'
    });
    fs.unlinkSync(audioPath);
    res.json({ text: transcription.text });
  } catch (err) {
    console.error(err);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    res.status(500).json({ error: 'Transcriptie mislukt' });
  }
});

app.post('/download/txt', (req, res) => {
  const { text } = req.body;
  res.setHeader('Content-Disposition', 'attachment; filename="transcript.txt"');
  res.type('text/plain');
  res.send(text);
});

app.post('/download/docx', async (req, res) => {
  const { text } = req.body;
  const doc = new Document({
    sections: [{ children: [new Paragraph(text)] }]
  });
  const buffer = await Packer.toBuffer(doc);
  res.setHeader('Content-Disposition', 'attachment; filename="transcript.docx"');
  res.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.send(buffer);
});

app.post('/download/pdf', (req, res) => {
  const { text } = req.body;
  res.setHeader('Content-Disposition', 'attachment; filename="transcript.pdf"');
  res.type('application/pdf');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.text(text);
  doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
