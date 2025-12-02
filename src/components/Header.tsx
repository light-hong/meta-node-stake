'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  showConnectButton?: boolean
}

const Header = ({ showConnectButton = true }: HeaderProps) => {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-black border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <Link
          href="/"
          className="text-xl font-bold text-blue-500 hover:text-blue-600 no-underline"
        >
          Wallet Connect
        </Link>
      </div>

      <nav className="flex gap-8 items-center">
        <Link
          href="/wagmi"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/wagmi'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Wagmi
        </Link>
        <Link
          href="/viem"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/viem'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Viem
        </Link>
        <Link
          href="/ethers"
          className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
            pathname === '/ethers'
              ? 'text-blue-500 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Ethers
        </Link>
      </nav>

      <div className="flex items-center w-[400px]">
        {showConnectButton && <ConnectButton />}
      </div>
    </div>
  )
}

export default Header
