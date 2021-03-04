const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Fungible");
    myContract = await contractFactory.deploy();
  });

  describe("Fungible", function () {
    it("Should initialize to 1:1", async function () {
      expect(await myContract.price()).to.equal(1);
    });

    it("Should start at zero total supply", async function () {
      expect(await myContract.totalSupply()).to.equal(0);
    });

    it("Should take a new price.", async function () {
      await myContract.setPrice(3);
      expect(await myContract.price()).to.equal(3);
    });

    it("Should mint a token at 1:1.", async function () {
      await expect(myContract.mint({ value: 1 })).to.equal(1);
    });
  });
});
