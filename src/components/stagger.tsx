import {motion, stagger, useAnimate} from 'framer-motion'
import React, {useEffect} from 'react'
import {cn} from '@/lib/utils'

/**
 * Makes you able to easily implement airbnb animation
 *
 * just add .stagger-component-item class to component which you would like to be animated
 *
 * @param children
 * @param className
 * @param delay
 * @param className
 * @param delay
 * @constructor
 */
const Stagger: React.FC<{ children: React.ReactNode, className?: string, delay?: number }>
    = ({children, className, delay}) => {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        animate('.stagger-component-item', {y: [20, 0], opacity: [0, 1]}, {
            delay: stagger(delay || 0.08),
            ease: 'easeOut'
        })
    }, [animate, delay])


    return <motion.section ref={scope} className={cn('max-w-xl w-full opacity-0', className)}
                           animate={{opacity: [0, 1]}}>
        {children}
    </motion.section>
}


export default Stagger