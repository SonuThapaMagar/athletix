type AuthButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

const AuthButton = ({ loading, className = '', children, ...rest }: AuthButtonProps) => {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`h-11 w-full rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default AuthButton




