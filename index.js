'use strict'

const handler = {
  get: function (target, prop, receiver) {
    if (typeof target[prop] !== 'function') {
      return target[prop]
    }
    return function () {
      return new Promise((resolve, reject) => {
        Reflect.get(target, prop, receiver).apply(target, [...arguments, function (err, result) {
          if (err) {
            return reject(err)
          }
          resolve(result)
        }])
      })
    }
  }
}

module.exports = function (thingToPromisify) {
  return new Proxy(thingToPromisify, handler)
}
