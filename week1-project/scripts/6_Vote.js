const { Contract, ethers } = require("ethers");
require("dotenv").config();
const ballotJson = require("../artifacts/contracts/Ballot.sol/Ballot.json");

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY_4);
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  const ballotAddress = "0xd93d6b6eba6c53f76024e3ad96bab967eea3fd39"; // process.argv[2];
  // if (process.argv.length < 4) throw new Error("Voter address missing");
  console.log(
    `Attaching ballot contract interface to address ${ballotAddress}`
  );
  const ballotContract = new Contract(ballotAddress, ballotJson.abi, signer);
  // const propoalNum = 0;
  // console.log(`Voting to Proposal#${propoalNum}`);
  // const tx = await ballotContract.vote(propoalNum);
  // console.log("Awaiting confirmations");
  // await tx.wait();
  // console.log(`Transaction completed. Hash: ${tx.hash}`);
  // Check final Vote results
  const winningProposalNum = await ballotContract.winningProposal();
  let winnerName = await ballotContract.winnerName();
  winnerName = ethers.utils.parseBytes32String(winnerName);
  console.log(
    `Winning Proposal is #${winningProposalNum}, AND its name is ${winnerName}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
