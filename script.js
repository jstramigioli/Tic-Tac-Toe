const gameBoard = (() => {
    const rowNumber = 3;
    const columnNumber = 3;
    const board = [];
    const boardContainer = document.querySelector('#board-container')
    const defaultBackgroundColor = 'aquamarine'

    const cell = (row, column) => {
        let value = 0
        const cellRow = row;
        const cellColumn = column;
        const cellID = [cellRow, cellColumn]

        const renderCell = (cell) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('board-cell')
            cellDiv.addEventListener('click', function (e) {
                addListenerToCell(e)})
            boardContainer.appendChild(cellDiv)
        }


        const updateCell = (cell, player) => {
            //cell.classList.add(player.color)
            //gameBoard.board[cellRow][cellColumn].value = game.activePlayer.index
            if (player == 0) {
                    cell.classList.contains('marked') ? cell.classList.remove('marked') : null
                    cell.style.backgroundColor = defaultBackgroundColor
                    gameBoard.board[cellRow][cellColumn].value = 0
            }
            else {
                cell.classList.add('marked')
                cell.style.backgroundColor = player.color
                gameBoard.board[cellRow][cellColumn].value = game.activePlayer.index
            }
        }

        const clearCell = (cell) => {
            //cell.classList.remove(player.color)
            //gameBoard.board[cellRow][cellColumn].value = 0
            updateCell(cell, 0)
        }

        const addListenerToCell = (e) => {
            if (getCellValue(cellRow, cellColumn) == 0) {
                console.log(e)
            updateCell(e.target, game.activePlayer)
            game.checkIfWin(cellID)
            game.changeActivePlayer()
            console.log('turno de '+game.activePlayer.name)
            }
        }
        
        return {value, renderCell, updateCell, getCellValue, clearCell}
    };


    const getCellValue = (cellRow, cellColumn) => {
        return board[cellRow][cellColumn].value
    };

    const changeCellValue = (cellRow, cellColumn, newValue) => {
        board[cellRow][cellColumn].value = newValue
    }

    const createBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            board[i] = [];
            for (let j = 0 ; j < columnNumber ; j++) {
                const newCell = cell(i,j)
                newCell.renderCell()
                board[i].push(newCell)
            }
        }  
    };

    const clearBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].clearCell(board[i][j])
            }
        }
    }

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

    return {
        board,
        createBoard,
        clearBoard,
        getCellValue,
        changeCellValue,
        cell,
        getRow,
        getColumn,
        getDiagonal,
    };
})();

const player = ((name, index, color) => {
    let score = 0
    return {name, index, score, color};
});


const game = (() => {
   const player1 = player(prompt('Nombre de jugador 1'), 1, 'red')
   const player2 = player(prompt('Nombre de jugador 2'), 2, 'blue')

   let activePlayer = player1

   const newGame = () => {
    gameBoard.board.length == 0 ? gameBoard.createBoard() : gameBoard.clearBoard()
   }

   const changeActivePlayer = () => {
    if (game.activePlayer === player1) {
    game.activePlayer = player2}
    else {
    game.activePlayer = player1
    }
   }

   const checkIfWin = (cell) => {
    let row = gameBoard.getRow(cell[0])
    let column = gameBoard.getColumn(cell[1])
    const checkEqualValues = (line) => {
        let firstElement = line[0]
        for (let i = 0 ; i < line.length ; i++) {
            if (firstElement.value !== line[i].value || line[i].value == 0) {
                return false
            } 
        }
        return true
    }
    return checkEqualValues(row) || checkEqualValues(column) 
    || checkEqualValues(gameBoard.getDiagonal(1)) || checkEqualValues(gameBoard.getDiagonal(2))
    ? win(activePlayer)
    : null
   }

   const win = (winner) => {
    console.log(winner.name+' gano!') 

   }

   return {
    player1,
    player2,
    activePlayer,
    changeActivePlayer,
    checkIfWin,
    newGame
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
