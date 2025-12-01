interface ToggleSwitchProps {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

export default function ToggleSwitch({ id, label, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <label className="text-sm font-medium text-gray-300" htmlFor={id}>
        {label}
      </label>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark ${
          checked ? 'bg-primary' : 'bg-primary/40'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
