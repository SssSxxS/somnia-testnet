import { getDefaultHeaders, type FetchOptions } from '@/lib/defaultFetch'
import { logger } from '@/lib/logger'
import { getRandomInt, parseProxy, shuffleArray } from '@/lib/utils'
import { getWalletsData } from '@/modules/xlsx'
import { FAUCET_ATTEMPTS, FAUCET_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '@data/config'
import { HttpsProxyAgent } from 'https-proxy-agent'

export const cmdGetSttFromFaucet = async () => {
  try {
    let wallets = await getWalletsData()
    wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON')
    if (SHUFFLE_WALLETS) wallets = shuffleArray(wallets)
    logger.info(`[GOT ${wallets.length} WALLETS]`)

    for (const wallet of wallets) {
      try {
        const url = 'https://testnet.somnia.network/api/faucet'

        let fetchOptions: FetchOptions = {
          method: 'POST',
          headers: getDefaultHeaders('https://testnet.somnia.network'),
          body: JSON.stringify({ address: wallet.address }),
        }

        if (wallet.proxy) {
          const proxy = parseProxy(wallet.proxy)
          const agent = new HttpsProxyAgent(`http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`)
          fetchOptions = {
            ...fetchOptions,
            agent,
          }
        }
        logger.debug(`(${wallet.id}) Fetch options:%o`, fetchOptions)
        for (let i = 0; i < FAUCET_ATTEMPTS; i++) {
          const response = await fetch(url, fetchOptions)
          logger.info(`(${wallet.id}) Sent request to faucet${wallet.proxy ? ` through ${wallet.proxy} proxy` : ''}`)
          const responseData = await response.json()
          if (!response.ok) {
            logger.warn(
              `(${wallet.id}) Response is not ok: ${response.status} ${response.statusText}\n%o`,
              responseData
            )
            logger.info(`(${wallet.id}) Retrying...`)
            await Bun.sleep(3000)
            continue
          } else {
            const link = `${SOMNIA_TESTNET_EXPLORER_URL}/tx/${responseData.data.hash}}`
            logger.success(`(${wallet.id}) Tokens should be received ${link}`)
            break
          }
        }

        if (wallet == wallets[wallets.length - 1]) break
        const delay = getRandomInt(FAUCET_SLEEP_RANGE[0], FAUCET_SLEEP_RANGE[1])
        logger.info(`Sleeping for ${delay} seconds`)
        await Bun.sleep(delay * 1000)
      } catch (err) {
        logger.error('', err)
      }
    }
  } catch (err) {
    logger.error('', err)
  }
}
