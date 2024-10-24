const { spec: reporter } = require('node:test/reporters')
const { run } = require('node:test')
const path = require('node:path')

run({
  files: [path.resolve('./tests')],
  coverage: true,
  lineCoverage: 100,
  branchCoverage: 100,
  functionCoverage: 100
})
  .on('test:fail', () => {
    process.exitCode = 1
  })
  .compose(reporter)
  .pipe(process.stdout)
