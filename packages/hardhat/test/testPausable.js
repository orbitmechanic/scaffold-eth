const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Pausable");
    myContract = await Ownable.deploy();
  });

  describe("Ownable", function () {
    it("Should deploy unpaused.", async function () {
      expect(await myContract.isPaused()).to.equal(false);
    });

    it("Should pause if unpaused.", async function () {
      await myContract.Pause();
      expect(await myContract.isPaused()).to.equal(true);
    });

    it("Should not pause if paused.", async function () {
      await myContract.Pause();
      await expect(myContract.Pause()).to.be.reverted;
    });

    it("Should unpause if paused.", async function () {
      await myContract.Pause();
      await myContract.Unpause();
      expect(await myContract.isPaused()).to.equal(false);
    });

    it("Should not unpause if unpaused.", async function () {
      await expect(myContract.Unpause()).to.be.reverted;
    });

    it("Should not pause if not the owner.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.connect(addressList[1]).Pause()).to.be.reverted;
    });

    it("Should not unpause if not the owner.", async function () {
      const addressList = await ethers.getSigners();
      await myContract.Pause();
      await expect(myContract.connect(addressList[1]).Pause()).to.be.reverted;
    });
  });
});
