const { Contract, ethers } = require("ethers");
require("dotenv").config();
const ballotJson = require("../artifacts/contracts/Ballot.sol/Ballot.json");

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  // if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = "0xd93d6b6eba6c53f76024e3ad96bab967eea3fd39"; // process.argv[2];
  console.log(`Query Proposals at address ${ballotAddress}`);
  const ballotContract = new Contract(ballotAddress, ballotJson.abi, signer);
  const proposalLength = 3;
  for (let i = 0; i < proposalLength; i++) {
    const _proposal = await ballotContract.proposals(i);
    const _name = ethers.utils.parseBytes32String(_proposal[0]);
    const _vote = _proposal[1];
    console.log(`Proposal #${i + 1} is: ${_name} and it has ${_vote} Votes`);
  }
  // Convert bytes to string
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
