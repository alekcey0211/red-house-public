import React from 'react'
import { useSelector } from 'react-redux'

import KeyBoardLayout from '/components/KeyBoardLayout'
import { Border } from '/components/styled'

const StartGame = () => {

  const layoutName = 'startGame'
  const name = useSelector(state => state.startGameReducer.name)

  const handlerClose = () => {

  }

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: handlerClose
        }
      }}
    >
      <div id="startGame">
      <Border
      wrapperStyle={{
        position: 'static',
        width: '480px',
        marginRight: '30px'
      }}
      style={{
        height: '100%',
        padding: '30px'
      }}
    >
      <div className="cooking__inventory">
        <div className="start_game_title">
          {name}  
        </div>
      </div>
    </Border>
      </div>
    </KeyBoardLayout>
  )
}

export default StartGame;