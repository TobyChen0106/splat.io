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
        ["rock", 450, 50, 100, 200],
        ["rock", 450, 550, 100, 200],
        ["rock", 1050, 50, 100, 200],
        ["rock", 1050, 550, 100, 200],

        ["rock", 750, 275, 100, 400],
        ["rock", 600, 400, 400, 100],

        ["rock", 50, 0, 1600, 50],
        ["rock", 0, 50, 50, 900],
        ["rock", 50, 850, 1600, 50],
        ["rock", 1550, 50, 50, 900],

        ["rock", 0, 0, 50, 50],
        ["rock", 1550, 0, 50, 50],
        ["rock", 0, 850, 50, 50],
        ["rock", 1550, 850, 50, 50],
    ],
    polyObjects: [
        getRegularPolyObject("white", 50, 450, 150, 8, 22.5),
        getRegularPolyObject("white", 1550, 450, 150, 8, 22.5),
    ],

    spawnPoint:{
        teamA:{x:100 , y:450},
        teamB:{x:1500 , y:450}
    }
    
}
