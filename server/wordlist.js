const words = ["apple", "roate", "float", "grape", "boats"]; // Add more words as needed

function generateWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

module.exports = { generateWord };
