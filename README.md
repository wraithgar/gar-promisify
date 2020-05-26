# @gar/promisify

### Promisify an entire object or class instance

This module leverages es6 Proxy and Reflect to promisify every function in an
object or class instance.

It assumes the callback that the function is expecting is the last
parameter, and that it is an error-first callback with only one value,
i.e. `(err, value) => ...`. This mirrors node's util.proimisify method.

### Examples

```javascript

const promisify = require('@gar/promisify')

class Foo {
  constructor (attr) {
    this.attr = attr
  }

  double (input, cb) {
    cb(null, input * 2)
  }

const foo = new Foo('baz')
const promisified = promisify(foo)

console.log(promisified.attr)
console.log(await promisified.double(1024))
```
