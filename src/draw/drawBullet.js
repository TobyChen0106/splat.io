
export const drawBullet = (c, bullets, playerColor) => {

    var context = c.getContext("2d");
    context.clearRect(0, 0, c.width, c.height);

    context.save();
    // context.drawImage(image, 0,0,1600,900);
    
    for (var i = 0; i < bullets.length; ++i) {
        context.fillStyle =  playerColor.main;
        drawCircle(context, bullets[i][1], bullets[i][2], 8, 10);
        drawCircleOutLine(context, bullets[i][1], bullets[i][2], 8, 10);
    }

    context.restore();

}

const drawCircle = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;

    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.fill();
}

const drawCircleOutLine = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;

    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 3;
    graph.strokeStyle = "#55555533"
    graph.stroke();
}
