pragma solidity 0.8.0;
pragma abicoder v2;
import "hardhat/console.sol";
import "./inherited/Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

// Multi-Signature Wallet
// For Ivan on Tech Academy
// Solidity 101 Project
// Solution by Bob Clark

contract Wallet {

    struct Transfer{
        uint amount;
        address payable receiver;
        uint approvals;
        bool hasBeenSent;
        uint id;
    }
    Transfer[] transferRequests;
    mapping(address => bool) signers;
    mapping(address => mapping(uint => bool)) approvals;
    uint limit;

    event RqstCreated(uint _id, uint _amount, address _initiator, address _receiver);
    event RqstApprvd(uint _id, uint _approvals, address _approver);
    event RqstUnApprvd(uint _id, uint _approvals, address _approver);
    event RqstSent(uint _id);
    event Receipt(address recipiant, uint256 amount);
    
    //Should only allow people in the signers list to continue the execution.
    modifier onlySigners(){
        require(signers[msg.sender] = true, "Not a signer.");
        _;
    }
    //Should initialize the signers list and the limit 
    constructor(address[] memory _signers, uint _limit) {
        for (uint i=0; i<_signers.length; i++) {
            signers[_signers[i]] = true;
        }
        limit = _limit;
    }

    function isSigner(address amI) public view returns (bool) {
        return signers[amI];
    }
    
    // Absorb ETH from fallback position.
    receive() external payable {
        emit Receipt(msg.sender, msg.value);
    }
    
    //Create an instance of the Transfer struct and add it to the transferRequests array
    function createTransfer(uint _amount, address payable _receiver) public onlySigners {
        require(_amount <= address(this).balance,"Insufficient Funds.");
        uint id = transferRequests.length;
        transferRequests.push(Transfer(_amount, _receiver, 1, false, id));
        approvals[msg.sender][id] = true;
        emit RqstCreated(transferRequests.length, _amount, msg.sender, _receiver);
    }
    
    //Set your approval for one of the transfer requests.
    //Need to update the Transfer object.
    //Need to update the mapping to record the approval for the msg.sender.
    //When the amount of approvals for a transfer has reached the limit, this function should send the transfer to the recipient.
    //An owner should not be able to vote twice.
    //An owner should not be able to vote on a tranfer request that has already been sent.
    function approve(uint _id) public onlySigners {
        require(approvals[msg.sender][_id] == false,"Already approved.");
        require(transferRequests[_id].hasBeenSent == false, "Already Sent.");
        require(transferRequests[_id].amount <= address(this).balance, "Insufficient Funds.");
        approvals[msg.sender][_id] = true;
        transferRequests[_id].approvals++;
        emit RqstApprvd(_id, transferRequests[_id].approvals, msg.sender);

        if(transferRequests[_id].approvals >= limit){
            transferRequests[_id].hasBeenSent = true;
            transferRequests[_id].receiver.transfer(transferRequests[_id].amount);
            emit RqstSent(_id);
        }
    }

    // Undo!
    function disapprove(uint _id) public onlySigners {
        require(approvals[msg.sender][_id] == true,"Already unapproved.");
        require(transferRequests[_id].hasBeenSent == false, "Already Sent.");
        approvals[msg.sender][_id] = false;
        transferRequests[_id].approvals--;
        emit RqstUnApprvd(_id, transferRequests[_id].approvals, msg.sender);
    }
    
    //Should return all transfer requests
    function getTransferRequests() public view returns (Transfer[] memory){
         return transferRequests;
    } 
    
    // Testing hook.  
    // Note: signer addresses cannot be recovered from mapping
    function getLimit() public view returns (uint) {
        return limit;
    }

    // Testing hook.
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}