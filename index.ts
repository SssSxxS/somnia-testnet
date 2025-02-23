import chalk from 'chalk'
import { main } from './src/main'

const art =
  chalk.blueBright(`
░█▀▀░█▀█░█▄█░█▀█░▀█▀░█▀█    
░▀▀█░█░█░█░█░█░█░░█░░█▀█    
░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀░▀    `) +
  chalk.magentaBright(`
░▀█▀░█▀▀░█▀▀░▀█▀░█▀█░█▀▀░▀█▀
░░█░░█▀▀░▀▀█░░█░░█░█░█▀▀░░█░
░░▀░░▀▀▀░▀▀▀░░▀░░▀░▀░▀▀▀░░▀░`) +
  chalk.whiteBright(`
https://t.me/yofomo
`)

console.log(art)

main()
