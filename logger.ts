import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'HMPPS Community Payback Supervisors Ui',
  stream: formatOut,
  level: config.logLevel as bunyan.LogLevel,
})

export default logger
