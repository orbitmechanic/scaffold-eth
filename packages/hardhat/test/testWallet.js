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
      addressList[0].address,
      addressList[1].address,
      addressList[2].address,
    ];
    myContract = await contractFactory.deploy(signers, 2);
  });

  describe("MultiSig Wallet", function () {
    it("Should accept signer addresses and threshold from owner.", async function () {
      expect(await myContract.getLimit()).to.equal(2);
    });

    it("*Should emit a receipt upon receiving ether from anyone.", async function () {
      await expect(
        addressList[3].sendTransaction({
          to: myContract.address,
          value: 1000,
        })
      )
        .to.emit(myContract, "Receipt")
        .withArgs(addressList[3].address, 1000);
    });

    it("(Should balance should increase upon receipt.)", async function () {
      await addressList[0].sendTransaction({
        to: myContract.address,
        value: 1000,
      });
      expect(await myContract.getBalance()).to.equal(1000);
    });

    it("*Should allow a signer to create a transfer request.", async function () {
      console.log("Transfered")
      await addressList[0].sendTransaction({
        to: myContract.address,
        value: 1000,
      });
      console.log("Transfered 1000 eth from " + addressList[0]);
      await expect(
        myContract
          .connect(signers[1])
          .createTransfer(100, addressList[0].address)
      )
        .to.emit(myContract, "RqstCreated")
        .withArgs(1, 100, signers[0], addressList[0].address);
    });

    it("Should allow signers to approve transactions.", async function () {
      await addressList[0].sendTrasaction({
        to: myContract.address,
        value: 1000,
      });
      await myContract
        .connect(signers[0].address)
        .createTransfer(100, addressList[0].address);
      await expect(myContract.connect(signers[0]).approve(1))
        .to.emit("RqstApprvd")
        .withArgs(1, 2, signers[0]);
    });

    it("Should send transactions when approval threshold is reached.", async function () {
      await addressList[0].sendTransaction({
        to: myContract.address,
        value: 1000,
      });
      await myContract
        .connect(signers[0].address)
        .createTransfer(100, addressList[0].address);
      expect(await myContract.connect(signers[1]).approve(1))
        .to.emit("RqstSent")
        .withArgs(1);
    });
  });
});
