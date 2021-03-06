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
    resetNeeded: true,
    aiBoard: []
  }

  generateBoardAndFleet = () => {
    const height = this.state.settings.boardHeight
    const width = this.state.settings.boardWidth
    const generateFleet = () => {
      const gridCopy = this.state.aiBoard.map(row =>
        row.map(col => ({ ...col }))
      )
      const aiGrid = generateAiBoard(gridCopy, width)
      this.setState({ aiBoard: aiGrid })
    }

    this.setState(
      {
        aiBoard: createSea(height, width)
      },
      generateFleet
    )
  }

  handleGameStart = () => {
    const updateBoard = (boardName, type, xCoord, yCoord) => {
      const board = [...this.state[boardName]]
      board[xCoord][yCoord].type = type
      this.setState({ [boardName]: board })
    }

    const fire = async (randomX, randomY, computerHits) => {
      const cellsToSunk = this.state.settings.cellsToSunk
      const cellType = this.state.aiBoard[randomX][randomY].type

      if (computerHits === cellsToSunk) {
        alert('You have lost. Your fleet was destroyed.')
        this.setState({ resetNeeded: true })
        return false
      }

      if (cellType.includes('shot-missed') || cellType.includes('shiphit')) {
        return fire(
          generateRandomInteger(9),
          generateRandomInteger(9),
          computerHits
        )
      }
      if (cellType.includes('ship')) {
        updateBoard('aiBoard', 'ship shiphit', randomX, randomY)
        await sleep(50)
        return fire(
          generateRandomInteger(9),
          generateRandomInteger(9),
          computerHits + 1
        )
      }

      updateBoard('aiBoard', 'shot-missed', randomX, randomY)
      await sleep(50)
      return fire(
        generateRandomInteger(9),
        generateRandomInteger(9),
        computerHits
      )
    }

    this.setState({
      gameStarted: true,
      resetNeeded: false
    })
    fire(generateRandomInteger(9), generateRandomInteger(9), 0)
  }

  handleGameReset = () => {
    this.generateBoardAndFleet()
    this.setState({ gameStarted: false })
  }

  componentWillMount () {
    this.generateBoardAndFleet()
  }

  render () {
    return (
      <div id='app'>
        <div className='header-top'>
          <h1>Welcome to Battleship Lite</h1>
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
          <Button
            variant='raised'
            onClick={this.handleGameReset}
            color='primary'
            disabled={!this.state.resetNeeded}
            id='reset-btn'
          >
            Reset
          </Button>
        </div>
        <Board board={this.state.aiBoard} onClick={this.handleClick} />
      </div>
    )
  }
}

export default App
