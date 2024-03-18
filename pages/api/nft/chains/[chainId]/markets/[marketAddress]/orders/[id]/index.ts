import { NextApiRequest, NextApiResponse } from 'next'

import { fetchMarketV1s } from '../../../../../../../../../apis/market-v1'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const query = req.query
  const { id, chainId, marketAddress } = query
  const markets = await fetchMarketV1s(Number(chainId))
  const market = markets.find(
    (m) => m.address.toLowerCase() === String(marketAddress).toLowerCase(),
  )
  res.json({
    id,
    name: `Order #${id} on Clober Market ${market?.baseToken.symbol ?? '?'}/${
      market?.quoteToken.symbol ?? '?'
    }`,
    description: 'Clober Market Order',
    image: `https://clober.io/api/nft/chains/${chainId}/markets/${marketAddress}/orders/${id}/image`,
  })
}