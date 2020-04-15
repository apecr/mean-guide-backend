/* global describe, it */
const { expect } = require('chai')
const { normalizePort } = require('./../../src/utils')

describe('utils.js file', () => {
  it('Should get the normal port', () => {
    const port = normalizePort(12)
    expect(port).to.be.equal(12)
  })
  it('Should get the normal port from negative number', () => {
    const port = normalizePort(-12)
    expect(port).to.be.equal(false)
  })
  it('Should get the normal port from string', () => {
    const port = normalizePort('12')
    expect(port).to.be.equal(12)
  })
})