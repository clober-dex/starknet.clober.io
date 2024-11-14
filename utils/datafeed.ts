import {
  DatafeedConfiguration,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from '../public/static/charting_library'
import { Currency } from '../model/currency'

import { SUPPORTED_INTERVALS } from './chart'

const configurationData: Partial<DatafeedConfiguration> &
  Required<
    Pick<
      DatafeedConfiguration,
      'supported_resolutions' | 'exchanges' | 'symbols_types'
    >
  > = {
  supported_resolutions: SUPPORTED_INTERVALS.map(
    (interval) => interval[0],
  ) as ResolutionString[],
  exchanges: [
    {
      value: 'Clober',
      name: 'Clober',
      desc: 'Clober',
    },
  ],
  symbols_types: [
    {
      name: 'crypto',
      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'crypto',
    },
  ],
}

export default class DataFeed implements IBasicDataFeed {
  private chainNetwork: string
  private baseCurrency: Currency
  private quoteCurrency: Currency

  constructor(
    chainNetwork: string,
    baseCurrency: Currency,
    quoteCurrency: Currency,
  ) {
    this.chainNetwork = chainNetwork
    this.baseCurrency = baseCurrency
    this.quoteCurrency = quoteCurrency
  }

  onReady(callback: OnReadyCallback) {
    console.log('[onReady]: Method call')
    setTimeout(() => callback(configurationData))
  }

  async searchSymbols(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userInput: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exchange: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbolType: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResult: SearchSymbolsCallback,
  ) {
    console.log('[searchSymbols]: Method call')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resolveSymbol(symbolName: string, onResolve: ResolveCallback) {
    console.log('[resolveSymbol]: Method call', symbolName)
  }

  async getBars(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbolInfo: LibrarySymbolInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolution: ResolutionString,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    periodParams: PeriodParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResult: HistoryCallback,
  ) {}

  subscribeBars(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    symbolInfo: LibrarySymbolInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolution: ResolutionString,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTick: SubscribeBarsCallback,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    listenerGuid: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResetCacheNeededCallback: () => void,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsubscribeBars(listenerGuid: string) {}
}
