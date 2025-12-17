const Card = ({ className, ...props }) => (
  <div
    style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)'
    }}
    className={`rounded-lg border shadow-lg ${className}`}
    {...props}
  />
)

const CardHeader = ({ className, ...props }) => (
  <div style={{ borderColor: 'var(--border-color)' }} className={`flex flex-col space-y-1.5 p-6 border-b ${className}`} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3
    style={{ color: 'var(--text-primary)' }}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
)

const CardDescription = ({ className, ...props }) => (
  <p
    style={{ color: 'var(--text-secondary)' }}
    className={`text-sm ${className}`}
    {...props}
  />
)

const CardContent = ({ className, ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
