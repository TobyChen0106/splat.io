
export const drawSplat = (c, splat, playerColor) => {

    var context = c.getContext("2d");
    context.save();

    for (var i = 0; i < splat.length; ++i) {
        context.fillStyle = playerColor;
        drawCircle(context, splat[i][0], splat[i][1], splat[i][2], 50);
        // context.arc(splat[i][0], splat[i][1], splat[i][2], 0, 2 * Math.PI);
        // context.fill();
        // context.closePath();
    }
    
    context.restore();
}

export const drawCircle = (graph, centerX, centerY, radius, sides) => {
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
