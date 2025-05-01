import { motion } from 'framer-motion'

function QuoteMessage(props) {

  const animalKaNorAine = {
    init: {
      opacity: 0,
      y: 200
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2
      }
    }
  }

  return <motion.h3 initial={animalKaNorAine.init} animate={animalKaNorAine.show} className="quote-msg">{props.msg}</motion.h3>;
}
export default QuoteMessage;
