/* eslint no-fallthrough: "off" */
import React, { Component } from 'react'
import './App.css'

import Board from './components/Board'
import Button from 'material-ui/Button'
import {
  createSea,
  generateRandomInteger,
  sleep,
  generateAiBoard
} from './utils/helpers'
class App extends Component {
  state = {
    settings: {
      boardWidth: 10,
      boardHeight: 10,
      cellsToSunk: 10
    },
    gameStarted: false,
    aiBoard: [],
    computerHits: 0
  }

  handleGameStart = () => {
    const updateBoard = (boardName, type, xCoord, yCoord) => {
      const board = [...this.state[boardName]]
      board[xCoord][yCoord].type = type
      this.setState({ [boardName]: board })
    }
    const updateHitsCount = (counterName) => {
      this.setState(prevState => ({
        [counterName]: prevState[counterName] + 1
      }))
    }

    this.setState({ gameStarted: true })

    const x = generateRandomInteger(9)
    const y = generateRandomInteger(9)
    const fire = async (randomX, randomY) => {
      console.log(`fire ${randomX} ${randomY}`)

      const computerHitsCount = this.state.computerHits
      const cellsToSunk = this.state.settings.cellsToSunk
      const cellType = this.state.aiBoard[randomX][randomY].type

      if (computerHitsCount === cellsToSunk) {
        alert('You have lost. Your fleet was destroyed.')
        return
      }
      await sleep(10)
      if (cellType.includes('shot-missed') || cellType.includes('shiphit')) {
        return fire(generateRandomInteger(9), generateRandomInteger(9))
      }
      if (cellType.includes('ship')) {
        updateBoard('aiBoard', 'ship shiphit', randomX, randomY)
        updateHitsCount('computerHits')
        return fire(generateRandomInteger(9), generateRandomInteger(9))
      } else {
        updateBoard('aiBoard', 'shot-missed', randomX, randomY)
        return fire(generateRandomInteger(9), generateRandomInteger(9))
      }
    }
    fire(x, y)
  }

  componentWillMount () {
    const height = this.state.settings.boardHeight
    const width = this.state.settings.boardWidth
    const generateBoard = () => {
      const aiGrid = generateAiBoard(this.state.aiBoard, width)
      this.setState({ aiBoard: aiGrid })
    }

    this.setState({
      aiBoard: createSea(height, width)
    }, generateBoard)
  }

  render () {
    return (
      <div id='app'>
        <div className='header-top'>
          <h1>Welcome to Battleship</h1>
        </div>
        <div className='controls'>
          <Button
            variant='raised'
            onClick={this.handleGameStart}
            color='primary'
            disabled={this.state.gameStarted}
            id='start-btn'
          >
            Start
          </Button>
        </div>
        <Board board={this.state.aiBoard} onClick={this.handleClick} />
        </div>
    )
  }
}

export default App
