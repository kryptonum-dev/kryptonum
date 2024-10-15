import type { ImageDataProps } from '../image';
import styles from './button.module.scss'

export type Props = React.HTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string | React.ReactNode
  children: React.ReactNode;
  theme?: 'primary' | 'secondary'
  linkType?: 'external' | 'internal'
  href?: string
  img?: ImageDataProps
  className?: string
}

export default function Button({ children, text, theme = 'primary', linkType = 'internal', href, img, className, ...props }: Props) {
  const Element = href ? 'a' : 'button'
  const isExternal = linkType === 'external'
  const renderedProps = {
    ...(href && { href }),
    ...(isExternal && { target: '_blank', rel: 'noreferrer' }),
    'data-theme': theme,
    className: `${styles.button}${className ? ` ${className}` : ''}`,
    ...props,
  }

  return (
    <Element {...renderedProps}>
      <div className={styles.content}>
        {children}
      </div>
    </Element>
  )
}
