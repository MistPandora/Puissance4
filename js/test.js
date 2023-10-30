/* /!\ A noter que dans ce test, l'index i correspond aux lignes et j, aux colonnes (contrairement à dans script.js) /!\  */


const checkWinner = (gameArray) => {

    let arr = gameArray;
    let winner;


    //Test horizontal

    for (let i = 0; i < arr.length; i++) {

        for (let j = 0; j <= 3; j++) {

            if (arr[i][j] !== " " && arr[i][j] === arr[i][j + 1] && arr[i][j + 1] === arr[i][j + 2] && arr[i][j + 2] === arr[i][j + 3]) {
                return arr[i][j] == yellowPawn ? winner = "yellow" : winner = "red"
            }

        }

    }

    //Test vertical

    for (let i = 0; i <= 2; i++) {

        for (let j = 0; j < arr[i].length; j++) {

            if (arr[i][j] !== " " && arr[i][j] === arr[i + 1][j] && arr[i + 1][j] === arr[i + 2][j] && arr[i + 2][j] === arr[i + 3][j]) {

                return arr[i][j] == yellowPawn ? winner = "yellow" : winner = "red"
            }

        }

    }

    //Test diagonal

    for (let i = 0; i < arr.length; i++) {

        for (let j = 0; j < arr[i].length; j++) {


            // Check la diagonale vers le bas à droite
            if (i + 3 < arr.length) {
                if (j + 3 < arr[i].length) {
                    if (arr[i + 3][j + 3]) {
                        if (!(arr[i + 1][j + 1] === undefined || arr[i + 2][j + 2] === undefined || arr[i + 3][j + 3] === undefined)) {
                            if (arr[i][j] !== " " && arr[i][j] === arr[i + 1][j + 1] && arr[i + 1][j + 1] === arr[i + 2][j + 2] && arr[i + 2][j + 2] === arr[i + 3][j + 3]) {
                                return arr[i][j] == yellowPawn ? winner = "yellow" : winner = "red"
                            }
                        }
                    }
                }
            }

            //Check la diagonale vers le bas à gauche

            if (i + 3 < arr.length) {
                if (j - 3 >= 0) {
                    if (arr[i + 3][j - 3]) {
                        if (arr[i][j] !== " " && arr[i][j] === arr[i + 1][j - 1] && arr[i + 1][j - 1] === arr[i + 2][j - 2] && arr[i + 2][j - 2] === arr[i + 3][j - 3]) {
                            return arr[i][j] == yellowPawn ? winner = "yellow" : winner = "red"
                        }
                    }
                }
            }

        }

    }

    return winner === undefined ? "null" : winner;
}

