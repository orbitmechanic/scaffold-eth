const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Transactable");
    myContract = await contractFactory.deploy();
  });

  describe("Transactable", function () {
    it("Should have a zero balance to start.", async function () {
      const balance = await myContract.blnc();
      await expect(balance).to.equal(0x00);
    });

  });
});
