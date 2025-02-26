import { logger } from '@/lib/logger'
import { defaultHeaders } from '@/lib/requests'
import { getRandomInt, parseProxy, shuffleArray } from '@/lib/utils'
import { getWalletsData } from '@/modules/xlsx'
import { FAUCET_ATTEMPTS, FAUCET_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '@data/config'
import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
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
        let config: AxiosRequestConfig = {
          headers: defaultHeaders,
        }

        if (wallet.proxy) {
          const proxy = parseProxy(wallet.proxy)
          const proxyUrl =
            proxy.username && proxy.password
              ? `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
              : `http://${proxy.host}:${proxy.port}`
          const agent = new HttpsProxyAgent(proxyUrl)
          config = {
            ...config,
            httpAgent: agent,
            httpsAgent: agent,
          }
        }

        for (let i = 0; i < FAUCET_ATTEMPTS; i++) {
          try {
            const response = await axios.post(url, { address: wallet.address }, config)
            logger.debug(`(${wallet.id}) Response data: %o`, response.data)
            let link = ''
            if (response.data?.data?.hash) link = `${SOMNIA_TESTNET_EXPLORER_URL}/tx/${response.data.data.hash}`
            logger.success(`(${wallet.id}) Tokens should be received ${link}`)
            break
          } catch (err) {
            if (err instanceof AxiosError) {
              logger.warn(`(${wallet.id}) Failed request: %o`, err.response?.data)
              if (i === FAUCET_ATTEMPTS - 1) break
              if (err.response?.data && JSON.stringify(err.response?.data).includes('Rate limit')) break
              logger.info(`Retrying in 3 seconds...`)
              await Bun.sleep(3000)
            } else {
              logger.error(`(${wallet.id}) Unexpected error: %o`, err)
            }
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
