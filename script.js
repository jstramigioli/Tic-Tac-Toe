const gameBoard = (() => {
    const rowNumber = 3;
    const columnNumber = 3;
    const board = [];
    const boardContainer = document.querySelector('#board-container')
    let cellsFilled = 0

    const cell = (row, column) => {
        let value = 0
        let winner = false
        const cellRow = row;
        const cellColumn = column;
        const cellID = [cellRow, cellColumn]
        let cellDiv

        const AddCellToDOM = () => {
            cellDiv = document.createElement('div');
            cellDiv.classList.add('board-cell')
            cellDiv.dataset.cellId = cellID
            addEventToCell()
            boardContainer.appendChild(cellDiv)
        }

        const updateCellinDOM = (cell) => {
            let cellDOM = boardContainer.querySelector('[data-cell-id="'+cell.cellID+'"]')

            const addSvgToCell = (cell, marker) => {
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
                    cellDOM.classList.remove('winner')
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
                if (cell.winner == true) {
                    cellDOM.classList.add('winner')
                }
            }
        }

        const clearCell = (cell) => {
            updateCellinDOM(cell, 0)
        }

        const cellListener= (e) => {
            let cell = board[cellRow][cellColumn]
                if (cell.value == 0 && !game.activePlayer.aiEnabled) {
                    game.playerMove(cell)
                }
            }

        const addEventToCell = () => {
            cellDiv.addEventListener('click', cellListener)
        }

        const removeEventFromCell = () => {
               cellDiv.removeEventListener('click', cellListener)
            }
        
        return {value, 
                AddCellToDOM, 
                updateCellinDOM,
                clearCell, 
                cellID,
                removeEventFromCell,
                addEventToCell}
    }

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
        if (cellsFilled >= (rowNumber*columnNumber)) {game.tie == true}
    }

    const clearBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].value = 0
                board[i][j].winner = false
            }
        }
        updateBoard()
    }

    const removeListenerOnAllBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].removeEventFromCell()
            }
         }
    };

    const addListenerOnAllBoard = () => {
        for (let i = 0 ; i < rowNumber ; i++) {
            for (let j = 0 ; j < columnNumber ; j++) {
                board[i][j].addEventToCell()
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

    const getEmptyCells = () => {
        let emptyCells = []
        for (let i = 0 ; i < board.length ; i++) {
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
        removeListenerOnAllBoard,
        addListenerOnAllBoard,
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
    let difficulty = 'Intermediate'
    
    const ai = (() => {
        const selectedMove = () => {
            const emptyCells = gameBoard.getEmptyCells()
            const randomMove = () => {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                console.log('mal movimiento')
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
                        case amIGoingToWin(emptyCells[i]).length > 0:
                            return emptyCells[i]
                        case isRivalGoingToWin(emptyCells[i]).length > 0:
                            priority1.push(emptyCells[i]);
                            break;
                        case isCenter(emptyCells[i]):
                            priority2.push(emptyCells[i]).length > 0;
                            break;
                        case isCorner(emptyCells[i]):
                            priority3.push(emptyCells[i]).length > 0;
                            break;
                    }
                }
            
                if (priority1.length > 0) {return priority1[0]}
                if (priority2.length > 0) {return priority2[0]}
                if (priority3.length > 0) {
                    const randomIndex = Math.floor(Math.random() * priority3.length);
                    return priority3[randomIndex]
                }
                console.log('mal movimiento')
                return randomMove()
            }

            switch (true) {
                case game.activePlayer.difficulty == 'Easy':
                    return randomMove();
                case game.activePlayer.difficulty == 'Intermediate':
                    return intermediateMove()
                case game.activePlayer.difficulty == 'Hard':
                    return correctMove();
            }
        }

        const amIGoingToWin = (cell) => {
            cell.value = game.activePlayer.index
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
            difficulty
        }
    })()

   const enableOrDisableAi = function (e) {
    
    if (e.target.id == `toggle-player${this.index}`) {
        if (e.target.checked) {
            this.aiEnabled = true;
            if (game.activePlayer === this) {
                game.aiMove();
            }
        } else {
            this.aiEnabled = false;
        }
    }
    };

    return {name, index, score, color, ai, aiEnabled, enableOrDisableAi, difficulty};

});


const game = (() => {
   const player1 = player('Player 1', 1, 'var(--player-one-color)')
   const player2 = player('Player 2', 2, 'var(--player-two-color)')

   let activePlayer = player1
   let inactivePlayer = player2

   let lastMove
   let lastFirstPlayer = player2

   const newGame = () => {
    if (gameBoard.board.length == 0) { 
        gameBoard.createBoard() 
        lastMove = null
    }
        else {
            gameBoard.clearBoard()
            gameBoard.addListenerOnAllBoard()
        }
    if (lastFirstPlayer == player2) { 
        game.activePlayer = player1
        game.inactivePlayer = player2
        lastFirstPlayer = player1
         }
    else {
        game.activePlayer = player2
        game.inactivePlayer = player1
        lastFirstPlayer = player2
        }
    if (game.activePlayer.aiEnabled) {
        let delay = Math.floor(Math.random() * (2000 - 100 + 1)) + 100
        setTimeout(aiMove, delay) 
    }

    const removeResultMessage = () => {
        resultContainer = document.getElementById('result-container')
        if (resultContainer.children.length > 0) {
            resultContainer.removeChild(resultContainer.children[0])
        }
    }
    
    removeResultMessage()
    showYourTurn(game.activePlayer, game.inactivePlayer)
   }



   const playerMove = (cell) => {
    let player = game.activePlayer
    cell ? cell.value = player.index : null
    if (game.checkIfWin()) {win(game.activePlayer, game.checkIfWin())}
    else    { changeActivePlayer()
            console.log('turno de '+game.activePlayer.name)
            lastMove = cell.cellID
            gameBoard.updateBoard()
            if (game.tie) {
                addResultMessage('tie')
                endGame()
            }
            else if (game.activePlayer.aiEnabled == true) {
                let delay = Math.floor(Math.random() * (2000 - 100 + 1)) + 100
                setTimeout(aiMove, delay) 
    }}
   }

   const undoMove = () => {
    let row = lastMove[0]
    let column = lastMove[1]
    gameBoard.board[row][column].value = 0
    lastMove = null
    gameBoard.updateBoard()
   }

   const aiMove = () => {
    if (gameBoard.board.length > 0)
    playerMove(activePlayer.ai.selectedMove())
   }

   const showYourTurn = (activePlayer, inactivePlayer) => {
    const activePlayerContainer = document.querySelector('#player'+activePlayer.index)
    activePlayerContainer.classList.add('your-turn')
    const inactivePlayerContainer = document.querySelector('#player'+inactivePlayer.index)
    inactivePlayerContainer.classList.remove('your-turn')
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
    showYourTurn(game.activePlayer, game.inactivePlayer)
   }


   const checkIfWin = () => {
    const checkEqualValues = (line) => {
        let firstElement = line[0]
        for (let i = 0 ; i < line.length ; i++) {
            if (firstElement.value !== line[i].value || line[i].value == 0) {
                return false
            } 
        }
        return line
    }

    let rowWin = () => {
        for (let i = 0; i < gameBoard.rowNumber; i++) {
          if (checkEqualValues(gameBoard.getRow(i))) {
            return gameBoard.getRow(i);
          }
        }
        return false;
      };

    let columnWin = () => {
        for (let i = 0; i < gameBoard.columnNumber; i++) {
            if (checkEqualValues(gameBoard.getColumn(i))) {
              return gameBoard.getColumn(i);
            }
          }
          return false; 
    }

    let diagWin = () => {
        if (checkEqualValues(gameBoard.getDiagonal(1))) {
            return checkEqualValues(gameBoard.getDiagonal(1))
        }
        else if (checkEqualValues(gameBoard.getDiagonal(2))) {
            return checkEqualValues(gameBoard.getDiagonal(2))
        }
        }  

    return rowWin() || columnWin() || diagWin() || false
   }

   const addResultMessage = (winner) => {
    const resultMessage = document.createElement('p')
    if (winner == 'tie') {
        resultMessage.textContent = `It's a tie!`
    }
    else {
        resultMessage.textContent = `${winner.name} wins!`
        resultMessage.style.color = winner.color
    }

    const messageContainer = document.querySelector('#result-container')
    messageContainer.appendChild(resultMessage)
}

   const win = (winner, line) => {
    const updateScore = (player) => {
        player.score += 1;
        const playerContainer = document.querySelector(`#player${player.index}`);
        const playerScoreElement = playerContainer.querySelector('.player-score');
        playerScoreElement.textContent = 'Score: '+player.score
    }

    const addWinToCells = (line) => {
        for (let i = 0 ; i < line.length ; i++) {
            line[i].winner = true
        }
    updateScore(winner)
    addResultMessage(winner)
    }

    
    addWinToCells(line)
    gameBoard.updateBoard()
    endGame()
   }

   const endGame = () => {
    gameBoard.removeListenerOnAllBoard()
   }

   const tie = false

   return {
    player1,
    player2,
    activePlayer,
    changeActivePlayer,
    checkIfWin,
    newGame,
    playerMove,
    aiMove,
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

    const difficultyListener = (e) => {
        if (e.target.checked) {
            if (e.target.id.slice(-1) == '1') {
                game.player1.difficulty = e.target.value
            }
            else if (e.target.id.slice(-1) == '2') {
                game.player2.difficulty = e.target.value
            }
        }
    }
    
    const difficultyBtn = document.querySelectorAll('.ai-button')
    for (let i = 0 ; i < difficultyBtn.length; i++) {
        difficultyBtn[i].addEventListener('change', difficultyListener)
    }

    const playerOneAiCheckbox = document.getElementById("toggle-player1")
    const playerTwoAiCheckbox = document.getElementById("toggle-player2")

    playerOneAiCheckbox.addEventListener('change', game.player1.enableOrDisableAi.bind(game.player1));
    playerTwoAiCheckbox.addEventListener('change', game.player2.enableOrDisableAi.bind(game.player2));


    const editButton = document.querySelectorAll('.edit-name')

    const editNameListener = (e) => {
        const nameInput = document.createElement('input');
        nameInput.type = 'text'
        const displayName = e.target.previousElementSibling
        
        if (e.target.parentNode.parentNode.id == 'player1') {
            nameInput.value = game.player1.name
        }
        else if (e.target.parentNode.parentNode.id == 'player2') {
            nameInput.value = game.player2.name
        }
    
        const setName = (e) => {
            if (e.target.parentNode.parentNode.id == 'player1') {
                game.player1.name = nameInput.value
            }
            else if (e.target.parentNode.parentNode.id == 'player2') {
                game.player2.name = nameInput.value
            }
            displayName.textContent = nameInput.value
            e.target.parentNode.replaceChild(displayName, e.target)
        }
    
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                setName(event);
            }
        }
    
        nameInput.addEventListener('keydown', handleKeyDown)
        nameInput.addEventListener('blur', setName)
        e.target.parentNode.replaceChild(nameInput, e.target.previousElementSibling)  
        nameInput.focus()
    }
    
    const addEditListener = () => {
        for (let i = 0 ; i < editButton.length; i++) {
            editButton[i].addEventListener('click', editNameListener)
        }
    }
    

    return {
        createNewGameBtn,
        addEditListener
    }
})()

buttons.createNewGameBtn()
buttons.addEditListener()
game.newGame()



