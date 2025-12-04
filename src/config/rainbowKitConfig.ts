'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'wallect-connect',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
    // [sepolia.id]: http(
    //   'https://sepolia.infura.io/v3/d8ed0bd1de8242d998a1405b6932ab33',
    // ),
  },
  ssr: true,
})

export default config
