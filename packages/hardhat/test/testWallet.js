const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Testing", function () {
  let myContract;
  let addressList;
  let signers;

  beforeEach(async function () {
    const contractFactory = await ethers.getContractFactory("Wallet");
    addressList = await ethers.getSigners();
    signers = [
      addressList[1].address,
      addressList[2].address,
      addressList[3].address,
    ];
    myContract = await contractFactory.deploy(signers, 2);
  });

  describe("MultiSig Wallet", function () {
    it("Should accept signer addresses and threshold from owner.", async function () {
      expect(await myContract.getLimit()).to.equal(2);
    });

    it("Should accept ether from anyone.", async function () {
      console.log(addressList[4].address);
      await transfer(addressList[4].address, myContract.address, 1000);
      expect(await myContract.getBalance()).to.equal(1000);
    });

    it("Should allow any signer to create a transfer request.", async function () {
      await addressList[4].address.transfer(myContract.address, 1000);
      expect(
        await myContract.connect(signers[1]).createTransfer(100, addressList[5])
      )
        .to.emit(myContract, "RqstCreated")
        .withArgs(1, 100, signers[1], addressList[5]);
    });

    it("Should allow signers to approve transactions.", async function () {
      await addressList[4].address.transfer(myContract.address, 1000);
      await myContract
        .connect(signers[1])
        .createTransfer(100, addressList[5].address);
      await expect(myContract.connect(signers[2]).approve(1))
        .to.emit("RqstApprvd")
        .withArgs(1, 2, signers[2]);
    });

    it("Should send transactions when approval threshold is reached.", async function () {
      await addressList[4].address.transfer(myContract.address, 1000);
      await myContract
        .connect(signers[1])
        .createTransfer(100, addressList[5].address);
      expect(await myContract.connect(signers[2]).approve(1))
        .to.emit("RqstSent")
        .withArgs(1);
    });
  });
});
