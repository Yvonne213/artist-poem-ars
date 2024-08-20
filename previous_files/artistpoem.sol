// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


contract artistpoem{
string[] public verbList;
string[] public nounList;
string[] public timeList;

constructor() {
    verbList = ["creates", "steals", "plants", "circles", "plays", "draws", "chases", "watched", "holds", "mimics"];
    nounList = ["circles", "triangles", "brushes", "plants", "human", "animals", "a bird", "soul", "the world", "an apple"];
    timeList = [ "every moment",
  "while walking",
  "while eating",
  "while thinking",
  "everyday",
  "every morning",
  "every week",
  "every month",
  "every weekend",
  "every night",
  "every afternoon",
  "in a corner",
  "under the tree",
  "while sitting in the grass"];
}



function textInput (string memory _verb, string memory _noun, string memory _time) public {
    require(bytes(_verb).length > 0 && bytes(_noun).length > 0 && bytes(_time).length > 0, "Input strings cannot be empty");
   verbList.push(_verb);
   nounList.push(_noun);
   timeList.push(_time);
    // emit textStoreEvent( newVerb, newNoun, newTime);
}

function generateRandomNumber(uint256 upperBound) public view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, blockhash(block.number - 1))));
        return randomNumber % (upperBound + 1);
    }

function getRandomVerb() public view returns(string memory){
    uint256 randomIndex = generateRandomNumber(verbList.length);
    return verbList[randomIndex - 1];
}

function getRandomNoun() public view returns(string memory){
    uint256 randomIndex = generateRandomNumber(verbList.length);
    return nounList[randomIndex - 1];
}
function getRandomTime() public view returns(string memory){
     uint256 randomIndex = generateRandomNumber(verbList.length);
    return timeList[randomIndex - 1];
}

function getCurrentPoem() public view returns (string memory, string memory, string memory){
    return (verbList[verbList.length - 1], nounList[nounList.length - 1], timeList[timeList.length-1]);
}
}