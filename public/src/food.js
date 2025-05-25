class Food {
    constructor(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.position = this.spawn();
    }

    spawn() {
        const x = Math.floor(Math.random() * (this.boardWidth / 10)) * 10;
        const y = Math.floor(Math.random() * (this.boardHeight / 10)) * 10;
        return { x, y };
    }

    getPosition() {
        return this.position;
    }

    respawn() {
        this.position = this.spawn();
    }
}

export default Food;