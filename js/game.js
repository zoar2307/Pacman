'use strict'

const WALL = '⛓️'
const FOOD = '🧿'
const CHERRY = '🍒'
const SUPER_FOOD = '🍩'
const CANNOT_EAT = '🚫'
const EMPTY = ' '

const gGame = {
    score: 0,
    isOn: false,
    food: 0
}
var gEmptyCells
var gBoard
var gSpawnCherryInterval
var gSuperFoodCells

function onInit() {
    console.log('hello')
    var elPopUpGameOver = document.querySelector('.popup-container')
    elPopUpGameOver.classList.add('hide')
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    countFood()
    renderBoard(gBoard)
    updateEmptyCells()
    gSpawnCherryInterval = setInterval(spawnNewCherry, 1000 * 15)
    updateScore()
    gGame.isOn = true
}

function buildBoard() {
    const size = 12
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1) {
                board[i][j] = WALL
            }

            if (i === 1 && j === 1 ||
                i == 1 && j === size - 2 ||
                i == size - 2 && j === 1 ||
                i == size - 2 && j === size - 2
            ) {
                board[i][j] = SUPER_FOOD
            }

            //Map Walls
            if (i === 6 && j > 6 && j <= 8 ||
                i === 6 && j > 2 && j <= 4 ||
                i > 6 && i <= 8 && j === 3 ||
                i > 6 && i <= 8 && j === 8 ||
                i === 8 && j > 4 && j <= 6

            ) {
                board[i][j] = WALL
            }

        }


    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]

            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function countFood() {
    var foodCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        var currRow = gBoard[i]
        for (var j = 0; j < currRow.length; j++) {
            var currCell = currRow[j]
            if (currCell === FOOD) foodCount++
        }
    }
    gGame.food = foodCount
}


function updateScore(diff) {
    // update model 
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // and dom
    document.querySelector('span.score').innerText = gGame.score

}

function spawnNewCherry() {
    if (gEmptyCells.length > 0) {
        var randomIdx = getRandomIntInclusive(0, gEmptyCells.length - 1)
        var emptyCell = gEmptyCells[randomIdx]
        gBoard[emptyCell.i][emptyCell.j] = CHERRY
        renderCell(emptyCell, CHERRY)
        updateEmptyCells()
    }
}



function updateEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell === ' ' && currCell !== WALL) emptyCells.push({ i, j })
        }
    }
    gEmptyCells = emptyCells
}

function getGhostIdxByLocation(checkI, checkJ) {
    for (var i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i]
        if (currGhost.location.i === checkI && currGhost.location.j === checkJ) {
            return i
        }
    }
}

function handleEatGhost(ghostIdx) {
    var eatenGhost = gGhosts.splice(ghostIdx, 1)[0]
    gEatenGhosts.push(eatenGhost)
}

function updateSuperFoodCells() {
    var superFoodCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell === SUPER_FOOD && currCell !== WALL) superFoodCells.push({ i, j })
        }
    }
    gSuperFoodCells = superFoodCells
}

function gameOver() {
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, '🪦')
    clearInterval(gSpawnCherryInterval)
    var elPopUpGameOver = document.querySelector('.popup-container')
    elPopUpGameOver.classList.remove('hide')
    gGame.isOn = false

}