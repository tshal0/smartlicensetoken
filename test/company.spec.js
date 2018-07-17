import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");


contract('Testing Company contract', function(accounts) {

    let token;
    
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy Company', async () => {
        company = await Company.deployed().then((instance) => {
            console.log(instance);
        });
    })
});