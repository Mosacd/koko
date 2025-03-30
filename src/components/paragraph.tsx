import {cn} from '@/lib/utils'
import React from "react";


const Paragraph: React.FC<{ children?: React.ReactNode, className?: string }>
    = ({children, className}) => <p className={cn('text-xl text-primary', className)}>{children}</p>

export default Paragraph