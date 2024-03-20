import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";
import { MultiSig } from "../typechain-types";
import { connect } from "undici-types";

describe("Multisig", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMultisig() {    
    // Contracts are deployed using the first signer/account by default
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const quorum = 2;

    const MultiSig = await ethers.getContractFactory("MultiSig");
    const multiSig = await MultiSig.deploy([owner, addr1, addr2, addr3], quorum);
    // expect (await (MultiSig.deploy([owner, addr1, addr2, ZeroAddress], quorum))).to.be.rejectedWith("get out");

    return { owner, addr1, addr2, addr3, multiSig};
  }

  describe("Constructor", function () {
    it("Should set the right addresses", async function () {
      const { owner, addr1, addr2, addr3, multiSig } = await loadFixture(deployMultisig);

      // Verify that all addresses passed to the constructor are not zero addresses
      for (const signer of [owner, addr1, addr2, addr3]) {
        expect(signer.address).to.not.equal(ZeroAddress);        
      }
    });
  });

  describe("Initiate Transaction", function () {
    it("Should add a transaction and count", async function () {

      const { owner, addr1, addr2, addr3, multiSig } = await loadFixture(deployMultisig);

      const addr4 = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
      // const[addr4, addr5] = await ethers.getSigners();
      const txAmount = 10;

      const txDeposit = await multiSig.initiateTransaction(txAmount, addr1.address);
      txDeposit.wait();

      expect(owner.address != ZeroAddress );   
      // await expect(multiSig.connect(owner).onlyValidSigner());

      // await expect(multiSig.initiateTransaction(0, addr2.address)).to.be.rejectedWith("can't save zero value");

     const tx =  await expect(multiSig.connect(addr2).initiateTransaction(30, addr1)).to.not.be.revertedWith(
        "not valid signer");  
      
      expect(tx).length.to.be.equal(1);

  
    });
  });
});

    