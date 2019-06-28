import { drawPlayer, drawSplat, drawBullet, } from '../draw'

export const drawOtherPlayers = (players) => {
    for (var p = 0; p < players.length; ++p) {
        drawPlayer();
        drawSplat();
        drawBullet();
    }
}  
