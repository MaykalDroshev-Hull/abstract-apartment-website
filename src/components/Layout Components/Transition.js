import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Variants for Framer Motion animation used for page transitions.
 * Defines the "out" and "in" states of the animation, which include opacity
 * and y-axis translations with specified durations and delays.
 */
const variants = {
  out: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.75
    }
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: 0.5,
    }
  }
}

/**
 * A component that provides transition animation using framer-motion library.
 * @component
 * @param {Object} props - The props object.
 * @param {ReactNode} children - The content to be wrapped with the animation.
 * @returns {JSX.Element}
 */
const Transition = ({ children }) => {
  //Returns the Next.js router object, which contains information about the current URL and routing state
  const { asPath } = useRouter()

  return (
    <div>
      <AnimatePresence
        initial={false}
        mode='wait'
      >
        <motion.div
          key={asPath}
          variants={variants}
          animate='in'
          initial='out'
          exit='out'
        >
          {children}
        </motion.div>
      </AnimatePresence >
    </div>
  )
}

export default Transition