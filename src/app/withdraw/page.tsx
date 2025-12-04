'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { Address, formatUnits, parseUnits } from 'viem'
import { Pid } from '@/utils'
import { StakeContractAddress } from '@/utils/env'
import { stakeAbi } from '@/abis/stake'
import { SuffixInput } from '@/components/ui/SuffixInput'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { FiAlertCircle, FiArrowUp, FiClock } from 'react-icons/fi'
import { Description, Field, Label } from '@headlessui/react'

export type UserStakeData = {
  staked: string
  withdrawable: string
  withdrawPending: string
}

const InitData: UserStakeData = {
  staked: '0',
  withdrawable: '0',
  withdrawPending: '0',
}

type WithdrawAmountData = [bigint, bigint] // [requestAmount, pendingWithdrawAmount]
export default function WithDrawHome() {
  const { address, isConnected } = useAccount()
  const [amount, setAmount] = useState('')
  const [userData, setUserData] = useState<UserStakeData>(InitData)

  const isWithdrawable = useMemo(
    () => Number(userData.withdrawable) > 0 && isConnected,
    [userData, isConnected],
  )

  const { data, refetch: fetchwithDrawData } = useReadContracts({
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
        functionName: 'withdrawAmount',
        args: [BigInt(Pid), address as Address],
      },
    ],
    query: {
      enabled: !!StakeContractAddress && isConnected && !!address,
    },
  })
  useEffect(() => {
    if (!data) return
    const staked = data?.[0].result as bigint | undefined
    const list = data?.[1].result as WithdrawAmountData
    const ava = Number(formatUnits(list[1], 18))
    const total = Number(formatUnits(list[0], 18))
    if (staked !== undefined && ava !== undefined && total !== undefined) {
      // console.log(staked, ava, total)
      setUserData({
        staked: formatUnits(staked as bigint, 18),
        withdrawPending: (total - ava).toFixed(4),
        withdrawable: ava.toFixed(4),
      })
    }
  }, [data])

  const {
    data: unstakeHash,
    writeContract: writeUnstake,
    isPending: isUnstake,
  } = useWriteContract()
  const { isSuccess: unstakeConfirmed } = useWaitForTransactionReceipt({
    hash: unstakeHash,
    query: {
      enabled: !!unstakeHash,
    },
  })
  const handleUnstake = async () => {
    try {
      writeUnstake(
        {
          abi: stakeAbi,
          address: StakeContractAddress,
          functionName: 'unstake',
          args: [BigInt(Pid), parseUnits(amount, 18)],
        },
        {
          onSuccess(data) {
            console.log('Success:', data)
            setAmount('0')
            toast.success('unstake successful!')
          },
          onError(error) {
            console.log('Error:', error)
            toast.error('unstake failed!')
          },
        },
      )
    } catch (error) {
      toast.error('Unstake failed. Please try again.')
      console.log(error, 'claim-error')
    }
  }

  useEffect(() => {
    if (unstakeConfirmed) {
      fetchwithDrawData()
    }
  }, [unstakeConfirmed, fetchwithDrawData])

  const {
    data: withdrawHash,
    writeContract: writeWithdraw,
    isPending: isWithdraw,
  } = useWriteContract()
  const { isSuccess: withdrawConfirmed } = useWaitForTransactionReceipt({
    hash: withdrawHash,
    query: {
      enabled: !!withdrawHash,
    },
  })
  const handleWithdraw = async () => {
    try {
      writeWithdraw(
        {
          abi: stakeAbi,
          address: StakeContractAddress,
          functionName: 'withdraw',
          args: [BigInt(Pid)],
        },
        {
          onSuccess(data) {
            console.log('Success:', data)
            toast.success('Withdraw successful!')
          },
          onError(error) {
            console.log('Error:', error)
            toast.error('Withdraw failed!')
          },
        },
      )
    } catch (error) {
      toast.error('Withdraw failed. Please try again.')
      console.log(error, 'claim-error')
    }
  }
  useEffect(() => {
    if (withdrawConfirmed) {
      fetchwithDrawData()
    }
  }, [withdrawConfirmed, fetchwithDrawData])

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
          Withdraw
        </h1>
        <p className="text-gray-400 text-xl">Unstake and withdraw your ETH</p>
      </div>
      <div className="min-h-[420px] p-4 sm:p-8 md:p-12 bg-transparent border-primary-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl hover:border-primary-500/60 transition-all duration-300">
        <div className="space-y-6 sm:space-y-8">
          <div className="mx-auto grid grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1 gap-6 text-left">
            <div className="bg-white rounded-xl px-5 py-5 flex flex-col gap-2">
              <div className="text-gray-400 text-xm">Staked Amount</div>
              <div className="text-primary-500 text-2xl font-bold">
                {userData.staked} ETH
              </div>
            </div>
            <div className="bg-white rounded-xl px-5 py-5 flex flex-col gap-2">
              <div className="text-gray-400 text-xm">Avaliable to Withdraw</div>
              <div className="text-primary-500 text-2xl font-bold">
                {userData.withdrawable} ETH
              </div>
            </div>
            <div className="bg-white rounded-xl px-5 py-5 flex flex-col gap-2">
              <div className="text-gray-400 text-xm">Pending Withdraw</div>
              <div className="text-primary-500 text-2xl font-bold">
                {userData.withdrawPending} ETH
              </div>
            </div>
          </div>
          <div>
            <Field>
              <Label className="text-xl font-bold text-white">Unstake</Label>
              <Description className="text-gray-400 text-xm mt-4 mb-3">
                Amount to Unstake
              </Description>
              <SuffixInput
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                suffix="ETH"
                className="text-lg sm:text-xl py-1 sm:py-2 pr-12"
              />
            </Field>
            <Button
              onClick={handleUnstake}
              disabled={!amount || isUnstake}
              loading={isUnstake}
              fullWidth
              className="mt-6 text-lg sm:text-xl py-3"
            >
              <FiArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
              <span>Unstake ETH</span>
            </Button>
          </div>
          <div>
            <Field>
              <Label className="text-xl font-bold text-white">Withdraw</Label>
              <div className="bg-white/85 rounded-xl px-5 py-5 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-gray-700 text-xm">Ready to Withdraw</div>
                  <div className="text-primary-500 text-2xl font-bold">
                    {userData.withdrawable} ETH
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock />
                  <span>20 min cooldown</span>
                </div>
              </div>
              <Description className="text-gray-400 text-xm my-4 flex items-center gap-1">
                <FiAlertCircle />
                <span>
                  After unstaking, you need to wait 20 minutes to withdraw.
                </span>
              </Description>
            </Field>
            <Button
              onClick={handleWithdraw}
              disabled={!isWithdrawable || isWithdraw}
              loading={isWithdraw}
              fullWidth
              className="mt-3 text-lg sm:text-xl py-3"
            >
              <FiArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
              <span>Withdraw ETH</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
