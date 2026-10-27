const mongoose = require('mongoose');

module.exports = async (req, res) => {
  let connectError = null;
  const uri = process.env.MONGODB_URI || '';

  if (mongoose.connection.readyState !== 1 && uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    } catch (e) {
      connectError = e.message;
    }
  }

  res.status(200).json({
    status: 'ok',
    readyState: mongoose.connection.readyState,
    readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    hasUri: Boolean(uri),
    uriPrefix: uri.slice(0, 20),
    connectError
  });
};
