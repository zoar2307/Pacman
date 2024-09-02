'use strict'


const PACMAN = 'img/pacman.png'
var gPacman
var gIsPacmanSuper = false
// var gPacmanSuperTimeOut

function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false,
        deg: 0
    }
    board[gPacman.location.i][gPacman.location.j] = getPacmanHTML(PACMAN, gPacman.deg)
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.code)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]
    // DONE: return if cannot move
    if (nextCell === WALL) return
    if (nextCell === SUPER_FOOD && gIsPacmanSuper) return
    // DONE: hitting a ghost? call gameOver
    if (nextCell === GHOST && !gIsPacmanSuper) {
        gameOver()
        var elPopUpP = document.querySelector('.popup-container p')
        elPopUpP.innerText = 'You Lost'
        return
    }
    if (nextCell === GHOST && gIsPacmanSuper) {
        updateScore(100)
        var ghostIdx = getGhostIdxByLocation(nextLocation.i, nextLocation.j)
        handleEatGhost(ghostIdx)
    }

    if (nextCell === FOOD) {
        updateScore(1)
        gGame.food--
        if (gGame.food === 0) {
            gameOver()
            var elPopUpP = document.querySelector('.popup-container p')
            elPopUpP.innerText = 'You Won'
            return
        }
    }
    if (nextCell === CHERRY) {
        updateScore(25)

    }

    if (nextCell === SUPER_FOOD) {
        updateScore(10)
        gIsPacmanSuper = true

        // for (var i = 0; i < gSuperFoodCells.length; i++) {
        //     var currCell = gSuperFoodCells[i]
        //     console.log(currCell);
        //     gBoard[currCell.i][currCell.j]
        // }

        for (var i = 0; i < gGhosts.length; i++) {
            var currGhost = gGhosts[i]
            var displayGhost = gIsPacmanSuper ? EATABLE_GHOST : GHOST
            var diplayBgGhost = gIsPacmanSuper ? currGhost.pacmanSuperColor : currGhost.color
            renderCell(currGhost.location, getGhostHTML(displayGhost, diplayBgGhost))
        }

        setTimeout(() => {
            gIsPacmanSuper = false
            if (gEatenGhosts.length > 0) {
                for (var i = 0; i < gEatenGhosts.length; i++) {
                    var currGhost = gEatenGhosts[i]
                    currGhost.location.i = 7
                    currGhost.location.j = 6
                    gGhosts.push(currGhost)
                }
                gEatenGhosts = []
            }
        }, 5000)
    }


    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)

    // DONE: Move the pacman to new location:
    // DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DONE: update the DOM
    renderCell(nextLocation, getPacmanHTML(PACMAN, gPacman.deg))
    // updateSuperFoodCells()
    updateEmptyCells()
}

function getNextLocation(eventKeyboard) {

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // TODO: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            gPacman.deg = 270
            break;
        case 'ArrowRight':
            nextLocation.j++
            gPacman.deg = 0
            break;
        case 'ArrowDown':
            nextLocation.i++
            gPacman.deg = 90
            break;
        case 'ArrowLeft':
            nextLocation.j--
            gPacman.deg = 180
            break;
    }

    return nextLocation
}



function getPacmanHTML(pacman, deg) {
    return `<img style="transform: rotate(${deg}deg);" src="${pacman}" alt="">`
}