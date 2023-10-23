//make height etc instance attributes on class; 
class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
  
    this.players = [p1, p2];
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.currPlayer = p1;
  //the methods that set up the gameboard; invoke in constructor to make sure board is inititialized;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;

  }
 
  //- Move the current functions onto the class as methods
  // - This will require mildly rewriting some of these to change how you access variables and call other methods
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      //create array with specific length
      //push new array into this.board [];
      //length:this.WIDTH specifies number of elements in new array
      this.board.push(Array.from({length:this.WIDTH}));
    }
  }
  
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
   
    //selects <table>
    const board = document.getElementById('board');
     //reset board
    board.innerHTML = '';
    //when execute method...
    // make column tops (clickable area for adding a piece to that column)
    const topRow = document.createElement('tr');
    //how does it know to put the tr at the top above the other rows?
    topRow.setAttribute('id', 'column-top');
 // store a reference to the handleClick bound function 
    // so that we can correctly remove the event listener later
    //permanently bind ('this') to a certain value
    this.handleGameClick = this.handleClick.bind(this);
    //adds an event listener to the recently created top row; upon click, will execute handClick function specified down below as a separate function
    topRow.addEventListener('click', this.handleGameClick);

  //when makeHtmlBoard() method is called, will execute this for loop as well;
  //this.WIDTH is 7, so itereates 0 - 6. 
    for (let x = 0; x < this.WIDTH; x++) {
      //the above doesn't seem to be looping over anything; just looping certain number of times;
      const headCell = document.createElement('td');
      //create <td id='0'></td>; in this case, td is a box; doesn't have text.
      headCell.setAttribute('id', x);
      //so appends 7 tds to the top row.
      topRow.append(headCell);
    }
  //runs the above loop 7 times, then appends all the new td boxes in the top row to the table (because tr is inline?)
    board.append(topRow);
  
    // make main part of board; loop executed when method makeHtmlBoard is called;
    //The HEIGHT is 6.  So iterates 0 - 5.
    for (let y = 0; y < this.HEIGHT; y++) {
      //for each iteration, creates new table row
      const row = document.createElement('tr');
      //for each iteration of the above, the below loop iterates 7 times; 
      //creates table data box and sets its id to current iteration of 7 and within each iteration, current iteration of 6
      for (let x = 0; x < this.WIDTH; x++) {
        //iterates 6 times for each iteration of the for loop directly above
         //creates table data box and sets its id to itereation number for y/height and iteration number for x/width
        const cell = document.createElement('td');
        //which is column and which is row?
        cell.setAttribute('id', `${y}-${x}`);
        //appends td to each new table row created
        row.append(cell);
      }
  //appends each new table row to entire table/board
      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
 //find first available spot in a row of a specified column x;  may be short for find spot for Color; x is the var for the event.target.id.   which ever top row column the user clicks on, will look to see if there is a disk there already; this just finds the spot; it doesn't add the color disk
 //will be called using handleClick method
  findSpotForCol(x) {
    //starts iteration from bottom row;
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
//so if not on particular spot on table, return y; 
//checks if element in current row y and specified column x is falsy; checks to see if that box is empty; y is index for row; x is index for col;
      if (!this.board[y][x]) {
//where is the return stored?
        return y;
      }
    }
    return null;
  }
    /** placeInTable: update DOM to place piece into HTML table of board */
    //will be called in handleClick method
    //y is the return value for findspot function; x is the event.target.id
  placeInTable(y, x) {
    const piece = document.createElement('div');
    //add 'piece' as class to new div element
    piece.classList.add('piece');
    //add 'p${currPlayer} as class atribute for the new div element;
    //not sure what 'p' is;
    piece.classList.add(`p${currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;
    //style the newly added div element
    piece.style.top = -50 * (y + 2);
    //get html element using id: #`${y}-${x}`
    const spot = document.getElementById(`${y}-${x}`);
    //append newly created div element (piece) to element we just got by id(spot);
    spot.append(piece);
  }
/** endGame: announce game end */
//will be called in handleClick method
  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }
  

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    
    // get x from ID of clicked td box;
    //so each td box has its own id; id was included when each td created; id based on iteration number
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
//this function has already been defined above
    const y = this.findSpotForCol(x);
    //y might equal null b/c the function returns null if it doesn't find an empty box.
    if (y === null) {
      //does this stop executing the handleclick function?
      return;
    }
    // place piece in board and add to HTML table
    //y is return value for funct findspot.  x is event.target.  not sure where currPlayer is.  it may be below
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    // check for win; this function is defined below
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} won!`);
    }
    
    // switch players
    this.currPlayer = 
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  //will call in handleClick method
  checkForWin() {
    const _win = cells =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        };
      };
    };
  };
};

class Player {
  constructor(color) {
    this.color = color;
  }
}
//mine
document.getElementById('start-game').addEventListener('click', () => {
  //create first player object and assign a value to the color property;
  let p1 = new Player(document.getElementById('player1Color').value);
  //create second player object and assign a value to the color property
  let p2 = new Player(document.getElementById('player2Color').value);
  new Game(p1, p2);
});

// newGame.makeBoard();
// newGame.makeHtmlBoard();

//new Game(6, 7);   

// assuming constructor takes height, width

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// const WIDTH = 7;
// const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

// function makeBoard() {
//   for (let y = 0; y < HEIGHT; y++) {
//     board.push(Array.from({ length: WIDTH }));
//   }
// }

/** makeHtmlBoard: make HTML table and row of column tops. */
// function makeHtmlBoard() {
//   const board = document.getElementById('board');

//   // make column tops (clickable area for adding a piece to that column)
//   const top = document.createElement('tr');
//   top.setAttribute('id', 'column-top');
//   top.addEventListener('click', handleClick);

//   for (let x = 0; x < WIDTH; x++) {
//     const headCell = document.createElement('td');
//     headCell.setAttribute('id', x);
//     top.append(headCell);
//   }

//   board.append(top);

//   // make main part of board
//   for (let y = 0; y < HEIGHT; y++) {
//     const row = document.createElement('tr');

//     for (let x = 0; x < WIDTH; x++) {
//       const cell = document.createElement('td');
//       cell.setAttribute('id', `${y}-${x}`);
//       row.append(cell);
//     }

//     board.append(row);
//   }
// }

// /** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
//   for (let y = HEIGHT - 1; y >= 0; y--) {
//     if (!board[y][x]) {
//       return y;
//     }
//   }
//   return null;
// }

/** placeInTable: update DOM to place piece into HTML table of board */

// function placeInTable(y, x) {
//   const piece = document.createElement('div');
//   piece.classList.add('piece');
//   piece.classList.add(`p${currPlayer}`);
//   piece.style.top = -50 * (y + 2);

//   const spot = document.getElementById(`${y}-${x}`);
//   spot.append(piece);
// }

/** endGame: announce game end */

// function endGame(msg) {
//   alert(msg);
// }

/** handleClick: handle click of column top to play piece */

// function handleClick(evt) {
//   // get x from ID of clicked cell
//   const x = +evt.target.id;

//   // get next spot in column (if none, ignore click)
//   const y = findSpotForCol(x);
//   if (y === null) {
//     return;
//   }

//   // place piece in board and add to HTML table
//   board[y][x] = currPlayer;
//   placeInTable(y, x);
  
//   // check for win
//   if (checkForWin()) {
//     return endGame(`Player ${currPlayer} won!`);
//   }
  
//   // check for tie
//   if (board.every(row => row.every(cell => cell))) {
//     return endGame('Tie!');
//   }
    
//   // switch players
//   currPlayer = currPlayer === 1 ? 2 : 1;
// }

/** checkForWin: check board cell-by-cell for "does a win start here?" */

// function checkForWin() {
//   function _win(cells) {
//     // Check four cells to see if they're all color of current player
//     //  - cells: list of four (y, x) cells
//     //  - returns true if all are legal coordinates & all match currPlayer

//     return cells.every(
//       ([y, x]) =>
//         y >= 0 &&
//         y < HEIGHT &&
//         x >= 0 &&
//         x < WIDTH &&
//         board[y][x] === currPlayer
//     );
//   }

//   for (let y = 0; y < HEIGHT; y++) {
//     for (let x = 0; x < WIDTH; x++) {
//       // get "check list" of 4 cells (starting here) for each of the different
//       // ways to win
//       const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
//       const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
//       const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
//       const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

//       // find winner (only checking each win-possibility as needed)
//       if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
//         return true;
//       }
//     }
//   }
// }

// makeBoard();
// makeHtmlBoard();
