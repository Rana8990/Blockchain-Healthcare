/* global artifacts, contract, it, assert, before */

const web3 = require('web3');
const { assert } = require('chai');
const Healthcare = artifacts.require("./Healthcare.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Healthcare', (accounts) => {
    let healthcare 

    before(async () => {
        healthcare = await Healthcare.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await healthcare.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await healthcare.name()
            console.log('Actual name:', name);
            assert.equal(name, 'Healthcare name test')
        })

    })

    describe('reports', async () => {
        let result, reportCount
    
        before(async () => {
          result = await healthcare.createReport('Urine R/M/E', 'Straw', 'Nill', 'plenty', '5-7/HPF')
          reportCount = await healthcare.reportCount()
        })

        it('creates reports', async () => {
            //SUCCESS
            assert.equal(reportCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), reportCount.toNumber(), 'Id is correct')
            assert.equal(event.test_name, 'Urine R/M/E', 'Test name is correct')
            assert.equal(event.color, 'Straw', 'color is correct')
            assert.equal(event.sugar, 'Nill', 'sugar is correct')
            assert.equal(event.pus_cells, 'plenty', 'pus_cell is correct')
            assert.equal(event.epithelial_cells, '5-7/HPF', 'epitheilial_cells is correct')

            // FAILURE: Report must have a name
            await await healthcare.createReport('', 'Straw', 'Nill', 'plenty', '5-7/HPF').should.be.rejected;

            

            
        })
    })
})