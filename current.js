//-----------------------------------------------------
let generatedWindow; // Variable to store the reference to the opened window
var ws = new WebSocket("ws://192.168.194.110:8765");

ws.onmessage = function (event) {
  // trigger the message update
  console.log("sentence received! do something here!");
  console.log(event.data);
  generatedSentence = event.data.toUpperCase();
  // Add the generated sentence to the history
  sentenceHistory.push(generatedSentence);
  // Check if the current page is the third HTML page
  const isThirdHTML = window.location.href.includes("list.html");
  // Update the terminal with the latest sentence (on other pages)
  if (!isThirdHTML) {
    const terminal = document.getElementById("userSentence");
    terminal.textContent = generatedSentence;
     // Set a random color for the terminal
const randomColor = getRandomColor();
console.log('Random Color:', randomColor);
terminal.style.color = randomColor;
  }
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
const sentenceHistory = [];

const displayButton = document.getElementById("display-button");
// Add click event listener to the "Display Sentence" button
if (displayButton) {
  displayButton.addEventListener("click", generateUserSentence);
  // Add click event listener to the "Generate Sentence" button
  document.getElementById("generate-button").addEventListener("click", generateRandomSentence);
}