import { useCallback, useEffect, useState } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { Address, formatUnits } from 'viem'
import { Pid } from '@/utils'
import { stakeAbi } from '@/abis/stake'
import { StakeContractAddress } from '@/utils/env'
import { addMetaNodeToMetaMask } from '@/utils/metamask'

export type RewardsData = {
  pendingReward: string
  stakedAmount: string
  lastUpdate: number
}

type UserData = [bigint, bigint, bigint] // [stAmount, finishedMetaNode, pendingMetaNode]

const useRewards = () => {
  const { address, isConnected } = useAccount()
  const [rewardsData, setRewardsData] = useState<RewardsData>({
    pendingReward: '0',
    stakedAmount: '0',
    lastUpdate: 0,
  })

  const { data: metaNodeAddress } = useReadContract({
    address: StakeContractAddress,
    abi: stakeAbi,
    functionName: 'MetaNode',
    query: {
      enabled: !!StakeContractAddress,
    },
  })

  const {
    data,
    isLoading,
    refetch: fetchRewardsData,
  } = useReadContracts({
    contracts: [
      {
        address: StakeContractAddress,
        abi: stakeAbi,
        functionName: 'stakingBalance',
        args: [BigInt(Pid), address as Address],
      },
      {
        address: StakeContractAddress,
        abi: stakeAbi,
        functionName: 'pendingMetaNode',
        args: [BigInt(Pid), address as Address],
      },
    ],
    query: {
      enabled: !!StakeContractAddress && isConnected,
    },
  })
  const stakingBalance = data?.[0].result as bigint | undefined
  const pendingMetaNode = data?.[1].result as bigint | undefined

  useEffect(() => {
    if (stakingBalance !== undefined && pendingMetaNode !== undefined) {
      const pendingReward = formatUnits(pendingMetaNode, 18)
      const stakedAmount = formatUnits(stakingBalance, 18)
      setRewardsData({
        pendingReward,
        stakedAmount,
        lastUpdate: Date.now(),
      })
    }
  }, [stakingBalance, pendingMetaNode])

  // 定期刷新数据（每60秒）
  useEffect(() => {
    if (!isConnected || !address) return

    const interval = setInterval(() => {
      fetchRewardsData()
    }, 60000) // 60秒

    return () => clearInterval(interval)
  }, [isConnected, address, fetchRewardsData])

  // 手动刷新
  const refresh = useCallback(() => {
    fetchRewardsData()
  }, [fetchRewardsData])

  // 添加MetaNode代币到MetaMask
  const addMetaNodeToWallet = useCallback(async () => {
    if (!metaNodeAddress) {
      console.error('MetaNode地址未获取到')
      return false
    }

    try {
      return await addMetaNodeToMetaMask(metaNodeAddress)
    } catch (error) {
      console.error('添加MetaNode到钱包失败:', error)
      return false
    }
  }, [metaNodeAddress])

  return {
    rewardsData,
    loading: isLoading,
    metaNodeAddress,
    refresh,
    addMetaNodeToWallet,
    canClaim: parseFloat(rewardsData.pendingReward) > 0,
  }
}

export default useRewards
