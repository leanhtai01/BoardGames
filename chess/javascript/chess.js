let pieces = document.querySelectorAll(".piece");
let squares = document.querySelectorAll(".square");
let prevSelectedPiece = null;

function markSelected(e) {
    let currSelectedPiece = e.target;

    if (currSelectedPiece !== prevSelectedPiece) {
        if (prevSelectedPiece !== null) {
            // let prevSquareId = prevSelectedPiece.parentElement.id;
            // let currSquareId = currSelectedPiece.parentElement.id;
            // let prevSquare = document.getElementById(prevSquareId);
            // let currSquare = document.getElementById(currSquareId);

            prevSelectedPiece.classList.remove("selected");
            // currSquare.removeChild(currSquare.firstChild);
            // currSquare.appendChild(prevSelectedPiece);
            // currSelectedPiece = currSquare.firstChild;
        }
    }

    currSelectedPiece.classList.toggle("selected");
    prevSelectedPiece = currSelectedPiece;
}

function movePieceToEmptySquare(e) {
    let currSquareId = e.target.id;
    let currSquare = document.getElementById(currSquareId);

    currSquare.appendChild(prevSelectedPiece);
    prevSelectedPiece.classList.remove("selected");
    prevSelectedPiece = null;
}

// binding events to pieces
for (let piece of pieces) {
    piece.addEventListener("click", markSelected, false);
}

// binding events to squares
for (let square of squares) {
    square.addEventListener("click", movePieceToEmptySquare, false);
}