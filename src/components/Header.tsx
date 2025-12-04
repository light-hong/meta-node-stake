'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiZap } from 'react-icons/fi'
import { useState } from 'react'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const Links = [
    {
      name: 'Stake',
      path: '/stake',
    },
    {
      name: 'Withdrawal',
      path: '/withdraw',
    },
  ]
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-[#020C24] border-b-[#163159] border-b w-full"
    >
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center px-3 py-4 md:px-7">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:space-x-2 text-center md:text-left"
        >
          <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 animate-pulse mb-1 md:mb-0" />
          <Link
            href="/"
            className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-tight"
          >
            <span className="block md:inline">MetaNode</span>
            <span className="block md:inline"> Stake</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {Links.map((link) => {
            const isActive =
              pathname === link.path || pathname === link.path + '/'
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-4 py-2 no-underline font-medium rounded-md transition-all ${
                  isActive
                    ? 'text-primary-500 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
          <div className="relative min-w-[100px] sm:min-w-[120px]">
            <ConnectButton
              chainStatus="none"
              showBalance={{ largeScreen: true, smallScreen: false }}
            />
          </div>
          <button
            className="md:hidden p-1.5 sm:p-2 ml-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-primary-400 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-3 sm:px-4 py-2 space-y-1 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800">
          {Links.map((link) => {
            const isActive =
              pathname === link.path || pathname === link.path + '/'
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`block px-3 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-primary-400'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header
