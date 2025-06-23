class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.startX = x;
        this.startY = y;
        this.onLog = false;
        this.logSpeed = 0;
        this.maxY = y;
    }

    draw(ctx) {
        ctx.save();
        
        // カエルの体
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.ellipse(this.x + this.size/2, this.y + this.size/2, this.size/2.5, this.size/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 目
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.size/3, this.y + this.size/4, this.size/8, 0, Math.PI * 2);
        ctx.arc(this.x + 2*this.size/3, this.y + this.size/4, this.size/8, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.size/3, this.y + this.size/4, this.size/12, 0, Math.PI * 2);
        ctx.arc(this.x + 2*this.size/3, this.y + this.size/4, this.size/12, 0, Math.PI * 2);
        ctx.fill();
        
        // 足
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.ellipse(this.x + this.size/4, this.y + this.size*0.7, this.size/6, this.size/4, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 3*this.size/4, this.y + this.size*0.7, this.size/6, this.size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    move(direction, gridSize) {
        if (direction === 'up' && this.y > 0) {
            this.y -= gridSize;
            if (this.y < this.maxY) {
                this.maxY = this.y;
                return 10; // 前進ボーナス
            }
        } else if (direction === 'down' && this.y < 600 - gridSize) {
            this.y += gridSize;
        } else if (direction === 'left' && this.x > 0) {
            this.x -= gridSize;
        } else if (direction === 'right' && this.x < 800 - gridSize) {
            this.x += gridSize;
        }
        return 0;
    }

    update() {
        if (this.onLog) {
            this.x += this.logSpeed;
            // 画面外に出たらゲームオーバー
            if (this.x < -this.size || this.x > 800) {
                return false;
            }
        }
        return true;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.maxY = this.startY;
        this.onLog = false;
        this.logSpeed = 0;
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.size,
            height: this.size
        };
    }

    isInWater(waterRows, gridSize) {
        const row = Math.floor(this.y / gridSize);
        return waterRows.includes(row);
    }

    isInGoal(goalY, gridSize) {
        return Math.abs(this.y - goalY) < gridSize/2;
    }
}