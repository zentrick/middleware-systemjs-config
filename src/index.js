import npmDependenciesToSystemConfig from 'npm-dependencies-to-system-config'
import url from 'url'

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
    const useJs = (url.parse(req.url, true).query.mode === 'js')

    npmDependenciesToSystemConfig(pkgRoot, npmDependenciesToSystemConfigOptions)
      .then((config) => {
        for (const pkg of Object.keys(config.packages).map((key) => config.packages[key])) {
          pkg.defaultExtension = false
        }

        const json = JSON.stringify(config)
        const [mimeType, body] = useJs
          ? ['application/javascript', `System.config(${json})`]
          : ['application/json', json]

        res.writeHead(200, {'Content-Type': mimeType})
        res.end(body)
      })
      .catch(next)
  }
}
