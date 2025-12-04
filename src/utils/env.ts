import { Address, zeroAddress } from 'viem'

export const StakeContractAddress =
  (process.env.NEXT_PUBLIC_STAKE_CONTRACT_ADDRESS as Address) || zeroAddress
