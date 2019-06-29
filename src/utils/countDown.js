export default (gameTime) => {
    if (gameTime >= 0) return gameTime;
    else {
        let dots = '';
        for (let i = (-gameTime) % 3 + 1; i > 0; i--) {
            dots += '. ';
        }
        return dots;
    }
}