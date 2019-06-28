
import { GAME_STATE, PLAYER_STATUS } from '../enum'
import playerSVG from '../images/player/p-01.svg'
import playerHandSVG from '../images/player/p-02.svg'
import gunSVG from '../images/player/p-03.svg'

export const playerWidth = 80;
export const playerHeight = 80;
const handOffset = 30
var img = new Image()
var img2 = new Image()
var img3 = new Image()





export const drawPlayer = (c, state) => {

    var context = c.getContext("2d");
    // attach the context to the canvas for easy access and to reduce complexity.
    context.clearRect(0, 0, c.width, c.height);
    drawPlayerNormal(context, state)
    /*
    switch (state.playerStatus) {
        case PLAYER_STATUS.STANDING_OWN:
            drawPlayerNormal(context, state);
            break;
        case PLAYER_STATUS.WALKING_OWN:
            drawPlayerNormal(context, state);
            break;
        case PLAYER_STATUS.DIVING_OWN:
                drawPlayerName(context, state);
            break;
        case PLAYER_STATUS.SWIMMING_OWN:
                drawPlayerName(context, state);

            break;
        case PLAYER_STATUS.ATTACKING_OWN:
            drawPlayerNormal(context, state);
            break;

        case PLAYER_STATUS.STANDING_SPACE:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.WALKING_SPACE:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.DIVING_SPACE:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.SWIMMING_SPACE:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.ATTACKING_SPACE:
            drawPlayerNormal(context, state);

            break;

        case PLAYER_STATUS.STANDING_ENEMY:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.WALKING_ENEMY:
            drawPlayerNormal(context, state);

            break;
        case PLAYER_STATUS.DIVING_ENEMY:
            break;
        case PLAYER_STATUS.SWIMMING_ENEMY:
            break;
        case PLAYER_STATUS.ATTACKING_ENEMY:
            drawPlayerNormal(context, state);

            break;
        default: break;
    }
    */

}



const drawPlayerNormal = (context, state) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    const playerAngle = state.playerAngle
    const playerStatus = state.playerStatus
    /*
    context.save();
    context.translate(playerPosition.x, playerPosition.y)

    context.save();
    context.rotate(Math.PI / 180 * playerAngle);
    */
    context.save()

    context.translate(playerPosition.x, playerPosition.y)

    context.font = "bold 10pt Freckle Face";
    const playerNameLen = context.measureText(playerName).width;

    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 3;
    context.strokeText(playerName, -playerNameLen / 2, 50)

    context.fillStyle = playerColor;
    context.font = "bold 10pt Freckle Face";

    context.fillText(playerName, -playerNameLen / 2, 50);
    //end of player drawing
    context.restore();


    img.src = playerSVG;
    img2.src = playerHandSVG;
    img3.src = gunSVG;

    context.translate(playerPosition.x, playerPosition.y)
    context.rotate(Math.PI / 180 * (playerAngle + 180));
    context.drawImage(img,-playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight)
    context.drawImage(img2,-playerWidth / 2 - 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)
    context.drawImage(img2,-playerWidth / 2 + 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)
    context.drawImage(img3,-playerWidth / 2 , -playerHeight / 2 + 40, playerWidth, playerHeight)
    context.rotate( - Math.PI / 180 * (playerAngle + 180))
    context.translate(-playerPosition.x, -playerPosition.y)

    
    

    //draw the player part moving with mouse 


    /*context.fillStyle = 'rgba(' + playerColor + ')';
    context.fillRect(-playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);
    context.strokeStyle = "#33333344";
    context.lineWidth = 5;
    context.strokeRect(-playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight);

    context.fillStyle = "#33cc59";
    context.fillRect(-playerWidth / 2, -playerHeight / 2, 15, 15);
    context.fillStyle = "#33a6cc";
    context.fillRect(playerWidth / 2 - 15, -playerHeight / 2, 15, 15);
    */

    //context.restore();
    //draw the player part NOT moving with mouse 

    
}

const drawPlayerName = (context, state) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    const playerAngle = state.playerAngle
    const playerStatus = state.playerStatus

    context.save();
    context.translate(playerPosition.x, playerPosition.y)

    context.save();
    context.rotate(Math.PI / 180 * playerAngle);



    context.restore();
    //draw the player part NOT moving with mouse 

    context.font = "bold 20pt Arial";
    const playerNameLen = context.measureText(playerName).width;

    context.strokeStyle = "#dddddd";
    context.lineWidth = 3;
    context.strokeText(playerName, -playerNameLen / 2, 50)

    context.fillStyle = "#111111";
    context.font = "bold 20pt Arial";

    context.fillText(playerName, -playerNameLen / 2, 50);
    //end of player drawing
    context.restore();
}

