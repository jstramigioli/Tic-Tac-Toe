const gameBoard = (() => {
    const rowNumber = 3;
    const columnNumber = 3;
    const board = [];
    const boardContainer = document.querySelector('#board-container')
    let cellsFilled = 0

    const cell = (row, column) => {
        let value = 0
        const cellRow = row;
        const cellColumn = column;
        const cellID = [cellRow, cellColumn]

        const AddCellToDOM = () => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('board-cell')
            cellDiv.dataset.cellId = cellID
            cellDiv.addEventListener('click', function (e) {
                CellListener(e, board[cellRow][cellColumn])})
            boardContainer.appendChild(cellDiv)
        }

        const updateCellinDOM = (cell) => {
            let cellDOM = boardContainer.querySelector('[data-cell-id="'+cell.cellID+'"]')

            const addSvgToCell = (cell, marker) => {
                /*const svg = document.createElement('img')
                svg.src = 'img/' + marker + '.svg'*/
                const svg = document.createElement('object')
                svg.type = 'image/svg+xml'
                svg.data = 'img/' + marker + '.svg' 
                svg.style.fill = 'blue'
                svg.classList.add('marker')
                cell.appendChild(svg)
            }

            if (cell.value == 0) {
                    if (cellDOM.classList.contains('marked')) {
                        cellDOM.classList.remove('marked')
                        cellDOM.classList.remove('player-one')
                        cellDOM.classList.remove('player-two')
                        cellDOM.removeChild(cellDOM.children[0])
                    }
                  }
            else {
                cellDOM.classList.add('marked')
                cellsFilled += 1
                if (cell.value == 1) {
                    cellDOM.classList.add('player-one')
                    if (cellDOM.childElementCount == 0) {
                     addSvgToCell(cellDOM, 'cross')
                    }
                }
                else {
                    cellDOM.classList.add('player-two')
                    if (cellDOM.childElementCount == 0) {
                     addSvgToCell(cellDOM, 'circle')
                    }
                }
            }
        }

        const clearCell = (cell) => {
            updateCellinDOM(cell, 0)
        }

        const CellListener = (e, cell) => {
            if (cell.value == 0 && game.aiPlaying == false) {
                game.playerMove(cell)
            }
        }
        
        return {value, 
                AddCellToDOM, 
                updateCellinDOM,
                clearCell, 
                cellID}
    };

    const createBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            board[i] = [];
            for (let j = 0 ; j < columnNumber ; j++) {
                const newCell = cell(i,j)
                newCell.AddCellToDOM()
                board[i].push(newCell)
            }
        }  
    };

    const updateBoard = () => {
        let cellsFilled = 0
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].updateCellinDOM(board[i][j])
            }
        }  
        if (cellsFilled >= (rowNumber*columnNumber)) {game.tie()}
    }

    const clearBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].value = 0
            }
        }
        updateBoard()
    }

    const removeEventListener = () => {
        let cellDivs = boardContainer.querySelectorAll('.board-cell')
        for (let i = 0 ; i < cellDivs.length ; i++) {
           cellDivs[i].removeEventListener('click', function (e) {
            CellListener(e, board[cellRow][cellColumn])})
        }
    };

    const getRow = (index) => {
        return board[index]
    }

    const getColumn = (index) => {
        let column = []
        for (let i = 0 ; i < rowNumber; i++) {
            column.push(board[i][index])
        }
        return column
    }

    const getDiagonal = (wichDiag) => {
        let diagonal = []
        if (wichDiag === 1) {
            for (let i = 0 ; i < rowNumber ; i++) {
                diagonal.push(board[i][i])
            }
        }
        else if (wichDiag === 2) {
            let column = (columnNumber - 1)
            for (let i = 0 ; i < rowNumber ; i++) {
                diagonal.push(board[i][column])
                column --
            }
        }
        return diagonal
    }

    const getEmptyCells = () => {
        let emptyCells = []
        for (let i = 0 ; i < board.length ; i++) {
           // emptyCells.push(board[i].filter(cell => cell.value == 0))
           for (let j = 0 ; j < board[i].length ; j++) {
            board[i][j].value == 0 ? emptyCells.push(board[i][j]) : null
           }
        }
        return emptyCells
    }

    return {
        board,
        rowNumber, 
        columnNumber,
        cell,
        createBoard,
        updateBoard,
        removeEventListener,
        clearBoard,
        getRow,
        getColumn,
        getDiagonal,
        getEmptyCells
    };
})();

const player = ((name, index, color) => {
    let score = 0
    let aiEnabled = false
    let difficulty = 'hard'
    
    const ai = (() => {
        const selectedMove = () => {
            const emptyCells = gameBoard.getEmptyCells()
            const randomMove = () => {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                return emptyCells[randomIndex]
            }

            const intermediateMove = () => {
                if (Math.random() < 0.5) {
                    return randomMove()
                }
                return correctMove()
            }

            const correctMove = () => {
                let priority1 = []
                let priority2 = []
                let priority3 = []

                for (let i = 0 ; i < emptyCells.length ; i++) {
                    switch (true) {
                        case amIGoingToWin(emptyCells[i]):
                            return emptyCells[i]
                        case isRivalGoingToWin(emptyCells[i]):
                            priority1.push(emptyCells[i]);
                            break;
                        case isCenter(emptyCells[i]):
                            priority2.push(emptyCells[i]);
                            break;
                        case isCorner(emptyCells[i]):
                            priority3.push(emptyCells[i]);
                            break;
                    }
                }
            
                if (priority1.length > 0) {return priority1[0]}
                if (priority2.length > 0) {return priority2[0]}
                if (priority3.length > 0) {
                    const randomIndex = Math.floor(Math.random() * priority3.length);
                    return priority3[randomIndex]
                }
                return randomMove()
            }

            switch (true) {
                case difficulty == 'easy':
                    return randomMove();
                case difficulty == 'intermediate':
                    return intermediateMove()
                case difficulty == 'hard':
                    return correctMove();
            }
        }

        const amIGoingToWin = (cell) => {
            cell.value = index
            const checkIfWin = game.checkIfWin()
            cell.value = 0
            return checkIfWin
        }

        const isRivalGoingToWin = (cell) => {
            cell.value = game.inactivePlayer.index
            const checkIfWin = game.checkIfWin()
            cell.value = 0
            return checkIfWin
        }

        const isCenter = (cell) => {
            return cell.cellID == '1,1'
        }

        const isCorner = (cell) => {
            return cell.cellID == '0,0' || cell.cellID == '0,2' || cell.cellID == '2,0' || cell.cellID == '2,2'
        }

        return {
            selectedMove,
        }
    })()

    return {name, index, score, color, ai, aiEnabled};

});


const game = (() => {
   const player1 = player('Julian', 1, 'red')
   const player2 = player('Pablina', 2, 'blue')

   let aiPlaying = false

    player2.aiEnabled = true

   let activePlayer = player1
   let inactivePlayer = player2

   let lastMove

   const newGame = () => {
    if (gameBoard.board.length == 0) { 
        gameBoard.createBoard() 
        lastMove = null
    }
        else {
            gameBoard.clearBoard()
        }
    game.activePlayer = player1
    game.aiPlaying = false
   }

   const playerMove = (cell) => {
    let player = game.activePlayer
    cell.value = player.index
    if (game.checkIfWin()) {win(game.activePlayer)}
    changeActivePlayer()
    console.log('turno de '+game.activePlayer.name)
    lastMove = cell.cellID
    gameBoard.updateBoard()
    if (game.activePlayer.aiEnabled == true) {
        game.aiPlaying = true
        let delay = Math.floor(Math.random() * (2000 - 100 + 1)) + 100
        setTimeout(aiMove, delay) 
    }
   }

   const undoMove = () => {
    let row = lastMove[0]
    let column = lastMove[1]
    gameBoard.board[row][column].value = 0
    lastMove = null
    gameBoard.updateBoard()
   }

   const aiMove = () => {
    if (game.aiPlaying == true) {
    playerMove(activePlayer.ai.selectedMove())
    game.aiPlaying = false
    }
   }

   const changeActivePlayer = () => {
    if (game.activePlayer === player1) {
    game.activePlayer = player2
    game.inactivePlayer = player1    
    }
    else {
    game.activePlayer = player1
    game.inactivePlayer = player2
    }
   }


   const checkIfWin = () => {
    const checkEqualValues = (line) => {
        let firstElement = line[0]
        for (let i = 0 ; i < line.length ; i++) {
            if (firstElement.value !== line[i].value || line[i].value == 0) {
                return false
            } 
        }
        return true
    }

    let rowWin = () => {
        for (let i = 0; i < gameBoard.rowNumber; i++) {
          if (checkEqualValues(gameBoard.getRow(i))) {
            return true;
          }
        }
        return false;
      };

    let columnWin = () => {
        for (let i = 0; i < gameBoard.columnNumber; i++) {
            if (checkEqualValues(gameBoard.getColumn(i))) {
              return true;
            }
          }
          return false; 
    }

    let diagWin = () => {
        return    checkEqualValues(gameBoard.getDiagonal(1)) || checkEqualValues(gameBoard.getDiagonal(2))
    }

    return rowWin() || columnWin() || diagWin()
   }

   const win = (winner) => {
    console.log(winner.name+' gano!') 
    endGame()
   }

   const endGame = () => {
    gameBoard.removeEventListener()
   }

   const tie = () => {
    console.log('its a tie!')
    endGame()
   }

   return {
    player1,
    player2,
    activePlayer,
    changeActivePlayer,
    aiPlaying,
    checkIfWin,
    newGame,
    playerMove,
    undoMove,
    tie,
   }
    
})();



const buttons = (() => {

    const btnContainer = document.querySelector('#button-container')

    const createNewGameBtn = () => {
        const newGameBtn = document.createElement('button')
        newGameBtn.id = 'new-game'
        newGameBtn.innerText = 'New Game'
        newGameBtn.addEventListener('click', game.newGame)
        btnContainer.appendChild(newGameBtn)
    }

    return {
        createNewGameBtn
    }
})()

buttons.createNewGameBtn()

test = () => {
   return game.player2.ai.selectedMove()
}