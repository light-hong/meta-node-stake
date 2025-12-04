import { Input, type InputProps } from '@headlessui/react'
import React, { forwardRef } from 'react'

// 组件 Props 类型定义
interface SuffixInputProps extends InputProps {
  suffix?: React.ReactNode // 后缀内容，可以是字符串、图标或任何 React 节点
  suffixClassName?: string // 后缀容器样式
  containerClassName?: string // 外层容器样式
  showSuffixOnFocus?: boolean // 是否只在聚焦时显示后缀
  suffixPosition?: 'inside' | 'outside' // 后缀位置：输入框内/外
}

/**
 * 带后缀的 Input 组件
 */
export const SuffixInput = forwardRef<HTMLInputElement, SuffixInputProps>(
  (
    {
      suffix,
      suffixClassName = '',
      containerClassName = '',
      showSuffixOnFocus = false,
      suffixPosition = 'inside',
      className = '',
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    // 判断是否应该显示后缀
    const shouldShowSuffix =
      !showSuffixOnFocus || (showSuffixOnFocus && isFocused)

    // 基础样式
    const baseInputClasses = `
      w-full px-3 py-2
      bg-white dark:bg-gray-800
      border border-gray-300 dark:border-gray-600
      rounded-md
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-500 dark:placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-all duration-200
    `

    // 后缀容器样式
    const suffixContainerClasses = `
      flex items-center justify-center
      text-gray-500 dark:text-gray-400
      ${suffixClassName}
    `

    if (suffixPosition === 'outside') {
      return (
        <div className={`flex items-center ${containerClassName}`}>
          <div className="relative flex-1">
            <Input
              ref={ref}
              className={`${baseInputClasses} ${className}`}
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
          </div>

          {suffix && shouldShowSuffix && (
            <div className={`ml-2 ${suffixContainerClasses}`}>{suffix}</div>
          )}
        </div>
      )
    }

    // 默认内部后缀
    return (
      <div className={`relative ${containerClassName}`}>
        <Input
          ref={ref}
          className={`${baseInputClasses} pr-10 ${className}`}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {suffix && shouldShowSuffix && (
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${suffixContainerClasses}`}
          >
            {suffix}
          </div>
        )}
      </div>
    )
  },
)

SuffixInput.displayName = 'SuffixInput'
