interface FormInputProps {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  prefix?: string
}

export default function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  prefix,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          className={`w-full rounded-lg border-white/20 bg-white/5 ${
            prefix ? 'pl-8 pr-4' : 'px-4'
          } py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-shadow`}
          id={id}
          name={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      </div>
    </div>
  )
}
