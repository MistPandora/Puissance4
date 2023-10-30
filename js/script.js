class Player {
    constructor(username, color) {
        this.username = username;
        this.pawn = color;
        this.score = 0;
    }
}

const yellowPawn = "🟡";
const redPawn = "🔴";
const startBtns = document.querySelectorAll('.start-btn');
const players = [];
let playerOne;
let playerTwo;




const createPlayers = (startColor, username1, username2) => {
    let firstColor;
    let secondColor;

    if (startColor === "Rouge") {
        firstColor = "red";
        secondColor = "yellow";
    } else {
        firstColor = "yellow";
        secondColor = "red";
    }

    /* Players creation */
    const firstPlayer = new Player(username1, firstColor);
    const secondPlayer = new Player(username2, secondColor);

    playerOne = firstPlayer;
    playerTwo = secondPlayer;

    createGame();
}



const createGame = () => {

    let currentBoard = [
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " ", " "]
    ];


    /* Gaming DOM */
    document.body.innerHTML = `<h1>Coucou</h1><div id="game-zone"><div class="player ${playerOne.pawn}"><p>${playerOne.username}</p><p>Score: <span id="scoreOne">${playerOne.score}</span></p></div><div id="board"><div id="bg-transparent-rounds"></div><div id="bg-board"></div></div><div class="player ${playerTwo.pawn}"><p>${playerTwo.username}</p><p>Score: <span id="scoreTwo">${playerTwo.score}</span></p></div></div>`

    let color = playerOne.pawn; //first color chosen


    const board = document.querySelector("#board");


    /* Gaming board elements creation: START */

    for (let i = 0; i <= 6; i++) { // i : column' index
        let col = i;

        let column = document.createElement("div");
        column.setAttribute('id', `column-${i}`);
        board.appendChild(column);


        for (let j = 5; j >= 0; j--) { // j : row' index and starting at the end (because it's displayed as column-reverse)

            let row = j;

            let round = document.createElement("div");
            round.setAttribute('id', `c-${col}_r-${row}`);
            round.classList.add('round');
            column.appendChild(round);

            row++;

            if (j == 5) {
                row = 0;
            }

        }

        let arrow = document.createElement("p");
        arrow.setAttribute('id', `arrow-${i}`);
        arrow.innerText = '↓'
        column.appendChild(arrow);
    }

    /* Gaming board elements creation: END */


    /* Gameplay: START */

    const arrows = document.querySelectorAll('p[id^="arrow"]');
    const playersElements = document.querySelectorAll('.player');
    let currentPlayerName = playersElements[0].querySelector('p').innerText;

    seePlayerTurn(playersElements, color);

    document.querySelector('h1').innerHTML = `C'est au tour de: <span style="color:${color}">${currentPlayerName}</span>`;

    for (const arrow of arrows) {
        arrow.addEventListener('mouseover', () => {
            arrow.style.color = color;
        })
        arrow.addEventListener('mouseout', () => {
            arrow.style.color = "#000";
        })


        arrow.addEventListener('click', () => {

            const col = arrow.parentNode;
            const colChildren = col.children; // HTMLCollection of the current column's children (where we clicked the arrow)

            for (const child of colChildren) {
                if (child.classList.contains('round')) { // Ignoring the "arrow" child
                    if (!(child.classList.contains('red') || child.classList.contains('yellow'))) {

                        //Adding to view
                        child.classList.add(`${color}`);


                        const childID = child.getAttribute('id'); // example: "c-3_r-4"
                        const positions = childID.match(/[0-9]/g); // [0]: column, [1]: row
                        let newPawn = document.createElement('div');
                        newPawn.setAttribute('class', `pawn ${color}`);
                        newPawn.style.top = "-25px"
                        child.append(newPawn);
                        dropPawn(newPawn, positions[1], arrow);

                        if (positions[1] == 0) {
                            arrow.style.pointerEvents = "none"
                            col.classList.add('complete');
                        }



                        //Adding in the array "boardJS"

                        const pawn = color === "red" ? redPawn : yellowPawn;

                        currentBoard[positions[1]][positions[0]] = pawn;

                        let winner = checkWinner(currentBoard); //Checking if there's a winner at the end of the turn

                        if (winner !== "null") {
                            let winnerName = getPlayerName(playersElements, winner);
                            document.querySelector('h1').innerHTML = `<span style="color:${color}">${winnerName}</span> a gagné !`;

                            for (const col of document.querySelectorAll('div[id^="column"]')) {
                                col.style.pointerEvents = 'none';
                            }

                            //Ajoute un point au gagnant
                            if (playerOne.username == winnerName) {
                                playerOne.score++;
                                document.querySelector('#scoreOne').textContent = playerOne.score;
                            } else {
                                playerTwo.score++
                                document.querySelector('#scoreTwo').textContent = playerTwo.score;
                            }


                            createRefreshButtons(currentBoard);

                            seePlayerTurn(playersElements, 'none');

                            break;

                        } else {

                            let completedCols = 0;

                            for (const col of document.querySelectorAll('div[id^="column"]')) {
                                if (col.classList.length) {
                                    completedCols++
                                }
                            }

                            if (completedCols == 7) {

                                document.querySelector('h1').innerHTML = `La partie est <span style="margin: 0; color:#2d539c">nulle</span> !`;
                                createRefreshButtons(currentBoard);
                                break;

                            }

                        };

                        color === "red" ? color = "yellow" : color = "red";

                        seePlayerTurn(playersElements, color);
                        currentPlayerName = getPlayerName(playersElements, color);
                        document.querySelector('h1').innerHTML = `C'est au tour de: <span style="color:${color}">${currentPlayerName}</span>`;

                        break;
                    }
                }
            }
        })
    }

}

const resetGame = () => {
    const rounds = document.querySelectorAll('.round')
    for (const round of rounds) {
        if (round.classList.contains('yellow')) {
            round.classList.remove('yellow');
        }
        if (round.classList.contains('red')) {
            round.classList.remove('red');
        }
    }

    createGame();
}

const swapPlayerColors = () => {
    playerOne.pawn == "red" ? playerOne.pawn = "yellow" : playerOne.pawn = "red";
    playerTwo.pawn == "red" ? playerTwo.pawn = "yellow" : playerTwo.pawn = "red";
    resetGame();
}

const createRefreshButtons = (board) => {

    let refreshBtn = document.createElement('button'); //Creating refresh button
    refreshBtn.setAttribute('id', 'refreshBtn');
    refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/></svg>';
    document.querySelector('#board').append(refreshBtn);

    let refreshSwapBtn = document.createElement('button'); //Creating refresh button
    refreshSwapBtn.setAttribute('id', 'refreshSwapBtn');
    refreshSwapBtn.innerHTML = '<img src="img/swap-colors.png" />'
    document.querySelector('#board').append(refreshSwapBtn);

    document.querySelector('#refreshBtn').addEventListener('click', () => { resetGame() })
    document.querySelector('#refreshSwapBtn').addEventListener('click', () => { swapPlayerColors(board) })

}

/* Gameplay: END */

/* Creating pawns animation: START */

let interval;

const dropPawn = (element, pawnPos, elCliked) => {

    elCliked.style.pointerEvents = "none"

    let topPos = element.offsetTop;
    clearInterval(interval);

    const frame = () => {
        if (topPos == endPosition) {

            if (pawnPos != 0) {
                elCliked.style.pointerEvents = "auto"
            }

            clearInterval(interval)

        } else if (topPos + 20 > endPosition) {
            topPos += (endPosition - topPos);
            element.style.top = `${topPos}px`

            if (pawnPos != 0) {
                elCliked.style.pointerEvents = "auto"
            }

            clearInterval(interval)
        } else {

            topPos += 20;
            element.style.top = `${topPos}px`
        }
    }

    const endPosition = 26 + (102 * pawnPos);
    interval = setInterval(frame, 2);

}


/* Creating pawns animation: END */


/* Getting players infos to display: START */


const seePlayerTurn = (playersElements, color) => {
    for (const player of playersElements) {
        if (player.classList.contains(color)) {
            player.style.boxShadow = `0 0 15px ${color}`
        } else {
            player.style.boxShadow = 'none';
        }
    }
}

const getPlayerName = (playersElements, color) => {
    for (const player of playersElements) {
        if (player.classList.contains(color)) {
            let currentPlayerName = player.querySelector('p').innerText
            return currentPlayerName;
        }
    }
}

/* Getting players infos to display: END */





/* Can zoom once and then, unzoom once : START */

let scale = 100;

addEventListener('wheel', e => {
    if (e.ctrlKey) {
        if (e.deltaY < 0 && scale === 100) { // Scrolling up
            scale += 10;
            document.body.style.height = scale + "vh";

        } else if (e.deltaY > 0 && scale === 110) { // Scrolling down
            scale -= 10;
            document.body.style.height = scale + "vh";

        } else {
            e.preventDefault()
        }

    }
}, { passive: false })



addEventListener('keydown', key => {
    if (key.ctrlKey) {
        if (key.keyCode == 61 || key.keyCode == 107) { // Plus key
            if (scale === 100) {
                scale += 10;
                document.body.style.height = scale + "vh";
            } else {
                key.preventDefault()
            }

        } else if (key.keyCode == 54 || key.keyCode == 109) { // Minus key
            if (scale === 110) {
                scale -= 10;
                document.body.style.height = scale + "vh";
            } else {
                key.preventDefault()
            }
        }
    }

})

/* Can zoom once and then, unzoom once : END */




for (const btn of startBtns) {

    btn.addEventListener('click', () => {
        let usernameOne = document.querySelector('#username1').value;
        let usernameTwo = document.querySelector('#username2').value;
        const regex1 = /[a-z]/i;
        const regex2 = /[0-9]/;
        if (!regex1.test(usernameOne) && !regex2.test(usernameOne)) {
            usernameOne = "Joueur 1";
        }

        if (!regex1.test(usernameTwo) && !regex2.test(usernameTwo)) {
            usernameTwo = "Joueur 2";
        }
        createPlayers(btn.value, usernameOne, usernameTwo);
    })
}
