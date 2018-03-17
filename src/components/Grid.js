import React from 'react'

import Cell from './Cell'
import { generateQuickGuid } from '../utils/helpers'
import { object, arrayOf } from 'prop-types'

Grid.propTypes = {
  sea: arrayOf(arrayOf(object)).isRequired
}

function Grid ({ sea, label }) {
  const filledSea = sea.map((row, x) =>
    (
      <div className='column' key={generateQuickGuid()}>
        {
          row.map((cell, y) => (
            <Cell
              type={sea[x][y].type}
              key={generateQuickGuid()}
            />
          ))
        }
      </div>
    )
  )
  return <div className='grid'>{filledSea}</div>
}

export default Grid
