import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { utils } from 'mocha';
var customUtils = require("./customUtils.js");
chai.use(chaiAsPromised)
const { expect, assert } = chai

var Company = artifacts.require("Company");
var SmartProductLicense = artifacts.require("SmartProductLicense");
var SmartProductClient = artifacts.require("SmartProductClient");

contract('Testing SmartProductClient contract', function(accounts) {

    let company;
    let token;
    let client;
    const name="SmartProductLicenseToken";
    const symbol="SLT";
    const account1 = accounts[1]

    const account2 = accounts[2]

    const account3 = accounts[3]

    it(' should be able to deploy SmartProductClient', async () => {
        token = await SmartProductLicense.new(name, symbol);
        company = await Company.new(token.address, "companyuri");
        client = await SmartProductClient.new(token.address, "SmartProductClient")
        expect(await client.getClientUri()).to.equal("SmartProductClient");
    })

    it(' should be able to receive tokens', async () => {
        let result = await token.mintUniqueTokenTo(client.address, 1000, "tokenuri", {from: accounts[0]});
        expect(await token.ownerOf(1000)).to.equal(client.address);
    })

    it(' should be able to transfer tokens', async () => {
        await client.sendSmartLicenseToken(company.address, 1000);
        expect(await token.ownerOf(1000)).to.equal(company.address);
    })

    it(' should be able to allow user to checkout license', async () => {

    })

    it(' should be able to check in license', async () => {
        
    })

    it(' should be able to check if user has valid license checked out', async () => {
        
    })
});