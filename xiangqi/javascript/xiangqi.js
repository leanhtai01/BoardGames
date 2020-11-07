let pieces = document.querySelectorAll(".piece");
let squares = document.querySelectorAll(".square");
let prevSelectedPiece = null;
let draggedPiece = null;
let validMoves = null; // => ["00", "01", "02",...]
const MAXROW = 9;
const MAXCOL = 8;

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

                    attackedSquare.removeChild(attackedSquare.firstChild);
                    attackedSquare.appendChild(prevSelectedPiece);
                }

                prevSelectedPiece.classList.remove("selected");
                prevSelectedPiece = null;
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
        }
    }, false);

    piece.addEventListener("dragstart", function(e) {
        draggedPiece = e.target;
    }, false);
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
        case "chariot":
            validMoves = genValidMovesChariot(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "horse":
            validMoves = getValidMovesHorse(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "elephant":
            validMoves = getValidMovesElephant(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "mandarin":
            validMoves = getValidMovesMandarin(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "cannon":
            validMoves = getValidMovesCannon(currSelectedSquareRow, currSelectedSquareCol);
            break;
        case "sodier":
            validMoves = getValidMovesSodier(currSelectedSquareRow, currSelectedSquareCol);
            break;
    }

    return validMoves;
}

// function generate valid moves of Chariot
function genValidMovesChariot(currSelectedSquareRow, currSelectedSquareCol) {
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

        if (currSquare !== null && prevSelectedPiece !== null) {
            currSquare.appendChild(prevSelectedPiece);
            if (prevSelectedPiece.classList.contains("selected")) {
                prevSelectedPiece.classList.remove("selected");
            }
            prevSelectedPiece = null;
        }
    }, false);

    square.addEventListener("dragover", function(e) {
        e.preventDefault();
    }, false);

    square.addEventListener("drop", function(e) {
        e.preventDefault();

        if (/^square*/.test(e.target.className)) { // drop into empty square
            e.target.appendChild(draggedPiece);
        }
        else { // attack other piece
            let attackPlayer = draggedPiece.getAttribute("player");
            let attackedPlayer = e.target.getAttribute("player");

            if (attackPlayer !== attackedPlayer) {
                let attackedSquareId = e.target.parentElement.id;
                let attackedSquare = document.getElementById(attackedSquareId);

                attackedSquare.removeChild(attackedSquare.firstChild);
                attackedSquare.appendChild(draggedPiece);
            }
        }

        if (prevSelectedPiece != null && prevSelectedPiece.classList.contains("selected")) {
            prevSelectedPiece.classList.remove("selected");
        }
        prevSelectedPiece = null;
    }, false);
}