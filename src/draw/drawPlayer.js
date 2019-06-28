
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

var ripple = [];
var lastRippleTimeStamp = 0;
var lastRipplePosition= {x:-1000, y: -1000};

export const drawPlayer = (c, a, state) => {

    var context = c.getContext("2d");
    // attach the context to the canvas for easy access and to reduce complexity.
    // context.clearRect(0, 0, c.width, c.height);
    // drawPlayerNormal(context, state)

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

    // ripples
    var r_context = a.getContext("2d");
    if ((Math.abs(state.playerPosition.x - lastRipplePosition.x) > 50 || Math.abs(state.playerPosition.y - lastRipplePosition.y) > 50) &&
        (state.playerStatus === PLAYER_STATUS.WALKING_OWN || state.playerStatus === PLAYER_STATUS.SWIMMING_OWN
            || state.playerStatus === PLAYER_STATUS.WALKING_ENEMY || state.playerStatus === PLAYER_STATUS.SWIMMING_ENEMY)) {
        ripple.push([state.playerPosition.x, state.playerPosition.y, 20, 300]);
        lastRipplePosition.x = state.playerPosition.x ;
        lastRipplePosition.y = state.playerPosition.y ;
    }

    r_context.clearRect(0, 0, a.width, a.height);
    for (var r = 0; r < ripple.length; ++r) {
        ripple[r][2] += 1;
        drawRipple(r_context, ripple[r][0], ripple[r][1], ripple[r][2], 20);
        if (ripple[r][2] - 10 > 0) {
            drawRipple2(r_context, ripple[r][0], ripple[r][1], ripple[r][2] - 10, 20);
        }
        if (ripple[r][2] - 20 > 0) {
            drawRipple3(r_context, ripple[r][0], ripple[r][1], ripple[r][2] - 20, 20);
        }
        if (ripple[r][2] >= ripple[r][3]) {
            ripple.splice(r, 1);;
            --r;
            continue;
        }
    }
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
    context.drawImage(img, -playerWidth / 2, -playerHeight / 2, playerWidth, playerHeight)
    context.drawImage(img2, -playerWidth / 2 - 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)
    context.drawImage(img2, -playerWidth / 2 + 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)
    context.drawImage(img3, -playerWidth / 2, -playerHeight / 2 + 40, playerWidth, playerHeight)
    context.rotate(- Math.PI / 180 * (playerAngle + 180))
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

const drawRipple = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 3;
    graph.strokeStyle = 'rgba(230,230,230,' + (Math.max(0, 40 - radius) / 100) + ')';
    graph.stroke();
    graph.restore();
}

const drawRipple2 = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 2;
    graph.strokeStyle = 'rgba(220,220,220,' + (Math.max(0, 26 - radius) / 100) + ')';
    graph.stroke();
    graph.restore();
}

const drawRipple3 = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 1;
    graph.strokeStyle = 'rgba(200,200,200,' + (Math.max(0, 22 - radius) / 100) + ')';

    graph.stroke();
    graph.restore();
}