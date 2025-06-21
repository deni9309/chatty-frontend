import { Eye, EyeClosed, LucideIcon } from 'lucide-react'
import { useState, MouseEvent } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../lib/utils/clsx'

interface FormInputTextProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  showLabel?: boolean
  type?: React.HTMLInputTypeAttribute | undefined
  icon?: LucideIcon
  placeholder?: string | undefined
  classNames?: ClassNameValue
}
const FormInputText = <T extends FieldValues>({
  control,
  name,
  label,
  showLabel = false,
  type,
  icon,
  placeholder,
  classNames,
}: FormInputTextProps<T>) => {
  const Icon = icon
  const [showPassword, setShowPassword] = useState(false)

  const onClickShowPassword = () => {
    if (name === ('password' as keyof Path<T>)) {
      setShowPassword((show) => !show)
    }
  }

  const onMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()

  const onMouseUpPassword = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="w-full flex">
          <div
            className={cn(
              'badge bg-base-content/10 rounded-e-none h-auto justify-start sm:ps-3',
              showLabel && 'w-full gap-x-1 max-w-[75px] sm:max-w-[120px]',
            )}
          >
            {Icon && (
              <div className="tooltip" data-tip={label}>
                <Icon className="size-5 text-base-content/50" />
              </div>
            )}
            {showLabel && (
              <span className="text-sm max-sm:text-xs text-base-content/70">{label}</span>
            )}
          </div>
          <div className={cn('form-control grow', classNames ?? '')}>
            <label className="input input-bordered rounded-s-none flex items-center gap-2">
              <input
                type={
                  name === ('password' as keyof Path<T>)
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type || 'text'
                }
                autoComplete="off"
                placeholder={placeholder || ''}
                className="grow"
                value={value || ''}
                onChange={onChange}
                title={label || ''}
                aria-label={label ?? name}
              />
              {name === ('password' as keyof Path<T>) && (
                <button
                  type="button"
                  onClick={onClickShowPassword}
                  onMouseDown={onMouseDownPassword}
                  onMouseUp={onMouseUpPassword}
                >
                  {showPassword ? (
                    <Eye className="size-5 text-base-content/40" aria-label="Password is visible" />
                  ) : (
                    <EyeClosed
                      className="size-5 text-base-content/40"
                      aria-label="Password is hidden"
                    />
                  )}
                </button>
              )}
            </label>
            {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
          </div>
        </div>
      )}
    />
  )
}

export default FormInputText
