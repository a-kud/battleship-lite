import React from 'react'
import { string } from 'prop-types'

Cell.propTypes = {
  type: string
}

function Cell ({ type='sea' }) {
  return <div className={type} />
}

export default Cell
