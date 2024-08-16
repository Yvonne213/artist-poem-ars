
//-----------------------------------------------------
let generatedWindow; // Variable to store the reference to the opened window
var ws = new WebSocket("ws://192.168.194.100:8765");

ws.onmessage = function (event) {
  // trigger the message update
  console.log("sentence received! do something here!");
  console.log(event.data.toUpperCase());
  generatedSentence = event.data.toUpperCase();

  // Add the generated sentence to the history
  sentenceHistory.push(generatedSentence);

  // Check if the current page is the third HTML page
  const isThirdHTML = window.location.href.includes("list.html");


  // Update the sentence history list
  const historyList = document.getElementById("history");
  if (historyList) {
    historyList.innerHTML = '';
  }
  sentenceHistory.forEach((sentence, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = sentence.toUpperCase();

    historyList.appendChild(listItem);
  });

  historyList.scrollTop = historyList.scrollHeight;
  console.log(historyList.scrollHeight);
};

const sentenceHistory = [];

let currentTop = 0; // Track the current top position of the history list
const scrollSpeed = 1; // Adjust this to control the speed of the scroll

function updateScroll() {
  const historyList = document.getElementById("history");
  if (!historyList) return;

  const maxScrollHeight = historyList.scrollHeight - historyList.parentNode.offsetHeight;

  if (currentTop > maxScrollHeight) {
    currentTop = 0; // Reset scroll to top
  } else {
    currentTop += scrollSpeed; // Move content up
  }

  historyList.style.top = `-${currentTop}px`; // Apply the new top position
}

setInterval(updateScroll, 5); // Adjust interval for smoother or faster scrolling
