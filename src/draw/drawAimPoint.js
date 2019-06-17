
export const drawAimPoint = (c, playerPosition, mousePosition, playerAngle, aimPoints) => {

    var context = c.getContext("2d");
    context.clearRect(0, 0, c.width, c.height);
    context.save();

    maindrawAimCircle(context, mousePosition.x, mousePosition.y, playerAngle);
    drawRealAimCircle(context, aimPoints);

    context.restore();
}

const drawRealAimCircle = (graph, aimPoints) => {
    // aimPoints = [[100,100], [100,130]];
    const radius = 10;
    const sides = 20;

    graph.save();
    for (var a = 0; a < aimPoints.length; ++a) {
        var theta = 0;
        var x = 0;
        var y = 0;

        graph.beginPath();
        for (var i = 0; i < sides; i++) {
            theta = (i / sides) * 2 * Math.PI;
            x = aimPoints[a][0] + radius * Math.sin(theta);
            y = aimPoints[a][1] + radius * Math.cos(theta);
            graph.lineTo(x, y);
        }
        graph.closePath();
        graph.strokeStyle = "#b3198c88";
        graph.lineWidth = 3;
        graph.stroke();

        graph.beginPath();
        for ( i = 0; i < sides; i++) {
            theta = (i / sides) * 2 * Math.PI;
            x = aimPoints[a][0] + (radius - 3) * Math.sin(theta);
            y = aimPoints[a][1] + (radius - 3) * Math.cos(theta);
            graph.lineTo(x, y);
        }
        graph.closePath();
        graph.strokeStyle = "#77777755";
        graph.lineWidth = 2;
        graph.stroke();
    }
    graph.restore();
}

const maindrawAimCircle = (graph, centerX, centerY, angle) => {
    var theta = 0;
    var x = 0;
    var y = 0;

    const radius = 15;
    const sides = 20;

    graph.save();
    graph.translate(centerX, centerY);

    graph.save();
    graph.rotate(-Math.PI / 180 * angle);

    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = radius * Math.sin(theta);
        y = radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();

    graph.strokeStyle = "#77777755";
    graph.lineWidth = 3;
    graph.stroke();

    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = (radius-6) * Math.sin(theta);
        y = (radius-6) * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();

    graph.strokeStyle = "#77777755";
    graph.lineWidth = 1.5;
    graph.stroke();

    graph.beginPath();
    graph.moveTo(0, -9);
    graph.lineTo(0, -22);
    graph.moveTo(0, 9);
    graph.lineTo(0, 22);
    graph.moveTo(-9, 0);
    graph.lineTo(-22, 0);
    graph.moveTo(9, 0);
    graph.lineTo(22, 0);

    graph.closePath();

    // graph.strokeStyle = "#666666";
    graph.lineWidth = 3;
    graph.stroke();

    graph.restore();
    graph.restore();

}