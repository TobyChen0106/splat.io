var ripple = [];
export const drawSplat = (c, a, splat, playerColor) => {

    var context = c.getContext("2d");
    var r_context = a.getContext("2d");
    context.save();
    // context.drawImage(image, 0,0,1600,900);

    for (var i = 0; i < splat.length; ++i) {
        context.fillStyle = playerColor;
        drawCircle(context, splat[i][0], splat[i][1], splat[i][2], 20);
        
        // ripple
        ripple.push([splat[i][0], splat[i][1], 1, splat[i][2]]);
    }

    // image.src = context.canvas.toDataURL();
    context.restore();
    // context.clearRect(0, 0, c.width, c.height);
    r_context.clearRect(0, 0, a.width, a.height);
    for (var r = 0; r < ripple.length; ++r) {
        ripple[r][2] += 2;
        drawRipple(r_context, ripple[r][0], ripple[r][1], ripple[r][2], 20);
        if ( ripple[r][2] -10 > 0){
            drawRipple2(r_context, ripple[r][0], ripple[r][1], ripple[r][2]-10, 20);
        }
        if ( ripple[r][2] -20 > 0){
            drawRipple3(r_context, ripple[r][0], ripple[r][1], ripple[r][2]-20, 20);
        }
        if ( ripple[r][2] >= ripple[r][3]){
            ripple.splice(r, 1);;
            --r;
            continue;
        }
    }
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

const drawRipple = (graph, centerX, centerY, radius, sides) => {
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
    graph.strokeStyle = "#dddddd22"
    graph.stroke();
}

const drawRipple2 = (graph, centerX, centerY, radius, sides) => {
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
    graph.strokeStyle = "#dddddd11"
    graph.stroke();
}

const drawRipple3 = (graph, centerX, centerY, radius, sides) => {
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
    graph.strokeStyle = "#dddddd06"
    graph.stroke();
}