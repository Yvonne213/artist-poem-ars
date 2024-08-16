
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

    let len = 200
    let verbs = "";
    for(let i = 0; i < len; i++) {

        const verb = await contract.verbList(i);
        verbs+=verb+", "
    }
    console.log(verbs)

   
    let nouns = "";
    for(let i = 0; i < len; i++) {

        const noun = await contract.nounList(i);
        nouns+=noun+", "
    }
    console.log(nouns)

   
    let times = "";
    for(let i = 0; i < len; i++) {

        const time = await contract.timeList(i);
        times+=time+", "
    }
    console.log(times)


}