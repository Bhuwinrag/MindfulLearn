const { Pinecone } = require('@pinecone-database/pinecone');

// THIS IS THE FIX: The new Pinecone client automatically finds the
// API key from your .env file (PINECONE_API_KEY).
// You do not need to pass any arguments to it.
const pinecone = new Pinecone();

const index = pinecone.index('mindfulearn');

module.exports = index;