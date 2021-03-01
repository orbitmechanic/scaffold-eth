const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Accountable");
    myContract = await contractFactory.deploy();
  });

  describe("Accountable", function () {
    it("Should have a zero balance to start.", async function () {
      expect(await myContract.contractBalance()).to.equal(0);
    });

    /*
    it("Should absorb 1.2 stray eth.", async function () {
      const addressList = await ethers.getSigners();
      // <Transmit 1.2 ETH from addressList[1] to myContract.deployedAddress();>
      expect(myContract.contractBalance()).to.equal(1.2);
    });

    it("Should emitt a recipt when paid.", async function () {});
      const addressList = await ethers.getSigners();
      expect( 
        <Transmit 1.2 ETH 
          from addressList[1] 
          to myContract.deployedAddress();>)
          .to.emit(myContract.receipt)
          .withArgs(addressList[1],1.2);
    }); */

    it("Should not send for externals.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.debt(addressList[1], 200)).to.be.reverted;
    });
  });
});
