'use client'
import { FiGithub, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="relative bg-main border-t border-[#163159]">
      <div className="px-3 py-7 md:px-7">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
          <div className="text-gray-400 text-xs sm:text-sm md:text-base">
            © {new Date().getFullYear()} MetaNode Stake. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
