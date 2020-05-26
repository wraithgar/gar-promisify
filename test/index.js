'use strict'

const lab = (exports.lab = require('@hapi/lab').script())
const { describe, it } = lab
const { expect } = require('@hapi/code')

const promisify = require('../')

class Fixture {
  constructor (attr) {
    this.attr = attr
  }

  single (input, cb) {
    cb(null, input)
  }

  error (input, cb) {
    cb(new Error(input))
  }
}
describe('main module', () => {
  it('non function attribute', () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    expect(promisified.attr).to.equal('test')
  })

  it('callback success', async () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const single = await promisified.single('test single')
    expect(single).to.equal('test single')
  })

  it('callback success', async () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const rejects = function () {
      return promisified.error('test error')
    }
    expect(rejects()).to.reject(Error, 'test error')
  })
})
