
/* CONNECT_AUTOMATICALLY
  true: automatically connect to Web3 Provider on page load.
  false: enable "click to connect" button
*/
const CONNECT_AUTOMATICALLY = true;

var sentenceHistory = [];



if (CONNECT_AUTOMATICALLY) {
    main();
} else {
    // connectButton.onclick = main;
}
async function main() {

    // INITIALIZAING STEPS (SKIP TO THE BOTTOM TO WRITE YOUR OWN CODE)
    // loadingIconConnect.style.display = "block";
    // Check website compatibility
    if (navigator.userAgent.indexOf("Safari") != -1
        && navigator.userAgent.indexOf("Chrome") == -1) {
        alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)");
        // loadingIconConnect.style.display = "none";
        return;
    }
    console.log("Browser is Web3 compatible");

    // Check if MetaMask is installed
    if (!window.ethereum) {
        alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)");
        // loadingIconConnect.style.display = "none";
        return;
    }
    console.log("MetaMask is installed");

    // (REQUIRED) Connect to a Web3 provider (MetaMask in most cases)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    // If the network changes, refresh the page. (e.g. the user switches from mainnet to goerli)
    provider.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
            window.location.reload();
        }
    });

    try {
        // (REQUIRED) Request to connect current wallet to the dApp
        await provider.send("eth_requestAccounts", []);
    } catch (error) {
        const errorMessage = "Cannot connect to wallet. There might be an issue with another browser extenstion. Try disabling some browser extensions (other than MetaMask), then attempt to reconnect."
        console.error(errorMessage, error);
        alert(errorMessage);
        // loadingIconConnect.style.display = "none";
        return;
    }
    console.log("Wallet connected");


    // Check if user is signed in to correct network
    const chainId = await provider.getNetwork();
    if (chainId.chainId != 137) {
        alert("Please switch to the Mumbai in MetaMask. The page will refresh automatically after switching.");
        // loadingIconConnect.style.display = "none";
        return;
    }
    console.log("Connected to Mumbai");

    // AT THIS POINT, THE USER SHOULD BE SUCCESSFULLY CONNECTED TO THE DAPP

    // Update the page to show the user is connected
    connectionStatus.textContent = "Connected ✔ ";

    connectButton.setAttribute("disabled", "true");
    //...............up is connection issues......................................//

    // MetaMask is our 'provider' in this case
    // const provider = new ethers.providers.Web3Provider(window.ethereum);

    // You (whoever is signed into MetaMask) is the 'signer'
    const signer = provider.getSigner();

    // the 'contract' object allows us to call functions from our smart contract
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // the 'contractWithSigner' object allows us to call smart contract functions that
    // require us to send a transaction (like changing a number on the blockchain)
    const contractWithSigner = contract.connect(signer);


     //-------------------- place holder--------------------------------------
     const dynamicPlaceholders = [
        {
          elementId: "verbInput",
          placeholders: [ "eg: daydreams about",
          "eg: thinks about",
          "eg: steals",
          "eg: doesn't sleep"],
          currentIndex: 0
        },
        {
          elementId: "nounInput",
          placeholders: ["eg: birds", "eg: several apples", "eg: panties","eg: a universe"],
          currentIndex: 0
        },
        {
            elementId: "timeInput",
            placeholders: ["eg: everyday", "eg: in the gallery", "eg: 5am everyday","eg: on the grass"],
            currentIndex: 0
          }
      ];
  
// Function to change the placeholder
function changePlaceholder() {
    dynamicPlaceholders.forEach((item) => {
      const inputElement = document.getElementById(item.elementId);
      inputElement.placeholder = item.placeholders[item.currentIndex];
      item.currentIndex = (item.currentIndex + 1) % item.placeholders.length; // Cycle through the placeholders
    });
  }

// Change the placeholder every 5 seconds (5000 milliseconds)
setInterval(changePlaceholder, 3000);


    //.....................................................................
    // WebSocket handling 
    let generatedWindow; // Variable to store the reference to the opened window
    var ws = new WebSocket("ws://192.168.194.110:8765");

    ws.onmessage = function (event) {
        // trigger the message update
        console.log("sentence received! do something here!");
        console.log(event.data);
        generatedSentence = event.data.toUpperCase();
      

        // Add the generated sentence to the history
        sentenceHistory.push(generatedSentence.toUpperCase());

        // Check if the current page is the third HTML page
        const isThirdHTML = window.location.href.includes("list.html");

        // // Update the terminal with the latest sentence (on other pages)
        // if (!isThirdHTML) {
        //     const terminal = document.getElementById("userSentence");
        //     terminal.textContent = generatedSentence.toUpperCase();

        // }

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

    function sendMessage(content_content) {
        console.log("send out ws message");
        ws.send(content_content);
    }
   

//--------------------display type-in--------------------------------------------
    function generateUserSentence() {
    const verbInput = document.getElementById("verbInput").value.trim();
    const nounInput = document.getElementById("nounInput").value.trim();
    const timeInput = document.getElementById("timeInput").value.trim();
    

        if (verbInput || nounInput || timeInput) {
            const line1 = `The person who`;
            const line2 = `${verbInput} ${nounInput}`.padStart(5+ `${verbInput} ${nounInput}`.length);
            const line3 = `${timeInput}`.padStart(10 + `${timeInput}`.length);
            const line4 = `is an artist.`.padStart(15 + `is an artist`.length);

            const generatedSentence = `${line1}\n${line2}\n${line3}\n${line4}`;

            // Display the generated sentence
            const userSentence = document.getElementById("userSentence");
            userSentence.textContent = generatedSentence.toUpperCase();
            sendMessage(generatedSentence);
            // Update the sentence history list
            const historyList = document.getElementById("history");
            const listItem = document.createElement("li");
            listItem.textContent = generatedSentence.toUpperCase();
            historyList.appendChild(listItem);

            historyList.scrollTop = historyList.scrollHeight;

            // Clear the input fields
            document.getElementById("verbInput").value = '';
            document.getElementById("nounInput").value = '';
            document.getElementById("timeInput").value = '';

            // Add the generated sentence to the history
            sentenceHistory.push(generatedSentence.toUpperCase());
        }
      
    }

  // Add an event listener to the "Set Artist" button
  document.getElementById("setArtistButton").addEventListener("click", function() {
    const verbInput = document.getElementById("verbInput").value.trim();
    const nounInput = document.getElementById("nounInput").value.trim();
    const timeInput = document.getElementById("timeInput").value.trim();

    // Check if verbInput is empty or exceeds 
    if (verbInput === '') {
        alert("Please fill in the verb field.");
        return; // Exit the function early
    } else if (verbInput.length >= 12) {
        alert("Verb input cannot exceed 12 characters.");
        return; // Exit the function early
    }

    if (nounInput === '') {
        alert("Please fill in the noun field.");
        return; // Exit the function early
    } else if (nounInput.length >= 15) {
        alert("Noun input cannot exceed 15 characters.");
        return; // Exit the function early
    }

    if (timeInput === '') {
        alert("Please fill in the time field.");
        return; // Exit the function early
    } else if (timeInput.length >= 20) {
        alert("Time input cannot exceed 20 characters.");
        return; // Exit the function early
    }
});

    // const displayButton = document.getElementById("setArtistButton");
    // // Add click event listener to the "Display Sentence" button
    // if (displayButton) {
    //     displayButton.addEventListener("click", generateUserSentence);
    // }

    //...........................contract interaction.....................
    //.....................set user input data into blockchain.....................

    document.getElementById("setArtistButton").addEventListener("click", async () => {
        const verb = document.getElementById("verbInput").value;
        const noun = document.getElementById("nounInput").value;
        const time = document.getElementById("timeInput").value;

        try {
            // Call the textInput function in your smart contract
            await contractWithSigner.textInput(verb, noun, time);
            console.log("Artist set successfully!");
            generateUserSentence();

        } catch (error) {
            console.error("Error setting artist:", error);
        }

    });

    // Generate New Artist Button Click Event
    document.getElementById("generateArtistButton").addEventListener("click", async () => {
        // Initialize click count and waiting flag if not already done
    if (typeof window.clickCount === 'undefined') {
        window.clickCount = 0;
        window.isWaiting = false;
    }

    // Check if waiting or click count reached limit
    if (window.isWaiting || window.clickCount >= 3) {
        alert('Please wait for 10 seconds before clicking again.'); // Notify the user
        console.log('Wait for 10 seconds to click again.');
        return; // Prevent further execution
    }

    window.clickCount++; // Increment click count
        try {
        // Call the getRandomVerb, getRandomNoun, and getRandomTime functions in your smart contract
        const randomVerb = await contractWithSigner.getRandomVerb();
        const randomNoun = await contractWithSigner.getRandomNoun();
        const randomTime = await contractWithSigner.getRandomTime();

        // Display the generated artist in your HTML (adjust as needed)
        //   document.getElementById("current").innerText = `The person who ${randomVerb} ${randomNoun} ${randomTime} is an artist.`;
        
        const line1 = `The person who`;
        const line2 = `${randomVerb} ${randomNoun}`.padStart(5+ `${randomVerb} ${randomNoun}`.length);
        const line3 = `${randomTime}`.padStart(10 + `${randomTime}`.length);
        const line4 = `is an artist.`.padStart(15 + `is an artist`.length);
       
        

        const artistDescription = `${line1}\n${line2}\n${line3}\n${line4}`.toUpperCase();
        // Display the generated artist in your HTML
        console.log(artistDescription);
        console.log(document.getElementById("userSentence")); // Error here 
        // document.getElementById("userSentence").innerText = artistDescription;

        sendMessage(artistDescription);


        //----------------
        // Add the generated artist description to the history list

        console.log(sentenceHistory);

        sentenceHistory.push(artistDescription);

        // Update the sentence history list
        const historyList = document.getElementById("history");
        if (historyList) {
            historyList.innerHTML = '';
        }
        sentenceHistory.forEach((sentence, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = sentence;
            // add 2024.2.11
            historyList.appendChild(listItem);
        });

        historyList.scrollTop = historyList.scrollHeight;
        //add 2024.2.11
        //const sentenceHistory = [];
        // } catch (error) {
        //     console.error("Error generating artist:", error);
        // }

    if (window.clickCount === 3) {
            // Start waiting period
            window.isWaiting = true;
            console.log('Reached 3 clicks. Please wait 10 seconds.');

            setTimeout(() => {
                console.log('You can click the button again.');
                window.clickCount = 0; // Reset click count
                window.isWaiting = false; // Allow clicking again
            }, 10000); // 10 seconds wait
        }
    } catch (error) {
        console.error("Error generating artist:", error);
    }
});



};


