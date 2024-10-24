const t = require('node:test')
const a = require('node:assert')

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

t.test('requires a function or object', t => {
  a.throws(() => {
    promisify('string')
  }, TypeError)
})

t.test('promisify object', async t => {
  t.test('non function attribute', t => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    a.equal(promisified.attr, 'test')
  })

  await t.test('custom promisify', async t => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const promisifiedCustom = await promisified.custom('test one', 'test two')
    a.deepEqual(promisifiedCustom, ['test', 'test one', 'test two'])
    const instanceCustom = await new Promise(resolve => {
      instance.custom('test three', 'test four', (err, a, b, c) => { resolve([err, a, b, c]) })
    })
    a.deepEqual(instanceCustom, [null, 'test', 'test three', 'test four'])
  })

  await t.test('callback success', async t => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    const single = await promisified.single('test single')
    a.deepEqual(single, ['test', 'test single'])
  })

  await t.test('callback error', async t => {
    const instance = new Fixture('test')
    const promisified = promisify(instance)
    await a.rejects(() => promisified.error('test error'), Error, 'test error')
  })
})

t.test('promisify function', async t => {
  await t.test('promisifies a function', async t => {
    const fn = (a, cb) => cb(null, a)
    const promisified = promisify(fn)
    const result = await promisified('test')
    a.equal(result, 'test')
  })

  await t.test('assumes error first callback', async t => {
    const fn = (a, cb) => cb(new Error('test error'), a)
    const promisified = promisify(fn)
    await a.rejects(() => promisified('test'), Error, 'test error')
  })
})
