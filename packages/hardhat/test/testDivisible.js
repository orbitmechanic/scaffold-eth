const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let contractFactory;
  let myContract;

  describe("Dvisible", function () {
    it("Should initialize to 8 decimals when told to.", async function () {
      contractFactory = await ethers.getContractFactory("Divisible");
      myContract = await contractFactory.deploy(8);
      expect(await myContract.decimals()).to.equal(8);
    });

    it("Should initialize to 0 decimals when told to.", async function () {
      contractFactory = await ethers.getContractFactory("Divisible");
      myContract = await contractFactory.deploy(0);
      expect(await myContract.decimals()).to.equal(0);
    });

    it("Should not initialize to 2.3 decimals.", async function () {
      contractFactory = await ethers.getContractFactory("Divisible");
      await expect((myContract = contractFactory.deploy(2.3))).to.be.reverted;
    });

    it("Should not initialize to -4 decimals.", async function () {
      contractFactory = await ethers.getContractFactory("Divisible");
      await expect((myContract = contractFactory.deploy(-4))).to.be.reverted;
    });

    it("Should not initialize to 'D' decimals.", async function () {
      contractFactory = await ethers.getContractFactory("Divisible");
      await expect((myContract = contractFactory.deploy("D"))).to.be.reverted;
    });
  });
});
