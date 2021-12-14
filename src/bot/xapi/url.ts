import config from './config.ts'

// wss://ws.xtb.com/demo
// wss://ws.xtb.com/demoStream
// wss://ws.xtb.com/real
// wss://ws.xtb.com/realStream

const url = 'wss://ws.xtb.com/' + config.type

export default url
