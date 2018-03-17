import React from 'react'
import { arrayOf, func, object } from 'prop-types'

import Grid from './Grid'
import GridLabels from './GridLabels'

Board.propTypes = {
  board: arrayOf(arrayOf(object)).isRequired
}

function Board ({ board, onClick }) {
  return (
    <div className='game-board '>
      <GridLabels row />
      <div className='game-columns'>
        <GridLabels column />
        <Grid sea={board} />
      </div>
    </div>
  )
}

export default Board
