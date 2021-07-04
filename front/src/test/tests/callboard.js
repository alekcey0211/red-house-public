import { useDispatch } from "react-redux"
import call from '../_call'

const callboardTest = () => {

   /**
   * Иммитация отправки с сервера 
   */
    const test = call('CALLBOARD_START')
  
    return test
}

export default callboardTest