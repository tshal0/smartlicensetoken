import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { utils } from 'mocha';
var customUtils = require("./customUtils.js");
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");
var SmartProductLicense = artifacts.require("SmartProductLicense");

contract('Testing Company contract', function(accounts) {

    let company;
    let token;
    const name="SmartProductLicenseToken";
    const symbol="SLT";
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy Company', async () => {
        token = await SmartProductLicense.new(name, symbol);
        company = await Company.new(token.address, "companyuri");

        expect(await company.getCompanyUri()).to.equal("companyuri");
    })

    it(' should be able to register and remove users', async () => {
        await company.registerUser(account1);
        expect(await company.userExists(account1)).to.equal(true);
        await company.removeUser(account1);
        expect(await company.userExists(account1)).to.equal(false);
    })

    it(' should be able to receive tokens', async () => {
        let result = await token.mintUniqueTokenTo(company.address, 1000, "tokenuri", {from: accounts[0]})
            .then(() => customUtils.assertEvent(token, {event: "Transfer", logIndex: 0, args:{_from: '0x0000000000000000000000000000000000000000', _to: company.address}})
                .then((log) => { })
                .catch((err) => { assert(false, err); })
            );
        expect(await token.ownerOf(1000)).to.equal(company.address);
    })

    it(' should be able to transfer tokens', async () => {
        await company.sendSmartLicenseToken(account1, 1000);
            
        expect(await token.ownerOf(1000)).to.equal(account1);
    })

    it(' should be able to allow user to checkout license', async () => {

    })

    it(' should be able to check in license', async () => {
        
    })

    it(' should be able to check if user has valid license checked out', async () => {
        
    })
});