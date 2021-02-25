const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Nameable");
    myContract = await contractFactory.deploy("TestToken", "TST");
  });

  describe("Nameable", function () {
    it("Should have a name.", async function () {
      expect(await myContract.name()).to.equal("TestToken");
    });

    it("Should have a symbol.", async function () {
      expect(await myContract.symbol()).to.equal("TST");
    });

    it("Should be re-name-able.", async function () {
      myContract.reName("QuizToken");
      expect(await myContract.name()).to.equal("QuizToken");
    });

    it("Should emit event when renaming.", async function () {
      await expect(myContract.reName("QuizToken"))
        .to.emit(myContract, "Renamed")
        .withArgs("QuizToken");
    });

    it("Should be re-symbol-able.", async function () {
      myContract.reSymbol("QZT");
      expect(await myContract.symbol()).to.equal("QZT");
    });

    it("Should emit event when symboling.", async function () {
      await expect(myContract.reSymbol("QZT"))
        .to.emit(myContract, "Resymboled")
        .withArgs("QZT");
    });

    it("Should not rename for a non-owner", async function () {
      const addressList = await ethers.getSigners();
      await expect(
        myContract.connect(addressList[1].address).reName("QuizToken")
      ).to.be.reverted;
    });

    it("Should not resymbol for a non-owner", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.connect(addressList[1].address).reSymbol("QZT"))
        .to.be.reverted;
    });
  });
});
