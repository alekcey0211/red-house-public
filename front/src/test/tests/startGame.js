import call from "../_call"


const statrGame = () => {

  const name = 'Djoker255'

  const start = call('START_GAME', {name})

  return start
}

export default statrGame;