import { targetToken } from "./projects"

export const isTargetToken = (address:string) => targetToken.address.toLowerCase() === address.toLowerCase()
