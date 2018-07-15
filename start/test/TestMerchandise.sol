pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Merchandise.sol";

contract TestMerchandise {

    uint public initialBalance = 10 ether;
    Merchandise merchandise;

    function beforeAll() public {
        merchandise = Merchandise(DeployedAddresses.Merchandise());
    }

    function testAddItem() public {
        uint numberItems = merchandise.addItem("Test Item", "Test Description", 4 ether);

        uint expected = 1;

        Assert.equal(numberItems, expected, "It should contain 1 item");
    }

    function testGetItem() public {
        uint expectedItemId = 1;
        string memory expectedName = "Test Item";
        string memory expectedDesc = "Test Description";
        uint expectedPrice = 4 ether;

        uint returnItemId;
        string memory returnName;
        string memory returnDesc;
        uint returnPrice;
        bool returnSold;
        bool returnShipped;
        bool returnReceived;

        (returnItemId, returnName, returnDesc, returnPrice, returnSold, returnShipped, returnReceived) = merchandise.getItem(0);

        Assert.equal(returnItemId, expectedItemId, "The ID should be zero");
        Assert.equal(returnName, expectedName, "The name should be Test Item");
        Assert.equal(returnDesc, expectedDesc, "The description should be Test Description");
        Assert.equal(returnPrice, expectedPrice, "The price should be 4 ether");
        Assert.isFalse(returnSold, "The sold status should be false");
        Assert.isFalse(returnShipped, "The shipped status should be false");
        Assert.isFalse(returnReceived, "The received status should be false");
    }

    function testBuyItem() public {
        bool item = merchandise.buyItem.value(4 ether)(0);

        Assert.isTrue(item, "The function should have returned true");
    }

}