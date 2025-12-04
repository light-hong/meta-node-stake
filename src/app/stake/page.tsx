'use client'
import { motion } from 'motion/react'
import { Description, Field } from '@headlessui/react'
import {
  FiArrowDown,
  FiGift,
  FiInfo,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { parseEther } from 'viem'
import { Pid } from '@/utils'
import { StakeContractAddress } from '@/utils/env'
import { stakeAbi } from '@/abis/stake'
import { usePoolData } from '@/hooks/usePoolData'
import { SuffixInput } from '@/components/ui/SuffixInput'
import { Button } from '@/components/ui/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { toast } from 'react-toastify'
import useRewards from '@/hooks/useRewards'

export default function StakeHome() {
  const {
    data: stakeHash,
    writeContract: writeStake,
    isPending: isStaking,
  } = useWriteContract()
  const { isSuccess: stakeConfirmed } = useWaitForTransactionReceipt({
    hash: stakeHash,
    query: {
      enabled: !!stakeHash,
    },
  })
  const { address, isConnected } = useAccount()
  const { poolData, refetchPool } = usePoolData()
  const {
    rewardsData,
    metaNodeAddress,
    refresh,
    addMetaNodeToWallet,
    canClaim,
  } = useRewards()

  const { data: balance } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    },
  })
  const [amount, setAmount] = useState('')

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > parseFloat(balance!.formatted)) {
      toast.error('Amount cannot be greater than current balance')
      return
    }

    try {
      writeStake(
        {
          abi: stakeAbi,
          address: StakeContractAddress,
          functionName: 'depositETH',
          value: parseEther(amount),
        },
        {
          onSuccess(data) {
            console.log('Success:', data)
            toast.success('Stake successful!')
            setAmount('')
          },
          onError(error) {
            console.log('Error:', error)
            toast.error('Stake failed!')
          },
        },
      )
    } catch (error) {
      toast.error('Transaction failed. Please try again.')
      console.log(error)
    }
  }
  useEffect(() => {
    if (stakeConfirmed) {
      refetchPool()
    }
  }, [stakeConfirmed, refetchPool])

  const {
    data: claimHash,
    writeContract: writeClaim,
    isPending: isClaim,
  } = useWriteContract()
  const { isSuccess: claimConfirmed } = useWaitForTransactionReceipt({
    hash: claimHash,
    query: {
      enabled: !!claimHash,
    },
  })
  const handleClaim = async () => {
    if (!StakeContractAddress) return

    try {
      writeClaim(
        {
          abi: stakeAbi,
          address: StakeContractAddress,
          functionName: 'claim',
          args: [BigInt(Pid)],
        },
        {
          onSuccess(data) {
            console.log('Success:', data)
            toast.success('Claim successful!')
          },
          onError(error) {
            console.log('Error:', error)
            toast.error('Claim failed!')
          },
        },
      )
    } catch (error) {
      toast.error('Transaction failed. Please try again.')
      console.log(error, 'claim-error')
    }
  }
  useEffect(() => {
    if (claimConfirmed) {
      refresh()
    }
  }, [claimConfirmed, refresh])

  return (
    <>
      <div className="text-center mb-6">
        <div className="inline-block mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-primary-500/20 flex items-center justify-center shadow-xl"
            style={{ boxShadow: '0 0 60px 0 rgba(14,165,233,0.15)' }}
          >
            <FiZap className="w-12 h-12 text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
          MetaNode Stake
        </h1>
        <p className="text-gray-400 text-xl">Stake ETH to earn tokens</p>
      </div>
      <div className="min-h-[420px] p-4 sm:p-8 md:p-12 bg-transparent border-primary-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl hover:border-primary-500/60 transition-all duration-300">
        <div className="space-y-8 sm:space-y-12">
          {/* Staked Amount Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-cardback rounded-xl hover:bg-cardback2 sm:rounded-2xl border border-gray-700/50">
            <div className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-primary-500/10 rounded-full">
              <FiTrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
              <span className="text-gray-400 text-base sm:text-lg mb-1">
                Staked Amount
              </span>
              <span className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-tight break-all">
                {parseFloat(poolData.stTokenAmount || '0').toFixed(4)} ETH
              </span>
            </div>
          </div>
          <Field className="space-y-2 sm:space-y-3">
            <Description className="text-sm/6 text-white/50">
              Amount to Stake
            </Description>
            <SuffixInput
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              suffix="ETH"
              className="text-lg sm:text-xl py-1 sm:py-2 pr-12"
            />
            {balance && (
              <Description className="text-sm/6 text-white/50">
                {`Available: ${parseFloat(balance.formatted).toFixed(4)} ETH`}
              </Description>
            )}
          </Field>
          <div>
            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectButton label="Connect Wallet" />
              </div>
            ) : (
              <Button
                onClick={handleStake}
                disabled={isStaking || !amount}
                loading={isStaking}
                fullWidth
                className="py-3 sm:py-5 text-lg sm:text-xl"
              >
                <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>Stake ETH</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 min-h-[420px] p-4 sm:p-8 md:p-12 bg-transparent border-primary-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl hover:border-primary-500/60 transition-all duration-300">
        <div className="space-y-8 sm:space-y-12">
          {/* Pending Reward Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-cardback rounded-xl hover:bg-cardback2 sm:rounded-2xl border border-gray-700/50">
            <div className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-green-500/10 rounded-full">
              <FiGift className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
              <span className="text-gray-400 text-base sm:text-lg mb-1">
                Pending Rewards
              </span>
              <span className="text-3xl sm:text-5xl font-bold bg-linear-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight break-all">
                {parseFloat(rewardsData.pendingReward).toFixed(4)} MetaNode
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <FiInfo className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">How rewards work:</p>
                  <ul className="space-y-1 text-xs">
                    <li>
                      • Rewards accumulate based on your staked amount and time
                    </li>
                    <li>• You can claim rewards anytime</li>
                    <li>• Rewards are paid in MetaNode tokens</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectButton label="Connect Wallet" />
              </div>
            ) : (
              <Button
                onClick={handleClaim}
                disabled={isClaim || !canClaim}
                loading={isClaim}
                fullWidth
                className="py-3 sm:py-5 text-lg sm:text-xl bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <FiGift className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>Claim Rewards</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
