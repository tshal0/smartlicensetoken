import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { utils } from 'mocha';
var customUtils = require("./customUtils.js");
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");
var SmartLicense = artifacts.require("SmartLicense");

contract('Testing Company contract', function(accounts) {

    let company;
    let token;
    const name="SmartLicenseToken";
    const symbol="SLT";
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy Company', async () => {
        token = await SmartLicense.new(name, symbol);
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

        var deployed = Company.deployed();

        let result = await token.mintUniqueTokenTo(company.address, 1000, "tokenuri", {from: accounts[0]})
            .then(() => customUtils.assertEvent(company, {event: "ReceivedERC721Token"}));
        expect(await token.ownerOf(1000)).to.equal(company.address);
    })

    it(' should be able to transfer tokens', async () => {
        await company.sendSmartLicenseToken(account1, 1000);
            
        expect(await token.ownerOf(1000)).to.equal(account1);
    })
});