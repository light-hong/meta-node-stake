import clsx from 'clsx'
import { ReactNode } from 'react'
import { Button as HeadlessUiButton } from '@headlessui/react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  rounded = 'md',
  icon,
  iconPosition = 'left',
}: ButtonProps) => {
  const isDisabled = disabled || loading

  // 基础样式
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  // 圆角样式
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // 变体样式
  const variantStyles = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-blue-500',
  }

  // 宽度样式
  const widthStyle = fullWidth ? 'w-full' : ''

  // 图标和文本之间的间距
  const iconSpacing = icon ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''

  const buttonClasses = clsx(
    baseStyles,
    roundedStyles[rounded],
    sizeStyles[size],
    variantStyles[variant],
    widthStyle,
    isDisabled && 'opacity-50 cursor-not-allowed',
    className,
  )

  return (
    <HeadlessUiButton
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className={buttonClasses}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={clsx('flex items-center', iconSpacing)}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={clsx('flex items-center', iconSpacing)}>
              {icon}
            </span>
          )}
        </>
      )}
    </HeadlessUiButton>
  )
}
