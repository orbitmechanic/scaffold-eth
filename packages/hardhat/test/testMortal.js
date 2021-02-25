const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Mortal");
    myContract = await contractFactory.deploy();
  });

  describe("Mortal", function () {
    it("Should not suicide if unpaused.", async function () {
      await expect(myContract.implode()).to.be.reverted;
    });

    it("Should suicide for the owner when paused.", async function () {
      await myContract.Pause();
      await expect(myContract.implode())
        .to.emit(myContract, "imploding")
        .withArgs("!MOOB");
    });

    it("Should not suicide for not the owner when paused.", async function () {
      const addressList = await ethers.getSigners();
      await myContract.Pause();
      await expect(myContract.connect(addressList[1]).implode()).to.be.reverted;
    });
  });
});
