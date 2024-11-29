const root = (req, res) => {
  res.json({
    message: "Welcome to Messaging API."
  });
};

module.exports = {
  root,
};
