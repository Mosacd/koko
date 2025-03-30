import { cn } from '@/lib/utils'

const Heading: React.FC<{ children?: React.ReactNode, className?: string, level?: 'h1' | 'h2' | 'h3'}> = ({
                                                                                                      children,
                                                                                                      className,
                                                                                                      level,
                                                                                                      ...rest
                                                                                                    }) =>
  level === 'h2' ? <h2
      className={cn('md:text-5xl text-3xl font-semibold text-primary ', className)} {...rest}>{children}</h2> :
    level === 'h3' ? <h3
        className={cn('md:text-3xl text-xl font-semibold text-primary ', className)} {...rest}>{children}</h3> :
    <h1
      className={cn('md:text-7xl text-5xl font-semibold text-primary ', className)} {...rest}>{children}</h1>


export default Heading