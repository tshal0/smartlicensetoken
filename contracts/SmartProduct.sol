// What I've learned: 

// 1. ERC721 token holders must implement ERC721Receiver and not ERC721Holder. 
// 2. When you get "The contract code couldn't be stored, please check your gas amount", it usually means 
// that you have not fully implemented an interface. In my case, I didn't implement the constructor properly. 
// You have to add your interfaces constructor as well, sort of like base() in c#. 

pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol";
import "./SmartProductLicense.sol";

contract SmartProduct is ERC721Receiver {

    SmartProductLicense _smartLicense;
    mapping(address => uint) _customers;
    mapping(string => uint) _licenseTokens;
    mapping(address => bool) _users;
    address _owner;
    string _productDescriptionUri;

    event ReceivedERC721Token(address indexed _sender, bytes32 message);
    
    function onERC721Received(address, uint256, bytes) public returns(bytes4) {
        return ERC721_RECEIVED;
    }

    constructor (address smartLicenseTokenAddress, string productDescriptionUri) public ERC721Receiver()
    {
        _smartLicense = SmartProductLicense(smartLicenseTokenAddress);
        _productDescriptionUri = productDescriptionUri;
        _owner = msg.sender;
    }

    function() payable public {
        revert();
    }

    function kill() public {
        require(msg.sender == _owner);
        selfdestruct(_owner);
    }

    function sendSmartLicenseToken(address destination, uint256 tokenId) public {
        require(msg.sender == _owner);
        _smartLicense.safeTransferFrom(address(this), destination, tokenId);
    }

    function getProductDescriptionUri() public view returns(string) {
        return _productDescriptionUri;
    }
}