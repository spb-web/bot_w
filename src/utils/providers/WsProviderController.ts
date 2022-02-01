import { WebSocketProvider } from '@ethersproject/providers'
import EventEmitter from 'events'
import { wsRpcUrl } from '../../config/constants/rpcNode'

export class WsProviderController extends EventEmitter {
  public readonly expectedPongBack = 5000
  public readonly checkInterval = 5000

  public wsProvider: WebSocketProvider|null = null
  private connectPromise: Promise<WebSocketProvider>|null = null
  private url:string

  public get isConnected() {
    return this.wsProvider !== null
  }

  constructor(url:string) {
    super()

    this.url = url
  }

  public getWsProvider():WebSocketProvider {
    if (!this.wsProvider) {
      throw new Error('[WsProviderController.connect]: wsProvider is null');
    }

    return this.wsProvider
  }

  public waitWsConnect():Promise<WebSocketProvider> {
    return new Promise((resolve) => {
      if (this.isConnected) {
        resolve(this.getWsProvider())
      } else {
        this.once('connected', (wsProvider) => {
          resolve(wsProvider)
        })
      }
    })
  }

  public connect():Promise<WebSocketProvider> {
    console.debug('[WsProviderController.connect]: call')

    if (this.connectPromise) {
      return this.connectPromise
    }

    if (this.isConnected) {
      throw new Error('[WsProviderController.connect]: Alredy connected')
    } 
  
    const connectPromise = new Promise<WebSocketProvider>((resolve) => {
      if (this.wsProvider) {
        return resolve(this.wsProvider)
      } else {
        const provider = new WebSocketProvider(this.url)
        let pingTimeout: NodeJS.Timeout | null = null
        let keepAliveInterval: NodeJS.Timeout | null = null
  
        provider._websocket.on('open', () => {
          keepAliveInterval = setInterval(() => {
            provider._websocket.ping()
      
            // Use `WebSocket#terminate()`, which immediately destroys the connection,
            // instead of `WebSocket#close()`, which waits for the close timer.
            // Delay should be equal to the interval at which your server
            // sends out pings plus a conservative assumption of the latency.
            pingTimeout = setTimeout(() => {
              provider._websocket.terminate()
            }, this.expectedPongBack)
          }, this.checkInterval)
  
          this.wsProvider = provider
  
          resolve(this.wsProvider)
        })
  
        provider._websocket.once('close', (err: any) => {
          if (keepAliveInterval) {
            clearInterval(keepAliveInterval)
          }
  
          if (pingTimeout) {
            clearTimeout(pingTimeout)
          }

          this.wsProvider = null

          this.emit('disconnected', err)
          provider._websocket.removeAllListeners()
  
          this.connect()
        })
      
        provider._websocket.on('pong', () => {
          if (pingTimeout) {
            clearInterval(pingTimeout)
          }
        })
      }
    })

    this.connectPromise = connectPromise.then(
      (wsProvider) => {
        this.connectPromise = null

        this.emit('connected', wsProvider)

        return wsProvider
      },
      (error) => {
        this.connectPromise = null

        this.emit('error', error)
        
        throw error
      }
    )

    return this.connectPromise
  }
}

export const wsProviderController = new WsProviderController(wsRpcUrl)
