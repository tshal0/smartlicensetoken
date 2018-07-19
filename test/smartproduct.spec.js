import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { utils } from 'mocha';
var customUtils = require("./customUtils.js");
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");
var SmartProductLicense = artifacts.require("SmartProductLicense");
var SmartProduct = artifacts.require("SmartProduct");

contract('Testing SmartProduct contract', function(accounts) {

    let smartproduct;
    let token;
    let company;
    const name="SmartProductLicenseToken";
    const symbol="SLT";
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy SmartProduct', async () => {
        token = await SmartProductLicense.new(name, symbol);
        smartproduct = await SmartProduct.new(token.address, "SmartProduct");
        company =  await Company.new(token.address, "SmartCompany");
        expect(await smartproduct.getProductDescriptionUri()).to.equal("SmartProduct");
    })

    // it(' should be able to register and remove users', async () => {
    //     await company.registerUser(account1);
    //     expect(await company.userExists(account1)).to.equal(true);
    //     await company.removeUser(account1);
    //     expect(await company.userExists(account1)).to.equal(false);
    // })

    it(' should be able to receive tokens', async () => {
        let result = await token.mintUniqueTokenTo(smartproduct.address, 1000, "tokenuri", {from: accounts[0]})
            .then(() => customUtils.assertEvent(token, {event: "Transfer", logIndex: 0, args:{_from: '0x0000000000000000000000000000000000000000', _to: smartproduct.address}})
                .then((log) => { })
                .catch((err) => { assert(false, err); })
            );
        expect(await token.ownerOf(1000)).to.equal(smartproduct.address);
    })

    it(' should be able to transfer tokens to company', async () => {
        var watcher = token.Transfer({_tokenId: 1000}, {fromBlock: 0, toBlock: 'latest'});
        await smartproduct.sendSmartLicenseToken(company.address, 1000)
            .then(() => {
                return watcher.get();
            }).then((events) => {
                var addresses =  events.map(e => e.args._to);
                expect(addresses).to.have.ordered.members([smartproduct.address, company.address]);
            });
            
        expect(await token.ownerOf(1000)).to.equal(company.address);
    })

    it(' should have a log of transfers for a token', async () => {

    })
});