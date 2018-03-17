import React from 'react'

import { generateQuickGuid } from '../utils/helpers'
import { bool } from 'prop-types'

GridLabel.propTypes = {
  row: bool,
  column: bool
}

function GridLabel ({ row, column }) {
  
  const labels = Array.from({ length: 10 })
  const rowContent = 'ABCDEFGHIJ'
  const classNameGroup = row ? 'row-labels' : 'column-labels'
  const className = row ? 'row-label' : 'column-label'

  return (
    <div className={classNameGroup}>
      {labels.map((label, i) => (
        <div className={className} key={generateQuickGuid()}>
          <span>{column ? i : rowContent.substr(i, 1)}</span>
        </div>
      ))}
    </div>
  )
}

export default GridLabel