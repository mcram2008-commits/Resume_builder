module.exports = async (req, res) => {
  const results = {};
  const testModule = (name, fn) => {
    try {
      fn();
      results[name] = 'OK';
    } catch (e) {
      results[name] = 'ERROR: ' + e.message + '\n' + e.stack;
    }
  };

  testModule('express', () => require('express'));
  testModule('cors', () => require('cors'));
  testModule('helmet', () => require('helmet'));
  testModule('mongoose', () => require('mongoose'));
  testModule('authRoutes', () => require('../server/src/routes/auth'));
  testModule('resumeRoutes', () => require('../server/src/routes/resumes'));
  testModule('aiRoutes', () => require('../server/src/routes/ai'));

  res.status(200).json(results);
};
