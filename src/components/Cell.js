import React, { Component } from 'react'
import { object, string } from 'prop-types'

class Cell extends Component {
  static propTypes = {
    coord: object.isRequired,
    type: string,
    label: string
  }

  static defaultProps = {
    className: 'sea'
  }

  render () {
    const { type, label } = this.props
    return <div className={type} />
  }
}

export default Cell
