import { battleField_1 } from '../field'
import trysvg from '../images/crosshair.svg'


export const drawField = (c) => {
    const field = battleField_1;
    const objects = field.objects;

    var context = c.getContext("2d");

    context.save();
    // console.log(field.fieldRange)
    //draw the ground
    //context.fillStyle = "#aaaaaa";
    //context.fillRect(field.fieldRange.xMin, field.fieldRange.yMin, field.fieldRange.xMax-field.fieldRange.xMin, field.fieldRange.yMax-field.fieldRange.yMin);

    var path = drawUsingArc(field.fieldRange.xMin, field.fieldRange.yMin, 
        field.fieldRange.xMax-field.fieldRange.xMin, field.fieldRange.yMax-field.fieldRange.yMin , 40);
    context.strokeStyle = "#778899";
    context.lineWidth = 6;
    context.stroke(path)
    
    
    //context.strokeRect(field.fieldRange.xMin, field.fieldRange.yMin, 
            //field.fieldRange.xMax-field.fieldRange.xMin, field.fieldRange.yMax-field.fieldRange.yMin);
    // draw the objects
    for (var i = 0; i < objects.length; ++i) {
        switch (objects[i][0]) {
            case "rock": 
                context.fillStyle = "#778899"; break;
            default: break;
        }
        var obj_path = drawUsingArc(objects[i][1], objects[i][2], objects[i][3], objects[i][4], 10)
        context.fill(obj_path)
        //context.fillRect(objects[i][1], objects[i][2], objects[i][3], objects[i][4]);
    }


    context.restore();
}




function drawUsingArc(x, y, width, height , r) {
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
 
    return path
}