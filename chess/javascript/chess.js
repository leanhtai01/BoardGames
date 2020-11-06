let pieces = document.querySelectorAll(".piece");
let squares = document.querySelectorAll(".square");
let prevSelectedPiece = null;
let draggedPiece = null;

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

// binding events to squares
for (let square of squares) {
    square.addEventListener("click", function(e) {
        let currSquareId = e.target.id;
        let currSquare = document.getElementById(currSquareId);

        if (currSquare !== null && prevSelectedPiece !== null) {
            currSquare.appendChild(prevSelectedPiece);
            prevSelectedPiece.classList.remove("selected");
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
    }, false);
}