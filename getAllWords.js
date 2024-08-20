const CONNECT_AUTOMATICALLY = true;

if (CONNECT_AUTOMATICALLY) {
    main();
}

async function main() {
    try {
        const statusElement = document.getElementById('status');
        statusElement.innerText = "Checking browser compatibility...";

        if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
            alert("Please switch to a browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)");
            return;
        }

        statusElement.innerText = "Checking MetaMask installation...";
        if (!window.ethereum) {
            alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)");
            return;
        }

        statusElement.innerText = "Connecting to MetaMask...";
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        console.log("Wallet connected");

        statusElement.innerText = "Checking network...";
        const chainId = await provider.getNetwork();
        if (chainId.chainId != 137) {
            alert("Please switch to the Mumbai network in MetaMask. The page will refresh automatically after switching.");
            return;
        }

        statusElement.innerText = "Connected to Mumbai network. Fetching words...";
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const contractWithSigner = contract.connect(signer);

        const len = 20;
        let verbs = "";
        let nouns = "";
        let times = "";

        for (let i = 0; i < len; i++) {
            try {
                verbs += await contract.verbList(i) + ", ";
                nouns += await contract.nounList(i) + ", ";
                times += await contract.timeList(i) + ", ";
            } catch (error) {
                console.error("Error fetching words", error);
                break;
            }
        }

        console.log(verbs);
        console.log(nouns);
        console.log(times);

        document.getElementById('words').innerText = `
            Verbs: ${verbs}
            Nouns: ${nouns}
            Times: ${times}
        `;

        statusElement.innerText = "Words fetched successfully!";
    } catch (error) {
        console.error("An error occurred:", error);
        document.getElementById('status').innerText = "An error occurred. Please check the console for details.";
    }
}
