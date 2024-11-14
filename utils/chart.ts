import { ResolutionString } from '../public/static/charting_library'

enum CHART_LOG_INTERVALS {
  oneMinute = '1m',
  threeMinutes = '3m',
  fiveMinutes = '5m',
  tenMinutes = '10m',
  fifteenMinutes = '15m',
  thirtyMinutes = '30m',
  oneHour = '1h',
  twoHours = '2h',
  fourHours = '4h',
  sixHours = '6h',
  oneDay = '1d',
  oneWeek = '1w',
}

export const SUPPORTED_INTERVALS = [
  ['1', '1m'],
  ['3', '3m'],
  ['5', '5m'],
  ['15', '15m'],
  ['60', '1h'],
  ['240', '4h'],
  ['1D', '1d'],
  ['1W', '1w'],
] as [ResolutionString, CHART_LOG_INTERVALS][]
