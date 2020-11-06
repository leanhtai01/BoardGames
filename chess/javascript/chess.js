let pieces = document.querySelectorAll(".piece");
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

// binding events to pieces
for (let piece of pieces) {
    piece.addEventListener("click", markSelected, false);
}