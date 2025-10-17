const Material = require('../models/Material');
const Course = require('../models/Course');
const fs = require('fs');
const pdf = require('pdf-parse'); // Requires pdf-parse@1.1.1
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { createEmbedding } = require('../utils/geminiService');
const pineconeIndex = require('../utils/pineconeService');

const uploadMaterial = async (req, res) => {
  const { courseId, title } = req.body;
  if (!req.file) { return res.status(400).json({ message: 'Please upload a file' }); }
  try {
    const course = await Course.findById(courseId);
    if (!course || course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const material = new Material({ course: courseId, title, fileUrl: `/uploads/${req.file.filename}` });
    const createdMaterial = await material.save();
    if (req.file.mimetype === 'application/pdf') {
      console.log('Starting PDF ingestion...');
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);
      const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
      const chunks = await splitter.splitText(data.text);
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await createEmbedding(chunks[i]);
        await pineconeIndex.upsert([{
          id: `${createdMaterial._id}-chunk-${i}`,
          values: embedding,
          metadata: { courseId: courseId.toString(), materialId: createdMaterial._id.toString(), text: chunks[i] },
        }]);
      }
      console.log('Successfully ingested PDF content into vector database.');
    }
    res.status(201).json(createdMaterial);
  } catch (error) {
    console.error("Error uploading material:", error);
    res.status(500).json({ message: 'Server error during material upload.' });
  }
};

const getMaterialsForCourse = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadMaterial,
  getMaterialsForCourse,
};