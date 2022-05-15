const { Contract, ethers } = require("ethers");
require("dotenv").config();
const ballotJson = require("../artifacts/contracts/Ballot.sol/Ballot.json");

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY_3);
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
  // Delegate your vote!
  const to = "0xfB816671B8Ee00A14F184E9cD76A078dB0803677";
  console.log(`Delegating my vote to ${to}`);
  const tx = await ballotContract.delegate(to);
  console.log("Awaiting confirmations");
  await tx.wait();
  console.log(`Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
