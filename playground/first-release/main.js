const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const game = createGame();
const keyboardListenner = createKeyboardListenner();
keyboardListenner.subscribe(game.movePlayer);
renderScreen();

game.addPlayer(
    {
        playerId: 'player1',
        x: 0,
        y: 0
    });

game.addPlayer(
    {
        playerId: 'player2',
        x: 0,
        y: 0
    });
game.addFruit(
    {
        fruitId: 'fruit1',
        x: 2,
        y: 2
    });

function createGame() {

    const state = {
        players: {},
        fruits: {}
    };

    function addPlayer(command) {

        state.players[command.playerId] = {
            x: command.x,
            y: command.y
        }

    }
    function removePlayer(command) {

        delete state.players[command.playerId];
    }

    function addFruit(command) {

        state.fruits[command.fruitId] = {
            x: command.x,
            y: command.y
        }

    }
    function removeFruit(command) {

        delete state.fruits[command.fruitId];
    }

    function movePlayer(command) {

        console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

        const player = game.state.players[command.playerId];

        const acceptedMoves = {
            ArrowUp() {
                if (command.keyPressed == 'ArrowUp' && player.y > 0) {
                    console.log(command.keyPressed);
                    player.y--;
                }
            },
            ArrowDown() {
                if (command.keyPressed == 'ArrowDown' && player.y + 1 < screen.height) {
                    console.log(command.keyPressed);
                    player.y++;
                }
            },
            ArrowLeft() {
                if (command.keyPressed == 'ArrowLeft' && player.x > 0) {

                    console.log(command.keyPressed);
                    player.x--;
                }
            },
            ArrowRight() {
                if (command.keyPressed == 'ArrowRight' && player.x + 1 < screen.width) {

                    console.log(command.keyPressed);
                    player.x++;
                }
            }
        }
        const moveFunction = acceptedMoves[command.keyPressed];
        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(command.playerId);

        }

    }

    function checkForFruitCollision(playerId) {

        const player = state.players[playerId];
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Cheking ${playerId} and ${fruitId}`);

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLLISION between ${player.playerId} and ${fruitId}`)
                removeFruit({ fruitId });
            }


        }
    }

    return {
        movePlayer,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        state
    }
}


function createKeyboardListenner() {

    const state = {
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        console.log(`Notifiying ${state.observers.length} observers`);
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {

        const command = {
            playerId: 'player1',
            keyPressed: event.key
        }

        notifyAll(command);
    }

    return {
        subscribe
    };

}

function renderScreen() {

    context.clearRect(0, 0, screen.width, screen.height);

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, 1, 1);
    }

    for (const fruitID in game.state.fruits) {
        const fruit = game.state.fruits[fruitID];
        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }

    window.requestAnimationFrame(renderScreen);
}