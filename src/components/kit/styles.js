export const focusClasses =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-faded'

export const buttonClasses = `inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors ${focusClasses}`
export const buttonVariants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-dark',
  outline: 'border border-border text-foreground hover:bg-surface-container',
  ghost: 'text-primary-faded hover:text-foreground hover:bg-surface-container',
  danger: 'text-danger hover:bg-surface-container',
}
export const buttonSizes = { sm: 'px-3 py-2 text-sm', md: 'px-6 py-3' }
export const disabledButtonClasses = 'bg-surface-container text-muted cursor-not-allowed'
export const fieldClasses =
  'block min-w-0 rounded-md bg-surface-raised text-foreground px-3 py-2 text-sm outline-1 -outline-offset-1 outline-border placeholder:text-muted focus:outline-2 focus:-outline-offset-2 focus:outline-primary-faded disabled:bg-surface-container disabled:text-muted disabled:cursor-not-allowed aria-invalid:outline-danger'
export const textLinkClasses = `rounded-sm text-primary-faded hover:text-foreground underline underline-offset-4 transition-colors ${focusClasses}`
export const surfaceTones = {
  default: 'bg-surface',
  secondary: 'bg-surface-container',
  raised: 'bg-surface-raised',
}
export const surfacePaddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-8' }
export const headingSizes = {
  page: 'text-4xl sm:text-5xl font-bold leading-tight',
  section: 'text-2xl font-semibold',
  card: 'text-lg font-semibold leading-snug',
  compact: 'text-base font-bold',
  marketing: 'text-3xl sm:text-4xl font-bold leading-tight tracking-tight',
}
export const textSizes = { body: 'text-base', small: 'text-sm', caption: 'text-xs' }
export const textTones = { default: 'text-foreground', muted: 'text-muted', danger: 'text-danger' }
export const alertTones = {
  info: 'bg-surface-container text-foreground border-l-4 border-primary',
  danger: 'bg-danger text-on-danger',
}
