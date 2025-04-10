exports.generateWord = () => {
  const words = ["crane", "table", "shine", "bliss", "trend"];
  return words[Math.floor(Math.random() * words.length)];
};
