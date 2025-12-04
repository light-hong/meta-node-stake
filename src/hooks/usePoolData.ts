import { useEffect, useState, useCallback } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { Pid as DefaultPid } from '@/utils'
import { StakeContractAddress } from '@/utils/env'
import { stakeAbi } from '@/abis/stake'

type PoolData = [string, bigint, bigint, bigint, bigint, bigint, bigint] // [stTokenAddress, poolWeight, lastRewardBlock, accMetaNodePerST, stTokenAmount, minDepositAmount, unstakeLockedBlocks]

export function usePoolData() {
  const { isConnected } = useAccount()
  const [poolData, setPoolData] = useState<Record<string, string>>({
    poolWeight: '0',
    lastRewardBlock: '0',
    accMetaNodePerShare: '0',
  })

  const {
    data: pool,
    status,
    refetch,
  } = useReadContract({
    abi: stakeAbi,
    address: StakeContractAddress,
    functionName: 'pool',
    args: [BigInt(DefaultPid)],
    query: {
      enabled: isConnected && !!StakeContractAddress,
    },
  })

  useEffect(() => {
    if (Array.isArray(pool)) {
      setPoolData({
        poolWeight: formatUnits((pool[1] as bigint) || BigInt(0), 18),
        lastRewardBlock: formatUnits((pool[2] as bigint) || BigInt(0), 18),
        accMetaNodePerShare: formatUnits((pool[3] as bigint) || BigInt(0), 18),
        stTokenAmount: formatUnits((pool[4] as bigint) || BigInt(0), 18),
        minDepositAmount: formatUnits((pool[5] as bigint) || BigInt(0), 18),
        unstakeLockedBlocks: formatUnits((pool[6] as bigint) || BigInt(0), 18),
        stTokenAddress: pool[0] as string,
      })
    }
  }, [pool])

  // 定期刷新数据（每60秒）
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      refetch()
    }, 60000) // 60秒

    return () => clearInterval(interval)
  }, [isConnected, refetch])

  // 手动刷新
  const refetchPool = useCallback(() => {
    refetch()
  }, [refetch])

  return {
    poolData,
    refetchPool,
  }
}
