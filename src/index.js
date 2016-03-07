import npmDependenciesToSystemConfig from 'npm-dependencies-to-system-config'

const DEFAULT_OPTIONS = {
  pkgRoot: process.cwd(),
  dev: false,
  concurrency: 10
}

export default (options) => {
  const npmDependenciesToSystemConfigOptions = Object.assign({}, DEFAULT_OPTIONS, options)
  const pkgRoot = npmDependenciesToSystemConfigOptions.pkgRoot
  delete npmDependenciesToSystemConfigOptions.pkgRoot

  return (req, res, next) => {
    npmDependenciesToSystemConfig(pkgRoot, npmDependenciesToSystemConfigOptions)
      .then((config) => {
        for (const pkg of Object.keys(config.packages).map((key) => config.packages[key])) {
          pkg.defaultExtension = false
        }

        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(config))
      })
      .catch(next)
  }
}
