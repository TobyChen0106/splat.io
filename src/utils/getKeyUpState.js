export const getKeyUpState = (e, state) => {
    var dir = state.playerMoveDirection;
    var key = state.keyStrokeState;

    switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':

            if (key.down === 1) dir.y = 1;
            else dir.y = 0;

            key.up = 0;
            break;

        case 's':
        case 'S':
        case 'ArrowDown':

            if (key.up === 1) dir.y = -1;
            else dir.y = 0;

            key.down = 0;
            break;

        case 'a':
        case 'A':
        case 'ArrowLeft':

            if (key.right === 1) dir.x = 1;
            else dir.x = 0;

            key.left = 0;
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            if (key.left === 1) dir.x = -1;
            else dir.x = 0;

            key.right = 0;
            break;

        case ' ':
            key.space = 0;
            break;
        default:
            break;
    }
    return {
        keyStrokeState: key,
        playerMoveDirection: dir
    };
}