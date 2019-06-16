import { battleField_1 } from '../field'

export const drawField = (c) => {
    const field = battleField_1;
    const objects = field.objects;

    var context = c.getContext("2d");

    context.save();
    // console.log(field.fieldRange)
    //draw the ground
    context.fillStyle = "#aaaaaa";
    context.fillRect(field.fieldRange.xMin, field.fieldRange.yMin, field.fieldRange.xMax, field.fieldRange.yMax);

    // draw the objects
    for (var i = 0; i < objects.length; ++i) {
        switch (objects[i][0]) {
            case "rock": context.fillStyle = "#333333"; break;
            default: break;
        }
        context.fillRect(objects[i][1], objects[i][2], objects[i][3], objects[i][4]);
    }


    context.restore();
}