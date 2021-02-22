const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  beforeEach(async function () {
    const Ownable = await ethers.getContractFactory("Ownable");
    myContract = await Ownable.deploy();
  });

  describe("Ownable", function () {
    it("Should know I'm the owner.", async function () {
      expect(await myContract.amIOwner()).to.equal(true);
    });

    it("Should know they're not the owner.", async function () {
      const addressList = await ethers.getSigners();
      expect(await myContract.connect(addressList[1]).amIOwner()).to.equal(
        false
      );
    });

    it("Should cancel prior ownership when transfering.", async function () {
      const addressList = await ethers.getSigners();
      await myContract.transferOwnership(addressList[1].address);
      expect(await myContract.amIOwner()).to.equal(false);
    });

    it("Should aquire new ownership when transferring", async function () {
      const addressList = await ethers.getSigners();
      await myContract.transferOwnership(addressList[1].address);
      expect(
        await myContract.connect(addressList[1].address).amIOwner()
      ).to.equal(true);
    });

    it("Should emit event when transferring.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.transferOwnership(addressList[1].address))
        .to.emit(myContract, "OwnershipTransferred")
        .withArgs(addressList[1].address);
    });

    it("Should not transfer if non-owner requests transfer.", async function () {
      const addressList = await ethers.getSigners();
      await expect(
        myContract
          .connect(addressList[1].address)
          .transferOwnership(addressList[2].address)
      ).to.be.reverted;
    });

    it("Should not transfer ownership back to the owner.", async function () {
      const addressList = await ethers.getSigners();
      await expect(myContract.transferOwnership(addressList[0].address)).to.be
        .reverted;
    });
  });
});
