
export const playerWidth = 50;
export const playerHeight = 50;

export const drawPlayer = (c, state) => {
    const playerName = state.playerName
    const playerColor= state.playerColor
    const playerPosition= state.playerPosition
    const playerAngle= state.playerAngle
    const playerStatus= state.playerStatus
    
    var context = c.getContext("2d");

    context.save();
    context.translate(playerPosition.x, playerPosition.y)

    context.save();
    context.rotate(Math.PI / 180 * playerAngle);

    //draw the player part moving with mouse 
    context.fillStyle = playerColor;
    context.fillRect(-playerWidth/2, -playerHeight/2, playerWidth, playerHeight);
    context.fillStyle = "#33cc59";
    context.fillRect(-playerWidth/2, -playerHeight/2, 15, 15);
    context.fillStyle = "#33a6cc";
    context.fillRect(playerWidth/2-15, -playerHeight/2, 15, 15);
    

    context.restore();
    //draw the player part NOT moving with mouse 
    
    context.font = "bold 20pt Arial";
    const playerNameLen = context.measureText(playerName).width;    

    context.strokeStyle = "#dddddd";
    context.strokeText(playerName, -playerNameLen/2, 50)

    context.fillStyle = "#111111";
    context.font = "bold 20pt Arial";
    context.fillText(playerName, -playerNameLen/2, 50);
    //end of player drawing
    context.restore();
}