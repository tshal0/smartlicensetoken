// What I've learned: 

// 1. ERC721 token holders must implement ERC721Receiver and not ERC721Holder. 
// 2. When you get "The contract code couldn't be stored, please check your gas amount", it usually means 
// that you have not fully implemented an interface. In my case, I didn't implement the constructor properly. 
// You have to add your interfaces constructor as well, sort of like base() in c#. 

pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol";
import "./SmartLicense.sol";

contract Company is ERC721Receiver {

    SmartLicense _smartLicense;
    mapping(address => uint) _clients;
    mapping(string => uint) _licenseTokens;
    mapping(address => bool) _users;
    address _owner;
    string _companyUri;

    event ReceivedERC721Token(address indexed _sender, bytes32 message);
    
    function onERC721Received(address, uint256, bytes) public returns(bytes4) {
        return ERC721_RECEIVED;
    }

    constructor (address smartLicenseTokenAddress, string companyUri) public ERC721Receiver()
    {
        _smartLicense = SmartLicense(smartLicenseTokenAddress);
        _companyUri = companyUri;
        _owner = msg.sender;
    }

    function() payable public {
        revert();
    }

    function kill() public {
        if (msg.sender == _owner) {
            selfdestruct(_owner);
        }
    }

    function registerUser(address user) public {
        _users[user] = true;
    }

    function removeUser(address user) public {
        _users[user] = false;
    }

    function userExists(address user) public view returns(bool) {
        return _users[user];
    }

    function getCompanyUri() public view returns(string) {
        return _companyUri;
    }

    function sendSmartLicenseToken(address destination, uint256 tokenId) public {
        _smartLicense.safeTransferFrom(address(this), destination, tokenId);
    }

}