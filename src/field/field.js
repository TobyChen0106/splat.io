export const getRegularPolyObject = (type, c_x, c_y, radius, sides, angle=0) => {
    var theta = 0;
    var x = 0;
    var y = 0;

    var polygon = [type];
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI + angle/180*Math.PI;
        x = c_x + radius * Math.sin(theta);
        y = c_y + radius * Math.cos(theta);
        polygon.push([x, y]);
    }
    return polygon;
}


export const battleField_1 = {
    fieldRange: { xMin: 50, xMax: 1550, yMin: 50, yMax: 850 },

    //(xPos, yPos, width, height)
    rectObjects: [
        ["rock", 500, 500, 100, 200],
        ["rock", 1000, 500, 100, 200],
        ["rock", 500, 50, 100, 200],
        ["rock", 1000, 50, 100, 200],
        ["rock", 650, 400, 300, 100],
        ["rock", 750, 300, 100, 300],

        ["rock", 500, 500, 100, 200],
        ["rock", 1000, 500, 100, 200],
        ["rock", 500, 50, 100, 200],
        ["rock", 1000, 50, 100, 200],
        ["rock", 650, 400, 300, 100],
        ["rock", 750, 300, 100, 300],

        ["rock", 500, 500, 100, 200],
        ["rock", 1000, 500, 100, 200],
        ["rock", 500, 50, 100, 200],
        ["rock", 1000, 50, 100, 200],
        ["rock", 650, 400, 300, 100],
        ["rock", 750, 300, 100, 300],

        ["rock", 500, 500, 100, 200],
        ["rock", 1000, 500, 100, 200],
        ["rock", 500, 50, 100, 200],
        ["rock", 1000, 50, 100, 200],
        ["rock", 650, 400, 300, 100],
        ["rock", 750, 300, 100, 300],

        ["rock", 500, 500, 100, 200],
        ["rock", 1000, 500, 100, 200],
        ["rock", 500, 50, 100, 200],
        ["rock", 1000, 50, 100, 200],
        ["rock", 650, 400, 300, 100],
        ["rock", 750, 300, 100, 300],
    ],
    polyObjects: [
        getRegularPolyObject("rock", 500, 500, 100, 8, 22.5),
    ],
    
}
