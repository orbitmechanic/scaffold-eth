const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Mortal");
    myContract = await Ownable.deploy();
  });

  describe("Ownable", function () {
    it("Should should suicide for the owner.", async function () {
      expect(await myContract.amIOwner()).to.equal(true);
    });

    it("Should shouldn't suicide for not the owner.", async function () {
      const addressList = await ethers.getSigners();
      expect(await myContract.amIOwner()).to.equal(true);
    });
  });
});
