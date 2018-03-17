/* eslint no-fallthrough: "off" */
import React, { Component } from 'react'
import './App.css'

import Board from './components/Board'
import Button from 'material-ui/Button'
import {
  isCellClearOfShips,
  getElValidCoordinates,
  createSea,
  generateRandomInteger,
  generateLinearShipCoordinates,
  sleep
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
    const generateAiBoard = grid => {
      const lengthLimit = this.state.settings.boardWidth
      const generateDestroyer = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)
        if (grid[x][y].type === 'sea' && isCellClearOfShips(grid, x, y)) {
          grid[x][y].type = 'ship'
          return grid
        }
        return generateDestroyer(grid)
      }
      const generateCruiser = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(
          x,
          y,
          4,
          grid,
          lengthLimit
        )

        if (validCoordinates.length > 0) {
          const finalCoordinates =
            validCoordinates[generateRandomInteger(validCoordinates.length - 1)]
          for (const coordinate of finalCoordinates) {
            grid[coordinate[0]][coordinate[1]].type = 'ship'
          }
          return grid
        }
        return generateCruiser(grid)
      }
      const generateBattleShip = grid => {
        const x = generateRandomInteger(lengthLimit - 1)
        const y = generateRandomInteger(lengthLimit - 1)
        const validCoordinates = generateLinearShipCoordinates(
          x,
          y,
          3,
          grid,
          lengthLimit
        )

        let finalValidCoordinates = []
        if (validCoordinates.length) {
          finalValidCoordinates = getElValidCoordinates(grid, validCoordinates)
        }
        if (finalValidCoordinates.length) {
          const randomIndex = generateRandomInteger(
            finalValidCoordinates.length - 1
          )
          const finalCoordinates = finalValidCoordinates[randomIndex]
          for (const coordinate of finalCoordinates) {
            grid[coordinate[0]][coordinate[1]].type = 'ship'
          }
          return grid
        }
        return generateBattleShip(grid)
      }

      return generateCruiser(
        generateDestroyer(generateDestroyer(generateBattleShip(grid)))
      )
    }
    this.setState(prevState => ({
      gameStarted: true
    }))

    const updateBoard = (
      boardName = 'userBoard',
      type = 'ship',
      xCoord,
      yCoord
    ) => {
      const board = [...this.state[boardName]]
      board[xCoord][yCoord].type = type
      this.setState({ [boardName]: board })
    }
    const updateHitsCount = (counterName = 'userHits') => {
      this.setState(prevState => ({
        [counterName]: prevState[counterName] + 1
      }))
    }

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
      await sleep(1)
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

    const aiGrid = generateAiBoard(this.state.aiBoard)
    this.setState({ aiBoard: aiGrid })

    fire(x, y)
  }

  componentWillMount () {
    const height = this.state.settings.boardHeight
    const width = this.state.settings.boardWidth
    this.setState({
      aiBoard: createSea(height, width)
    })
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
        <div className='boards'>
          <Board board={this.state.aiBoard} onClick={this.handleClick} />
        </div>
      </div>
    )
  }
}

export default App
