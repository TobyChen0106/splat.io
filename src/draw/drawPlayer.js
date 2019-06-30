
import { PLAYER_STATUS } from '../enum'
import { COLOR_ASSET } from '../components/ColorAssets'

import splashSound from '../sounds/splash/splash2.wav'

import greenPlayer from '../images/player/green/p-01.svg'
import greenLeft from '../images/player/green/p-02.svg'
import greenRight from '../images/player/green/p-03.svg'
import greenDive from '../images/player/green/p-04.svg'

import purplePlayer from '../images/player/purple/p-01.svg'
import purpleLeft from '../images/player/purple/p-02.svg'
import purpleRight from '../images/player/purple/p-03.svg'
import purpleDive from '../images/player/purple/p-04.svg'

import bluePlayer from '../images/player/blue/p-01.svg'
import blueLeft from '../images/player/blue/p-02.svg'
import blueRight from '../images/player/blue/p-03.svg'
import blueDive from '../images/player/blue/p-04.svg'

import pinkPlayer from '../images/player/pink/p-01.svg'
import pinkLeft from '../images/player/pink/p-02.svg'
import pinkRight from '../images/player/pink/p-03.svg'
import pinkDive from '../images/player/pink/p-04.svg'


import GunSVG from '../images/player/p-03.svg'
/*
import playerSVG from '../images/player/p-02-01.svg'
import LeftHandSVG from '../images/player/p-02-02.svg'
import RightHandSVG from '../images/player/p-02-03.svg'
import gunSVG from '../images/player/p-03.svg'
import diveSVG from '../images/player/p-02-04.svg'
*/

export const playerWidth = 50;
export const playerHeight = 50;

const handOffset = 23

//var diveSVG;
//var gunSVG = GunSVG

var ripple = [];
//var lastRippleTimeStamp = 0;
var lastRipplePosition = { x: -1000, y: -1000 };

var audio = new Audio(splashSound);
audio.volume = 0.5;

export const drawPlayer = (c, a, state, isSelf, isTeamMate) => {

    var context = c.getContext("2d");

    var team = state.playerColor.main;

    // attach the context to the canvas for easy access and to reduce complexity.
    // context.clearRect(0, 0, c.width, c.height);
    // drawPlayerNormal(context, state)

    switch (state.playerStatus) {
        case PLAYER_STATUS.STANDING_OWN:
            drawPlayerNormal(context, state, team, isSelf);
            break;
        case PLAYER_STATUS.WALKING_OWN:
            drawPlayerNormal(context, state, team, isSelf);
            break;
        case PLAYER_STATUS.DIVING_OWN:
            // audio.currentTime = 0;
            audio.play();
            drawPlayerDive(context, state, team, isSelf, isTeamMate);
            break;
        case PLAYER_STATUS.SWIMMING_OWN:
            // audio.currentTime = 0;
            audio.play();
            drawPlayerDive(context, state, team, isSelf, isTeamMate);

            break;
        case PLAYER_STATUS.ATTACKING_OWN:
            drawPlayerNormal(context, state, team, isSelf);
            break;

        case PLAYER_STATUS.STANDING_SPACE:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.WALKING_SPACE:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.DIVING_SPACE:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.SWIMMING_SPACE:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.ATTACKING_SPACE:
            drawPlayerNormal(context, state, team, isSelf);

            break;

        case PLAYER_STATUS.STANDING_ENEMY:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.WALKING_ENEMY:
            drawPlayerNormal(context, state, team, isSelf);

            break;
        case PLAYER_STATUS.DIVING_ENEMY:
            break;
        case PLAYER_STATUS.SWIMMING_ENEMY:
            break;
        case PLAYER_STATUS.ATTACKING_ENEMY:
            drawPlayerNormal(context, state, team, isSelf);
            break;
        case PLAYER_STATUS.DEAD:
            drawPlayerDead(context, state, team, isSelf);
            break;
        default: break;
    }

    // ripples
    var r_context = a.getContext("2d");
    if ((Math.abs(state.playerPosition.x - lastRipplePosition.x) > 50 || Math.abs(state.playerPosition.y - lastRipplePosition.y) > 50) &&
        (state.playerStatus === PLAYER_STATUS.WALKING_OWN || state.playerStatus === PLAYER_STATUS.SWIMMING_OWN
            || state.playerStatus === PLAYER_STATUS.WALKING_ENEMY || state.playerStatus === PLAYER_STATUS.SWIMMING_ENEMY)) {
        ripple.push([state.playerPosition.x, state.playerPosition.y, 20, 300]);
        lastRipplePosition.x = state.playerPosition.x;
        lastRipplePosition.y = state.playerPosition.y;
    }

    r_context.clearRect(0, 0, a.width, a.height);
    for (var r = 0; r < ripple.length; ++r) {
        ripple[r][2] += 0.5;
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


const drawPlayerNormal = (context, state, color, isSelf) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    const playerAngle = state.playerAngle
    //const playerStatus = state.playerStatus
    /*
    context.save();
    context.translate(playerPosition.x, playerPosition.y)

    context.save();
    context.rotate(Math.PI / 180 * playerAngle);
    */
    context.save()

    context.translate(playerPosition.x, playerPosition.y)

    context.font = "bold 12pt Freckle Face";
    const playerNameLen = context.measureText(playerName).width;

    context.strokeStyle = isSelf ? "#ffd700" : "#FFFFFF";
    context.lineWidth = 3;
    context.strokeText(playerName, -playerNameLen / 2, 50)

    context.fillStyle = playerColor;
    context.font = "bold 12pt Freckle Face";

    context.fillText(playerName, -playerNameLen / 2, 50);
    //end of player drawing
    context.restore();

    var body = new Image()
    var leftHand = new Image()
    var rightHand = new Image()
    var gun = new Image()

    switch (color) {
        case COLOR_ASSET[0].main:
            body.src = pinkPlayer;
            leftHand.src = pinkLeft;
            rightHand.src = pinkRight;
            gun.src = GunSVG;
            break;
        case COLOR_ASSET[1].main:
            body.src = bluePlayer;
            leftHand.src = blueLeft;
            rightHand.src = blueRight;
            gun.src = GunSVG;
            break;
        case COLOR_ASSET[2].main:
            body.src = greenPlayer;
            leftHand.src = greenLeft;
            rightHand.src = greenRight;
            gun.src = GunSVG;
            break;
        case COLOR_ASSET[3].main:
            body.src = purplePlayer;
            leftHand.src = purpleLeft;
            rightHand.src = purpleRight;
            gun.src = GunSVG;
            break;
        default:
            break;
    }

    /*
    body.src = playerSVG;
    leftHand.src = LeftHandSVG;
    rightHand.src = RightHandSVG;
    gun.src = gunSVG;
    */

    context.translate(playerPosition.x, playerPosition.y)
    context.rotate(Math.PI / 180 * (playerAngle + 180));
    context.drawImage(body, -playerWidth / 2 - 10, -playerHeight / 2 - 12, playerWidth + 15, playerHeight + 15)
    context.drawImage(leftHand, -playerWidth / 2 - 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)
    context.drawImage(gun, -playerWidth / 2, -playerHeight / 2 + 28, playerWidth, playerHeight)
    context.drawImage(rightHand, -playerWidth / 2 + 10, -playerHeight / 2 + handOffset, playerWidth, playerHeight)

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

const drawPlayerDive = (context, state, color, isSelf, isTeamMate) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    //const playerAngle = state.playerAngle
    //const playerStatus = state.playerStatus


    if (isTeamMate) {
        context.save()
        context.translate(playerPosition.x, playerPosition.y)

        context.font = "bold 10pt Freckle Face";
        const playerNameLen = context.measureText(playerName).width;

        context.strokeStyle = isSelf ? "#ffd700" : "#FFFFFF";
        context.lineWidth = 3;
        context.strokeText(playerName, -playerNameLen / 2, 50)

        context.fillStyle = playerColor;
        context.font = "bold 10pt Freckle Face";

        context.fillText(playerName, -playerNameLen / 2, 50);
        //end of player drawing
        context.restore();

        var dive = new Image()

        switch (color) {
            case COLOR_ASSET[0].main:
                dive.src = pinkDive
                break;
            case COLOR_ASSET[1].main:
                dive.src = blueDive
                break;
            case COLOR_ASSET[2].main:
                dive.src = greenDive
                break;
            case COLOR_ASSET[3].main:
                dive.src = purpleDive
                break;
            default:
                break;
        }

        context.translate(playerPosition.x, playerPosition.y)
        context.drawImage(dive, -playerWidth / 2 - 10, -playerHeight / 2 + 12, playerWidth + 15, playerHeight + 15)
        context.translate(-playerPosition.x, -playerPosition.y)
    }
}

const drawPlayerDead = (context, state, team, isSelf) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    //const playerAngle = state.playerAngle
    //const playerStatus = state.playerStatus


    context.save()

    context.translate(playerPosition.x, playerPosition.y)

    // draw X
    context.beginPath();
    context.moveTo(-25, -25);
    context.lineTo(25, 25);
    context.moveTo(25, -25);
    context.lineTo(-25, 25);
    context.closePath();

    context.lineWidth = 10;
    context.stroke();
    // end of draw X

    context.font = "bold 10pt Freckle Face";
    const playerNameLen = context.measureText(playerName).width;

    context.strokeStyle = isSelf ? "#ffd700" : "#FFFFFF";
    context.lineWidth = 3;
    context.strokeText(playerName, -playerNameLen / 2, 50)

    context.fillStyle = playerColor;
    context.font = "bold 10pt Freckle Face";

    context.fillText(playerName, -playerNameLen / 2, 50);

    //end of player drawing
    context.restore();
}

const drawPlayerName = (context, state) => {
    const playerName = state.playerName
    const playerColor = state.playerColor
    const playerPosition = state.playerPosition
    //const playerAngle = state.playerAngle
    //const playerStatus = state.playerStatus

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

    /*context.save();
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
    */
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