module.exports = function sendResponse(res, status, payload) {
  res.status(status);
  res.send(payload);
};
