import { ethers } from "hardhat";

async function main() {

  const validSigners = ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0x70997970C51812dc3A010C7d01b50e0d17dc79C8","0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "0x90F79bf6EB2c4f870365E785982E1f101E93b906"];
  const quorum = 2;
 
  const multisig = await ethers.deployContract("MultiSig", validSigners, ({value:2}));

  await multisig.waitForDeployment();

  console.log(
    `Multisig deployed to ${multisig.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
