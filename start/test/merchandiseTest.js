let Merchandise = artifacts.require("./Merchandise.sol");

contract('Merchandise', async (accounts) => {
    let merchandise;
    let seller = accounts[0];
    let buyer = accounts[1];

    before(async () => {
        merchandise = await Merchandise.deployed();
        await merchandise.addItem(
            "A test item from Javascript tests",
            "Description of test item",
            web3.utils.toWei('2', 'ether'),  // toWei is now in web3.utils
            {from: seller}
        );
    });

    it("Should have the test item in the marketplace", async () => {
        let item = await merchandise.getItem(0);
        assert.equal(item[0].toNumber(), 0, "The item should have an id of 0");
        assert.equal(item[1], "A test item from Javascript tests", "The item should have the correct name");
        assert.equal(item[2], "Description of test item", "The item should have the correct description");
        // Using Javascript numbers now throws an error due to precision errors. Below you can see we're using strings instead
        assert.equal(web3.utils.fromWei(item[3].toString(), 'ether'), '2', "The item should have the correct price");
        // assert.isFalse(item[4], "The item should not be marked as sold");
        assert.isFalse(item[5], "The item should not be marked as received");
        assert.isFalse(item[6], "The item should not be marked as shipped");
    });

    it("Should fail to ship if not bought", async () => {
        try { 
            let itemToShip = await merchandise.shipItem(0, {
                from: seller
            });
            assert.fail();
        } catch(error) {
            assert.match(error.toString(), /revert/, "Transaction should have reverted");
        }
    });

    it("Should be able to buy an item", async () => {
        console.log("Entering buy test");
        // web3.eth.getBalance now returns a Promise instead of the balance, so we use await
        const buyerInitialBalanceInWei = await web3.eth.getBalance(buyer)
        buyerInitialBalanceInEther = web3.utils.fromWei(buyerInitialBalanceInWei, 'ether');
        console.log("Buyer funds: ", buyerInitialBalanceInEther);
        let itemToBuy = await merchandise.buyItem(0, {
            from: buyer,
            value: web3.utils.toWei('2', 'ether') // see note on line 23 about using Javascript numbers
        });
        console.log(itemToBuy);

        buyerPostBalanceInWei = await web3.eth.getBalance(buyer) // see not on line 43 regarding web3.eth.getBalance
        buyerPostBalanceInEther = web3.utils.fromWei(buyerPostBalanceInWei, 'ether');
        let boughtItem = await merchandise.getItem(0);
        assert.isTrue(boughtItem[4], "The item should be marked as sold");
        assert.isAbove(buyerInitialBalanceInEther - buyerPostBalanceInEther, 2, "Account should have been debited 2 ether");
    });

    it("Should fail if already sold", async () => {
        try {
            let itemToBuy = await merchandise.buyItem(0, {
                from: buyer,
                value: web3.utils.toWei('2', 'ether') // see note on line 23 about using Javascript numbers
            });
            assert.fail();
        } catch(error) {
            assert.match(error.toString(), /revert/, "Transaction should have reverted");
        }
    });

    it("Should fail to receive if not shipped", async () => {
        try {
            let itemToReceive = await merchandise.receiveItem(0, {
                from: buyer
            });
            assert.fail();
        } catch(error) {
            assert.match(error.toString(), /revert/, "Transaction should have reverted");
        }
    });

    it("Should ship after bought", async () => {
        let itemToShip = await merchandise.shipItem(0, {
            from: seller
        });
        let shippedItem = await merchandise.getItem(0);
        assert.isTrue(shippedItem[5], "The item should be marked as shipped");
    });

    it("Should fail to claim funds if not received", async () => {
        try {
            let itemToClaim = await merchandise.claimFunds(0, {
                from: seller
            });
            assert.fail();
        } catch(error) {
            assert.match(error.toString(), /revert/, "Transaction should have reverted");
        }
    });

    it("Should receive after shipped", async () => {
        let itemToReceive = await merchandise.receiveItem(0, {
            from: buyer
        });
        let receivedItem = await merchandise.getItem(0);
        assert.isTrue(receivedItem[6], "The item should be marked as received");
    });

    it("Should claim funds after received", async () => {
        const sellerInitialBalanceInWei = await web3.eth.getBalance(seller) // see note on line 43 regarding web3.eth.getBalance
        let sellerInitialBalanceInEther = web3.utils.fromWei(sellerInitialBalanceInWei, 'ether');
        let itemToClaim = await merchandise.claimFunds(0, {
            from: seller
        });
        const sellerPostBalanceInWei = await web3.eth.getBalance(seller) // see note on line 43 regarding web3.eth.getBalance
        let sellerPostBalanceInEther = web3.utils.fromWei(sellerPostBalanceInWei, 'ether');
        assert.isAbove(sellerPostBalanceInEther - sellerInitialBalanceInEther, 1.9, "Seller balance should have increased");
    });

});
