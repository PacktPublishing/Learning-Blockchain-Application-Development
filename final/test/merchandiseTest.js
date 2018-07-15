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
            web3.toWei(2, 'ether'),
            {from: seller}
        );
    });

    it("Should have the test item in the marketplace", async () => {
        let item = await merchandise.getItem(0);
        assert.equal(item[0].toNumber(), 1, "The item should have an id of 1");
        assert.equal(item[1], "A test item from Javascript tests", "The item should have the correct name");
        assert.equal(item[2], "Description of test item", "The item should have the correct description");
        assert.equal(web3.fromWei(item[3].toNumber(), 'ether'), 2, "The item should have the correct price");
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
        buyerInitialBalance = web3.fromWei(web3.eth.getBalance(buyer).toNumber(), 'ether');
        console.log("Buyer funds: ", buyerInitialBalance);
        let itemToBuy = await merchandise.buyItem(0, {
            from: buyer,
            value: web3.toWei(2, 'ether')
        });
        console.log(itemToBuy);

        buyerPostBalance = web3.fromWei(web3.eth.getBalance(buyer).toNumber(), 'ether');
        let boughtItem = await merchandise.getItem(0);
        assert.isTrue(boughtItem[4], "The item should be marked as sold");
        assert.isAbove(buyerInitialBalance - buyerPostBalance, 2, "Account should have been debited 2 ether");
    });

    it("Should fail if already sold", async () => {
        try {
            let itemToBuy = await merchandise.buyItem(0, {
                from: buyer,
                value: web3.toWei(2, 'ether')
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
        let sellerInitialBalance = web3.fromWei(web3.eth.getBalance(seller).toNumber(), 'ether');
        let itemToClaim = await merchandise.claimFunds(0, {
            from: seller
        });
        let sellerPostBalance = web3.fromWei(web3.eth.getBalance(seller).toNumber(), 'ether');
        assert.isAbove(sellerPostBalance - sellerInitialBalance, 1.9, "Seller balance should have increased");
    });

});