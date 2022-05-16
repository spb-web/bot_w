export const bscscanLink = {
  txBscscan: (hash:string) => `https://bscscan.com/tx/${hash}`,
  accountBscscan: (address:string) => `https://bscscan.com/address/${address}`,
  accountDebank: (address:string) => `https://debank.com/profile/${address}`,
}
