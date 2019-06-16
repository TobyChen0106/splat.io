
export const drawSplat = (c, splat, playerColor) => {

    var context = c.getContext("2d");
    context.save();

    for (var i = 0; i < splat.length; ++i) {
        context.fillStyle = playerColor;
        context.arc(splat[i][0], splat[i][1], splat[i][2], 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
    
    context.restore();
}