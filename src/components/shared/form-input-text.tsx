import { Eye, EyeClosed, LucideIcon } from 'lucide-react'
import { useState, MouseEvent } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '../../lib/utils/clsx'

interface FormInputTextProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type?: React.HTMLInputTypeAttribute | undefined
  icon?: LucideIcon
  placeholder?: string | undefined
  classNames?: ClassNameValue
}
const FormInputText = <T extends FieldValues>({
  control,
  name,
  label,
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
        <div className={cn('form-control', classNames ?? '')}>
          <label className="input input-bordered flex items-center gap-2">
            {Icon && <Icon className="size-5 text-base-content/40" />}
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
      )}
    />
  )
}

export default FormInputText
