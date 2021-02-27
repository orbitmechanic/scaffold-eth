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

    it("Should not report balance to strangers.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.connect(addressList[1].address).contractBalance())
        .to.be.reverted;
    });

    it("Should absorb 1.2 stray eth.", async function () {
      const addressList = await ethers.getSigners();
      expect();
    });

    it("Should reply to 1.2 stray eth. with a recipt.", async function () {});

    it("Should not pay salary if unpasued.", async function () {
      await expect(myContract.salary(0)).to.be.reverted;
    });

    it("Should pay salary if pasued.", async function () {});

    it("Should rebalance for the owner.", async function () {
      await myContract.pause();
      await expect(myContract.rebalance())
        .to.emit(myContract, "rebalance")
        .withArgs(0);
    });

    it("Should not rebalance for strangers.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.connect(addressList[1]).rebalance()).to.be
        .reverted;
    });

    it("Should not debit for externals.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.debt(addressList[1], 200)).to.be.reverted;
    });

    it("Should not credit for externals.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.credit(addressList[1], 200)).to.be.reverted;
    });
  });
});
