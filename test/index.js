'use strict'

const lab = (exports.lab = require('@hapi/lab').script())
const { describe, it } = lab
const { expect } = require('@hapi/code')
const util = require('util')

const promisify = require('../')

class Fixture {
  constructor (attr) {
    this.attr = attr
    this.custom[util.promisify.custom] = function (input1, input2) {
      return Promise.resolve([this.attr, input1, input2])
    }
  }

  single (input, cb) {
    cb(null, [this.attr, input])
  }

  custom (input1, input2, cb) {
    cb(null, this.attr, input1, input2)
  }

  error (input, cb) {
    cb(new Error(input))
  }
}

it('requires a function or object', () => {
  const throws = () => {
    promisify('string')
  }
  expect(throws).to.throw(TypeError)
})

describe('promisify object', () => {
  it('non function attribute', () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    expect(promisified.attr).to.equal('test')
  })

  it('custom promisify', async () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const custom = await promisified.custom('test one', 'test two')
    expect(custom).to.equal(['test', 'test one', 'test two'])
  })

  it('callback success', async () => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const single = await promisified.single('test single')
    expect(single).to.equal(['test', 'test single'])
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

describe('promisify function', () => {
  it('promisifies a function', async () => {
    const fn = (a, cb) => cb(null, a)
    const promisified = promisify(fn)
    const result = await promisified('test')
    expect(result).to.equal('test')
  })

  it('assumes error first callback', async () => {
    const fn = (a, cb) => cb(new Error('test error'), a)
    const promisified = promisify(fn)
    const result = promisified('test')
    expect(result).to.reject('test error')
  })
})
