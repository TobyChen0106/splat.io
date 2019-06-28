import inkHit06 from '../sounds/inkHit/inkHit06.wav';

import ink01 from '../images/ink/n-01.svg'
import ink02 from '../images/ink/n-02.svg'
import ink03 from '../images/ink/n-03.svg'

const ink = [ink01, ink02, ink03];
var ripple = [];
var audio = new Audio(inkHit06);
audio.volume = 0.5;

function random_ink() 
{
    var l = ink.length;
    var r = Math.floor(Math.random() * l)
    return ink[r]
}

export const drawSplat = (c, a, splat, playerColor, playerAngle, playerPosition) => {

    var context = c.getContext("2d");
    var r_context = a.getContext("2d");

    context.save();
    
    //context.filter = 'drop-shadow(0px 0px 5px #FF1493)';
    // context.drawImage(image, 0,0,1600,900);
    

    for (var i = 0; i < splat.length; ++i) {

        //context.fillStyle =  'rgba(' + playerColor +')';
        var aimX = splat[i][0] 
        var aimY = splat[i][1] 
        var playerX = playerPosition.x
        var playerY = playerPosition.y
        var angle = playerAngle< 0 ? playerAngle + 270 : playerAngle - 90;
        var ink_size = splat[i][2] * 3; //因為我圖畫得比較小所以先乘3

        var img = new Image;
        img.src = random_ink()//"data:image/svg+xml;base64,"+btoa(trysvg);
        //img.style = "fill:#B0E0E6;"
        //console.log(img.style)
        img.onload = function() { 
            // console.log(angle)
            context.shadowBlur = 5;
            context.shadowColor = "#FF00FF";
            context.translate(aimX , aimY)
            context.rotate(angle/180 * Math.PI);
            context.drawImage(img, -ink_size/2, -ink_size/2, ink_size, ink_size);
            context.rotate(-angle/180 * Math.PI);
            context.translate(-aimX , -aimY )
        }
        
        //drawCircle(context, aimX, aimY, splat[i][2], 20);
        audio.currentTime = 0;
        audio.play();
        
        // ripple
        ripple.push([splat[i][0], splat[i][1], 1, splat[i][2]]);
    }

    // image.src = context.canvas.toDataURL();
    context.restore();
    // context.clearRect(0, 0, c.width, c.height);
    // r_context.clearRect(0, 0, a.width, a.height);
    for (var r = 0; r < ripple.length; ++r) {
        ripple[r][2] += 2;
        drawRipple(r_context, ripple[r][0], ripple[r][1], ripple[r][2], 20);
        if (ripple[r][2] - 10 > 0) {
            drawRipple2(r_context, ripple[r][0], ripple[r][1], ripple[r][2] - 10, 20);
        }
        if (ripple[r][2] - 20 > 0) {
            drawRipple3(r_context, ripple[r][0], ripple[r][1], ripple[r][2] - 20, 20);
        }
        if (ripple[r][2] >= ripple[r][3]) {
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
    graph.save();
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


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 3;
    graph.strokeStyle = 'rgba(230,230,230,' + (Math.max(0, 30 - radius) / 100) + ')';
    graph.stroke();
    graph.restore();
}

const drawRipple2 = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 2;
    graph.strokeStyle = 'rgba(220,220,220,' + (Math.max(0, 20 - radius) / 100) + ')';
    graph.stroke();
    graph.restore();
}

const drawRipple3 = (graph, centerX, centerY, radius, sides) => {
    var theta = 0;
    var x = 0;
    var y = 0;


    graph.save();
    graph.beginPath();
    for (var i = 0; i < sides; i++) {
        theta = (i / sides) * 2 * Math.PI;
        x = centerX + radius * Math.sin(theta);
        y = centerY + radius * Math.cos(theta);
        graph.lineTo(x, y);
    }
    graph.closePath();
    graph.lineWidth = 1;
    graph.strokeStyle = 'rgba(200,200,200,' + (Math.max(0, 10 - radius) / 100) + ')';

    graph.stroke();
    graph.restore();
}