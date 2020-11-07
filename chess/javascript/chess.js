let pieces = document.querySelectorAll(".piece");
let squares = document.querySelectorAll(".square");
let prevSelectedPiece = null;
let draggedPiece = null;
let validMoves = null; // => ["00", "01", "02",...]
const MINROW = 0;
const MINCOL = 0;
const MAXROW = 7;
const MAXCOL = 7;

// binding events to pieces
for (let piece of pieces) {
    piece.setAttribute("draggable", "true");
    piece.addEventListener("click", function(e) {
        let currSelectedPiece = e.target;

        if (currSelectedPiece !== prevSelectedPiece) {
            if (prevSelectedPiece !== null) {
                let attackPlayer = prevSelectedPiece.getAttribute("player");
                let attackedPlayer = currSelectedPiece.getAttribute("player");

                if (attackPlayer !== attackedPlayer) {
                    let attackedSquareId = currSelectedPiece.parentElement.id;
                    let attackedSquare = document.getElementById(attackedSquareId);

                    if (validMoves.indexOf(attackedSquare.id) != -1) {
                        attackedSquare.removeChild(attackedSquare.firstChild);
                        attackedSquare.appendChild(prevSelectedPiece);
                    }
                }

                prevSelectedPiece.classList.remove("selected");
                prevSelectedPiece = null;
                removeValidMoveMark();
            }
            else {
                displayValidMoves(currSelectedPiece);
                prevSelectedPiece = currSelectedPiece;
                currSelectedPiece.classList.toggle("selected");
            }
        }
        else {
            prevSelectedPiece = null;
            currSelectedPiece.classList.toggle("selected");
            removeValidMoveMark();
        }
    }, false);

    piece.addEventListener("dragstart", function(e) {
        draggedPiece = e.target;
        displayValidMoves(draggedPiece);
    }, false);

    // piece.addEventListener("dragend", function(e) {
    //     removeValidMoveMark();
    // }, false);
}

// function remove validMove mark from squares
function removeValidMoveMark()
{
    for (let square of squares) {
        if (square.classList.contains("validMove")) {
            square.classList.remove("validMove");
        }
    }
}

// function display valid moves
function displayValidMoves(currSelectedPiece) {
    // determine current piece's name
    let currSelectedPieceName = currSelectedPiece.getAttribute("name");

    // determine current square
    let currSquareId = currSelectedPiece.parentElement.id;
    let currSquare = document.getElementById(currSquareId);

    // determine current row and column of square
    let currSelectedSquareRow = parseInt(currSquare.getAttribute("row"));
    let currSelectedSquareCol = parseInt(currSquare.getAttribute("column"));

    // generate valid moves
    validMoves = genValidMoves(currSelectedPieceName, currSelectedSquareRow, currSelectedSquareCol);

    // display valid moves
    for (let move of validMoves) {
        document.getElementById(move).classList.add("validMove");
    }
}

// function generate valid moves of a selectedPiece
function genValidMoves(currSelectedPieceName, currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = null;

    switch (currSelectedPieceName) {
        case "rook":
            validMoves = genValidMovesRook(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "knight":
            validMoves = genValidMovesKnight(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "bishop":
            validMoves = genValidMovesBishop(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "queen":
            validMoves = genValidMovesQueen(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "king":
            validMoves = genValidMovesKing(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "pawn":
            validMoves = genValidMovesPawn(currSelectedSquareRow, currSelectedSquareCol);
            break;
    }

    return validMoves;
}

// function generate valid moves of Rook
function genValidMovesRook(currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    // add valid moves to down of the screen
    let tmp = currSelectedSquareRow;
    while ((tmp + 1) <= MAXROW) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }

            tmp = MAXROW; // get out of while loop
        }
    }

    // add valid moves to up of the screen
    tmp = currSelectedSquareRow;
    while ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }

            tmp = 0; // get out of while loop
        }
    }

    // add valid moves to left of the screen
    tmp = currSelectedSquareCol;
    while ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }

            tmp = 0; // get out of while loop
        }
    }

    // add valid moves to right of the screen
    tmp = currSelectedSquareCol;
    while ((tmp + 1) <= MAXCOL) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }

            tmp = MAXCOL; // get out of while loop
        }
    }

    return validMoves;
}

// function generate valid moves for Knight
function genValidMovesKnight(currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    // add valid moves to down of the screen
    let tmpRow = currSelectedSquareRow;
    let tmpCol = currSelectedSquareCol;

    if ((tmpRow + 2) <= MAXROW && (tmpCol - 1) >= 0) { // 1st down position
        tmpRow += 2;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow + 2) <= MAXROW && (tmpCol + 1) <= MAXCOL) { // 2nd down position
        tmpRow += 2;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }
    
    // add valid moves to up of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 2) >= 0 && (tmpCol - 1) >= 0) { // 1st up position
        tmpRow -= 2;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 2) >= 0 && (tmpCol + 1) <= MAXCOL) { // 2nd up position
        tmpRow -= 2;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    // add valid moves to left of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 1) >= 0 && (tmpCol - 2) >= 0) { // 1st left position
        tmpRow--;
        tmpCol -= 2;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow + 1) <= MAXROW && (tmpCol - 2) >= 0) { // 2nd left position
        tmpRow++;
        tmpCol -= 2;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    // add valid moves to right of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 1) >= 0 && (tmpCol + 2) <= MAXCOL) { // 1st right position
        tmpRow--;
        tmpCol += 2;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow + 1) <= MAXROW && (tmpCol + 2) <= MAXCOL) { // 2nd right position
        tmpRow++;
        tmpCol += 2;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    return validMoves;
}

// function generate valid moves for Bishop
function genValidMovesBishop(currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    // add valid moves to down of the screen
    let tmpRow = currSelectedSquareRow;
    let tmpCol = currSelectedSquareCol;

    while ((tmpRow + 1) <= MAXROW && (tmpCol - 1) >= MINCOL) {
        tmpRow++;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MAXROW; // get out of while loop
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow + 1) <= MAXROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow++;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MAXROW; // get out of while loop
        }
    }
    
    // add valid moves to up of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow - 1) >= MINROW && (tmpCol - 1) >= MINCOL) {
        tmpRow--;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MINROW; // get out of while loop
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow - 1) >= MINROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow--;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MINROW; // get out of while loop
        }
    }
    
    return validMoves;
}

// function generate valid move for Queen
function genValidMovesQueen(currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    // add valid moves to down of the screen
    let tmp = currSelectedSquareRow;
    while ((tmp + 1) <= MAXROW) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }

            tmp = MAXROW; // get out of while loop
        }
    }

    // add valid moves to up of the screen
    tmp = currSelectedSquareRow;
    while ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }

            tmp = 0; // get out of while loop
        }
    }

    // add valid moves to left of the screen
    tmp = currSelectedSquareCol;
    while ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }

            tmp = 0; // get out of while loop
        }
    }

    // add valid moves to right of the screen
    tmp = currSelectedSquareCol;
    while ((tmp + 1) <= MAXCOL) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }

            tmp = MAXCOL; // get out of while loop
        }
    }

    // add valid moves on diagonals
    // add valid moves to down of the screen
    let tmpRow = currSelectedSquareRow;
    let tmpCol = currSelectedSquareCol;

    while ((tmpRow + 1) <= MAXROW && (tmpCol - 1) >= MINCOL) {
        tmpRow++;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MAXROW; // get out of while loop
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow + 1) <= MAXROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow++;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MAXROW; // get out of while loop
        }
    }
    
    // add valid moves to up of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow - 1) >= MINROW && (tmpCol - 1) >= MINCOL) {
        tmpRow--;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MINROW; // get out of while loop
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    while ((tmpRow - 1) >= MINROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow--;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }

            tmpRow = MINROW; // get out of while loop
        }
    }

    return validMoves;
}

// function generate valid move for King
function genValidMovesKing(currSelectedSquareRow, currSelectedSquareCol) {
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    // add valid moves to down of the screen
    let tmp = currSelectedSquareRow;
    if ((tmp + 1) <= MAXROW) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }
        }
    }

    // add valid moves to up of the screen
    tmp = currSelectedSquareRow;
    if ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(tmp, currSelectedSquareCol));

        if (nextPlayer == null) { // next square empty
            validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(tmp.toString() + currSelectedSquareCol.toString());
            }
        }
    }

    // add valid moves to left of the screen
    tmp = currSelectedSquareCol;
    if ((tmp - 1) >= 0) {
        tmp--;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }
        }
    }

    // add valid moves to right of the screen
    tmp = currSelectedSquareCol;
    if ((tmp + 1) <= MAXCOL) {
        tmp++;

        // determine what player occupied next square (if any)
        let nextPlayer = getPlayer(getSquare(currSelectedSquareRow, tmp));

        if (nextPlayer == null) { // next square empty
            validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
        }
        else {
            if (currPlayer != nextPlayer) {
                validMoves.push(currSelectedSquareRow.toString() + tmp.toString());
            }
        }
    }

    // add valid moves on diagonals
    // add valid moves to down of the screen
    let tmpRow = currSelectedSquareRow;
    let tmpCol = currSelectedSquareCol;

    if ((tmpRow + 1) <= MAXROW && (tmpCol - 1) >= MINCOL) {
        tmpRow++;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow + 1) <= MAXROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow++;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }
    
    // add valid moves to up of the screen
    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 1) >= MINROW && (tmpCol - 1) >= MINCOL) {
        tmpRow--;
        tmpCol--;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    tmpRow = currSelectedSquareRow;
    tmpCol = currSelectedSquareCol;
    if ((tmpRow - 1) >= MINROW && (tmpCol + 1) <= MAXCOL) {
        tmpRow--;
        tmpCol++;

        // check what player occupied destination square
        let destPlayer = getPlayer(getSquare(tmpRow, tmpCol));

        if (destPlayer == null) { // destination square empty
            validMoves.push(tmpRow.toString() + tmpCol.toString());
        }
        else {
            if (currPlayer != destPlayer) {
                validMoves.push(tmpRow.toString() + tmpCol.toString());
            }
        }
    }

    return validMoves;
}

// function generate valid move for Pawn
function genValidMovesPawn(currSelectedSquareRow, currSelectedSquareCol)
{
    let validMoves = [];

    // determine current square
    let currSquare = getSquare(currSelectedSquareRow, currSelectedSquareCol);
    
    // determine the player current piece belong to
    let currPlayer = getPlayer(currSquare);

    if (currPlayer === "white") {
        // add valid move to up of the screen
        let tmpRow = currSelectedSquareRow;

        // move to empty squares
        if ((tmpRow - 1) >= MINROW) {
            tmpRow--;

            // determine what player occupied up square (if any)
            let upPlayer = getPlayer(getSquare(tmpRow, currSelectedSquareCol));

            if (upPlayer == null) { // up square empty
                validMoves.push(tmpRow.toString() + currSelectedSquareCol.toString());

                if (currSelectedSquareRow === (MAXROW - 1)) { // in start, pawn can move up 2 square
                    // determine what player occupied up square (if any)
                    let upPlayer = getPlayer(getSquare(tmpRow - 1, currSelectedSquareCol));

                    if (upPlayer == null) {
                        validMoves.push((tmpRow - 1).toString() + currSelectedSquareCol.toString());
                    }
                }
            }
        }

        // attack other pieces
        // attack left square
        tmpRow = currSelectedSquareRow;
        let tmpCol = currSelectedSquareCol;
        
        if ((tmpRow - 1) >= MINROW && (tmpCol - 1) >= MINCOL) {
            tmpRow--;
            tmpCol--;

            // determine what player occupied left square (if any)
            let leftPlayer = getPlayer(getSquare(tmpRow, tmpCol));

            if (leftPlayer != null) {
                if (currPlayer != leftPlayer) {
                    validMoves.push(tmpRow.toString() + tmpCol.toString());
                }
            }
        }

        // attack right square
        tmpRow = currSelectedSquareRow;
        tmpCol = currSelectedSquareCol;
        
        if ((tmpRow - 1) >= MINROW && (tmpCol + 1) >= MINCOL) {
            tmpRow--;
            tmpCol++;

            // determine what player occupied left square (if any)
            let rightPlayer = getPlayer(getSquare(tmpRow, tmpCol));

            if (rightPlayer != null) {
                if (currPlayer != rightPlayer) {
                    validMoves.push(tmpRow.toString() + tmpCol.toString());
                }
            }
        }
    }
    else {
        // add valid move to down of the screen
        let tmpRow = currSelectedSquareRow;

        // move to empty squares
        if ((tmpRow + 1) <= MAXROW) {
            tmpRow++;

            // determine what player occupied up square (if any)
            let downPlayer = getPlayer(getSquare(tmpRow, currSelectedSquareCol));

            if (downPlayer == null) { // up square empty
                validMoves.push(tmpRow.toString() + currSelectedSquareCol.toString());

                if (currSelectedSquareRow === (MINROW + 1)) { // in start, pawn can move up 2 square
                    // determine what player occupied up square (if any)
                    let downPlayer = getPlayer(getSquare(tmpRow + 1, currSelectedSquareCol));

                    if (downPlayer == null) {
                        validMoves.push((tmpRow + 1).toString() + currSelectedSquareCol.toString());
                    }
                }
            }
        }

        // attack other pieces
        // attack left square
        tmpRow = currSelectedSquareRow;
        let tmpCol = currSelectedSquareCol;
        
        if ((tmpRow + 1) <= MAXROW && (tmpCol - 1) >= MINCOL) {
            tmpRow++;
            tmpCol--;

            // determine what player occupied left square (if any)
            let leftPlayer = getPlayer(getSquare(tmpRow, tmpCol));

            if (leftPlayer != null) {
                if (currPlayer != leftPlayer) {
                    validMoves.push(tmpRow.toString() + tmpCol.toString());
                }
            }
        }

        // attack right square
        tmpRow = currSelectedSquareRow;
        tmpCol = currSelectedSquareCol;
        
        if ((tmpRow + 1) >= MINROW && (tmpCol + 1) >= MINCOL) {
            tmpRow++;
            tmpCol++;

            // determine what player occupied left square (if any)
            let rightPlayer = getPlayer(getSquare(tmpRow, tmpCol));

            if (rightPlayer != null) {
                if (currPlayer != rightPlayer) {
                    validMoves.push(tmpRow.toString() + tmpCol.toString());
                }
            }
        }
    }

    return validMoves;
}

// determine the player current piece belong to give square
function getPlayer(currSquare) {
    let piece = currSquare.firstChild;

    return piece ? piece.getAttribute("player") : null;
}

// get square know row and column
function getSquare(currSelectedSquareRow, currSelectedSquareCol) {
    let currSquareId = currSelectedSquareRow.toString() + currSelectedSquareCol.toString();
    let currSquare = document.getElementById(currSquareId);

    return currSquare;
}

// binding events to squares
for (let square of squares) {
    square.addEventListener("click", function(e) {
        let currSquareId = e.target.id;
        let currSquare = document.getElementById(currSquareId);

        if (currSquare !== null && prevSelectedPiece !== null && validMoves.indexOf(currSquareId) != -1) {
            currSquare.appendChild(prevSelectedPiece);
            if (prevSelectedPiece.classList.contains("selected")) {
                prevSelectedPiece.classList.remove("selected");
            }

            prevSelectedPiece = null;
            removeValidMoveMark();
        }
    }, false);

    square.addEventListener("dragover", function(e) {
        e.preventDefault();
    }, false);

    square.addEventListener("drop", function(e) {
        e.preventDefault();

        if (/^square*/.test(e.target.className) && (validMoves.indexOf(e.target.id) != -1)) { // drop into empty square
            e.target.appendChild(draggedPiece);
        }
        else { // attack other piece
            let attackPlayer = draggedPiece.getAttribute("player");
            let attackedPlayer = e.target.getAttribute("player");

            if (attackPlayer !== attackedPlayer) {
                let attackedSquareId = e.target.parentElement.id;
                let attackedSquare = document.getElementById(attackedSquareId);

                if (attackedSquare != null /*&& validMoves.indexOf(attackedSquare.id) != -1*/) {
                    attackedSquare.removeChild(attackedSquare.firstChild);
                    attackedSquare.appendChild(draggedPiece);
                }
            }
        }

        if (prevSelectedPiece != null && prevSelectedPiece.classList.contains("selected")) {
            prevSelectedPiece.classList.remove("selected");
        }
        prevSelectedPiece = null;
        removeValidMoveMark();
    }, false);
}