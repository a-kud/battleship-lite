// https://stackoverflow.com/posts/13403498/revisions
export function generateQuickGuid () {
  return Math.random()
    .toString(18)
    .substring(2, 10)
}

/**
 *
 * @param {number} max Positive interger number
 * @returns {number} Random integer in range [0, limit]
 */
export function generateRandomInteger (max) {
  return Math.floor(Math.random() * (max + 1))
}

/**
 * Generates game grid of width by height size
 * width, height - numbers
 * returns array
 */
export function createSea (width, height) {
  const rows = Array.from({ length: height })
  const columns = Array.from({ length: width })
  return rows.map((row, x) =>
    columns.map((column, y) => ({
      x: x,
      y: y,
      type: 'sea'
    }))
  )
}

export function isCellClearOfShips (grid, i, j) {
  let rowLimit = 9
  let columnLimit = 9
  let types = []

  for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
      if (x !== i || y !== j) {
        types.push(grid[x][y].type)
      }
    }
  }
  return !JSON.stringify(types).includes('ship')
}

/**
 *
 * @param {array} grid 2D game grid
 * @param {array} validLineCoordinates Contains arrays of arrays of coordinates composing of a line ship
 * @returns {array} Possible L-shaped ships coordinates
 */
export function getElValidCoordinates (grid, validLineCoordinates) {
  const lengthLimit = /* grid[0].length */ 10
  const validLineCoordinatesCopy = validLineCoordinates.map(row =>
    row.map(col => [...col])
  )
  const checkSouth = (x, y) => {
    if (grid[x][y + 1].type !== 'ship' && isCellClearOfShips(grid, x, y + 1)) {
      return [x, y + 1]
    }
  }
  const checkNorth = (x, y) => {
    if (grid[x][y - 1].type !== 'ship' && isCellClearOfShips(grid, x, y - 1)) {
      return [x, y - 1]
    }
  }
  const checkEast = (x, y) => {
    if (grid[x + 1][y].type !== 'ship' && isCellClearOfShips(grid, x + 1, y)) {
      return [x + 1, y]
    }
  }
  const checkWest = (x, y) => {
    if (grid[x - 1][y].type !== 'ship' && isCellClearOfShips(grid, x - 1, y)) {
      return [x - 1, y]
    }
  }
  const markShipsLayout = validLineCoordinatesCopy.map(coordinates =>
    coordinates.filter((coord, i) => {
      if (i === 0) {
        return coordinates[i + 1][0] === coordinates[i][0]
          ? [coordinates[i].push('vertical')]
          : [coordinates[i].push('horizontal')]
      } else {
        return coordinates[i]
      }
    })
  )

  const allShipCoordinates = []
  for (const shipCoord of markShipsLayout) {
    for (const coord of shipCoord) {
      if (coord[2] === 'horizontal') {
        if (coord[1] === 0) {
          allShipCoordinates.push([
            checkSouth(coord[0], coord[1]),
            ...shipCoord
          ])
        } else if (coord[1] + 1 === lengthLimit) {
          allShipCoordinates.push([
            checkNorth(coord[0], coord[1]),
            ...shipCoord
          ])
        } else {
          allShipCoordinates.push([
            checkNorth(coord[0], coord[1]),
            ...shipCoord
          ])
          allShipCoordinates.push([
            checkSouth(coord[0], coord[1]),
            ...shipCoord
          ])
        }
      } else if (coord[2] === 'vertical') {
        if (coord[0] === 0) {
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        } else if (coord[0] + 1 === lengthLimit) {
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
        } else {
          allShipCoordinates.push([checkWest(coord[0], coord[1]), ...shipCoord])
          allShipCoordinates.push([checkEast(coord[0], coord[1]), ...shipCoord])
        }
      }
    }

    return allShipCoordinates
  }
}

/**
 * @param {number} length Ship length
 * @param {number} x Column coordinate
 * @param {number} y Row coordinate
 * @param {number} lengthLimit Grid side length
 * @returns {array} Ship coordinates can be placed clear of obstacles
 */
export function generateLineShipCoordinates (x, y, length, grid, lengthLimit) {
  const validCoordinates = []
  if (lengthLimit - y >= length) {
    const southCoordinates = []

    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x][y + i].type.includes('ship') &&
        isCellClearOfShips(grid, x, y + i)
      ) {
        southCoordinates.push([x, y + i])
      }
    }
    if (southCoordinates.length === length) {
      validCoordinates.push(southCoordinates)
    }
  }

  if (lengthLimit - (lengthLimit - 1 - y) >= length) {
    let northCoordinates = []
    for (let i = 0; i < length; i++) {
      if (
        !grid[x][y - i].type.includes('ship') &&
        isCellClearOfShips(grid, x, y - i)
      ) {
        northCoordinates.push([x, y - i])
      }
    }
    if (northCoordinates.length === length) {
      validCoordinates.push(northCoordinates)
    }
  }

  if (lengthLimit - (lengthLimit - 1 - x) >= length) {
    const westCoordinates = []
    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x - i][y].type.includes('ship') &&
        isCellClearOfShips(grid, x - i, y)
      ) {
        westCoordinates.push([x - i, y])
      }
    }
    if (westCoordinates.length === length) {
      validCoordinates.push(westCoordinates)
    }
  }

  if (lengthLimit - x >= length) {
    const eastCoordinates = []
    for (let i = 0; i < length; i += 1) {
      if (
        !grid[x + i][y].type.includes('ship') &&
        isCellClearOfShips(grid, x + i, y)
      ) {
        eastCoordinates.push([x + i, y])
      }
    }
    if (eastCoordinates.length === length) {
      validCoordinates.push(eastCoordinates)
    }
  }
  return validCoordinates
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 *
 * @param {array} grid Game board, 2D array
 * @param {number} lengthLimit Grid square side length
 * @returns {array} Game grid with random placed ships
 */
export function generateAiBoard (grid, lengthLimit) {
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
    const validCoordinates = generateLineShipCoordinates(
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
    const validCoordinates = generateLineShipCoordinates(
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
