
export const drawSplat = (c, splat, playerColor, image) => {

    var context = c.getContext("2d");
    context.save();
    // context.drawImage(image, 0,0,1600,900);

    for (var i = 0; i < splat.length; ++i) {
        context.fillStyle = playerColor;
        drawCircle(context, splat[i][0], splat[i][1], splat[i][2], 20);
    }

    // image.src = context.canvas.toDataURL();
    context.restore();
    // context.clearRect(0, 0, c.width, c.height);

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
