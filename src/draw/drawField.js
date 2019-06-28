import { battleField_1 } from '../field'
import rock from '../images/rock1.svg'

const outerColor = "#525C63"
const middleColor = "#3B4349"
const innerColor = "#21292D"



export const drawField = (c) => {
    const field = battleField_1;
    var objects = field.rectObjects;
    var xMin = field.fieldRange.xMin
    var yMin = field.fieldRange.yMin
    var xMax = field.fieldRange.xMax
    var yMax = field.fieldRange.yMax

    var context = c.getContext("2d");

    context.save();
    context.shadowBlur = 3;
    context.shadowColor = "rgba(63, 255, 239, 0.555)";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    //context.filter = 'drop-shadow(0px 0px 1px #e81)';
    // console.log(field.fieldRange)
    //draw the ground
    //context.fillStyle = "#aaaaaa";
    //context.fillRect(field.fieldRange.xMin, field.fieldRange.yMin, field.fieldRange.xMax-field.fieldRange.xMin, field.fieldRange.yMax-field.fieldRange.yMin);

    var path = drawRectUsingArc(xMin, yMin, xMax - xMin, yMax - yMin, 30);
    context.strokeStyle = outerColor;
    context.lineWidth = 8;
    context.stroke(path)
    var offset = 12
    var path = drawRectUsingArc(xMin - offset / 2, yMin - offset / 2, xMax - xMin + offset, yMax - yMin + offset, 30);
    context.strokeStyle = middleColor;
    context.lineWidth = 8;
    context.stroke(path)


    //context.strokeRect(field.fieldRange.xMin, field.fieldRange.yMin, 
    //field.fieldRange.xMax-field.fieldRange.xMin, field.fieldRange.yMax-field.fieldRange.yMin);
    // draw the objects
    for (var i = 0; i < objects.length; ++i) {
        var obj = { x: objects[i][1], y: objects[i][2], w: objects[i][3], h: objects[i][4] }

        switch (objects[i][0]) {
            case "rock":

                //最外圈
                context.fillStyle = outerColor;
                var obj_path = drawRectUsingArc(objects[i][1], objects[i][2], objects[i][3], objects[i][4], 5)
                context.fill(obj_path)

                //中間
                context.fillStyle = middleColor;
                obj_path = drawRectUsingArc(objects[i][1] + 8, objects[i][2] + 8, objects[i][3] - 16, objects[i][4] - 16, 5)
                context.fill(obj_path)

                //最內圈
                context.fillStyle = innerColor;
                obj_path = drawRectUsingArc(objects[i][1] + 20, objects[i][2] + 20, objects[i][3] - 40, objects[i][4] - 40, 5)
                context.fill(obj_path)

                break;
            default: break;
        }

        /*
        var img = new Image();
        img.src = rock;
        img.onload = function() {
            context.drawImage(img, obj.x, obj.y, obj.w, obj.h)
        }
        
        var obj_path = drawUsingArc(objects[i][1], objects[i][2], objects[i][3], objects[i][4], 10)
        context.fill(obj_path)
        */
        //var obj_path = drawUsingArc(objects[i][1]+5, objects[i][2]+5, objects[i][3]-10, objects[i][4]-10, 10)
        //context.fill(obj_path)
        //context.fillRect(objects[i][1], objects[i][2], objects[i][3], objects[i][4]);
    }

    //draw polygon objects
    objects = field.polyObjects;
    for (var i = 0; i < objects.length; ++i) {
        switch (objects[i][0]) {
            case "rock":


                //最外圈
                context.fillStyle = outerColor;
                var obj_path = drawPolyUsingArc(objects[i])
                context.fill(obj_path)

                // //中間
                // context.fillStyle = middleColor;
                // var obj_path = drawPolyUsingArc(objects[i])
                // context.fill(obj_path)

                // //最內圈
                // context.fillStyle = innerColor;
                // var obj_path = drawPolyUsingArc(objects[i])                
                // context.fill(obj_path)

                break;
            default: break;
        }
    }
    context.restore();
}


function drawRectUsingArc(x, y, width, height, r) {
    var path = new Path2D();

    path.moveTo(x + r, y);
    path.lineTo(x + width - r, y);
    path.arc(x + width - r, y + r, r, Math.PI / 180 * 270, 0, false);
    path.lineTo(x + width, y + height - r);
    path.arc(x + width - r, y + height - r, r, 0, Math.PI / 180 * 90, 0, false);
    path.lineTo(x + r, y + height);
    path.arc(x + r, y + height - r, r, Math.PI / 180 * 90, Math.PI / 180 * 180, false);
    path.lineTo(x, y + r);
    path.arc(x + r, y + r, r, Math.PI / 180 * 180, Math.PI / 180 * 270, false);

    return path;
}

function drawPolyUsingArc(polyObject) {
    var path = new Path2D();
    const n = polyObject.length;
    path.moveTo(polyObject[n - 1][0], polyObject[n - 1][1]);
    
    for (var i = 1; i < n; i++) {
        path.lineTo(polyObject[i][0], polyObject[i][1]);
    }

    return path;
}