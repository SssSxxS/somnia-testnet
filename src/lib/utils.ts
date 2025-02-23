export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/* -------------------------------------------------------------------------- */

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

/* -------------------------------------------------------------------------- */

export interface ProxyConfig {
  ip: string
  port: string
  username: string
  password: string
}

export const parseProxy = (proxyString: string): ProxyConfig => {
  const [ip, port, username, password] = proxyString.split(':')

  if (!ip || !port || !username || !password) {
    throw new Error('Invalid proxy string format. Expected format: ip:port:username:password')
  }

  return { ip, port, username, password }
}

/* -------------------------------------------------------------------------- */
