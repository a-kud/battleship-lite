import React, { Component } from 'react'

import Cell from './Cell'
import { generateQuickGuid } from '../utils/helpers'
import { object, arrayOf, string, bool } from 'prop-types'

class Grid extends Component {
  static propTypes = {
    sea: arrayOf(arrayOf(object)),
    label: string
  }

  render () {
    const { sea, label } = this.props
    const filledSea = sea.map((row, x) => {
      const seaRow = row.map((cell, y) => (
        <Cell
          coord={{ x: sea[x][y].x, y: sea[x][y].y }}
          type={sea[x][y].type}
          label={label}
          key={generateQuickGuid()}
        />
      ))
      return (
        <div className='column' key={generateQuickGuid()}>
          {seaRow}
        </div>
      )
    })
    return <div className='grid'>{filledSea}</div>
  }
}

export default Grid
