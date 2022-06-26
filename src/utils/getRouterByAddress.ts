import { routes } from '../projects'
import memoizeOne from 'memoize-one'

export const getRouterByAddress = memoizeOne((address?:string) => {
  if (!address) {
    throw new Error(`[getRouterByAddress]: not found route by address ${JSON.stringify(address)}`);
  }

  const foundRoute = Object.values(routes).find((route) => route.address === address)

  if (!foundRoute) {
    throw new Error(`[getRouterByAddress]: not found route by address ${JSON.stringify(address)}`);
  }

  return foundRoute
})
