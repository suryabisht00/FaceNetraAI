interface AlertProps {
  type: 'error' | 'success'
  message: string
}

export default function Alert({ type, message }: AlertProps) {
  const styles = {
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
  }

  return (
    <div className={`${styles[type]} border rounded-lg p-3 text-sm`}>
      {message}
    </div>
  )
}
