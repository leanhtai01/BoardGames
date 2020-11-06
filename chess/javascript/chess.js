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

        if (/^square*/.test(e.target.className)) {
            e.target.appendChild(draggedPiece);
        }
    }, false);
}