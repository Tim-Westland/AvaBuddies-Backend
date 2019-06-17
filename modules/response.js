exports.data = async(test, data, res) => {
  if (test) {
    return data;
  } else if (data.error) {
    return res.status(400).send(data.error);
  } else {
    return res.json(data);
  }
};
