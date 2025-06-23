class Obstacle {
    constructor(x, y, width, height, speed, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.type = type;
    }

    update() {
        this.x += this.speed;
        
        // 画面外に出たら反対側から再登場
        if (this.speed > 0 && this.x > 800) {
            this.x = -this.width;
        } else if (this.speed < 0 && this.x < -this.width) {
            this.x = 800;
        }
    }

    draw(ctx) {
        ctx.save();
        
        if (this.type === 'car') {
            this.drawCar(ctx);
        } else if (this.type === 'truck') {
            this.drawTruck(ctx);
        } else if (this.type === 'log') {
            this.drawLog(ctx);
        } else if (this.type === 'turtle') {
            this.drawTurtle(ctx);
        }
        
        ctx.restore();
    }

    drawCar(ctx) {
        // 車体
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(this.x, this.y + this.height/4, this.width, this.height/2);
        
        // 窓
        ctx.fillStyle = '#3498db';
        ctx.fillRect(this.x + this.width/4, this.y + this.height/3, this.width/2, this.height/4);
        
        // タイヤ
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(this.x + this.width/4, this.y + 3*this.height/4, this.height/6, 0, Math.PI * 2);
        ctx.arc(this.x + 3*this.width/4, this.y + 3*this.height/4, this.height/6, 0, Math.PI * 2);
        ctx.fill();
    }

    drawTruck(ctx) {
        // トラック本体
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(this.x, this.y + this.height/4, this.width, this.height/2);
        
        // キャブ
        ctx.fillStyle = '#d68910';
        ctx.fillRect(this.x, this.y + this.height/6, this.width/3, this.height*2/3);
        
        // タイヤ
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(this.x + this.width/6, this.y + 3*this.height/4, this.height/6, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/2, this.y + 3*this.height/4, this.height/6, 0, Math.PI * 2);
        ctx.arc(this.x + 5*this.width/6, this.y + 3*this.height/4, this.height/6, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLog(ctx) {
        // 丸太
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x, this.y + this.height/4, this.width, this.height/2);
        
        // 年輪
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y + this.height/4);
            ctx.lineTo(this.x + i, this.y + 3*this.height/4);
            ctx.stroke();
        }
    }

    drawTurtle(ctx) {
        // 亀の甲羅
        ctx.fillStyle = '#2d5016';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 甲羅の模様
        ctx.strokeStyle = '#1a2f0a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/4, this.y + this.height/2);
        ctx.lineTo(this.x + 3*this.width/4, this.y + this.height/2);
        ctx.moveTo(this.x + this.width/2, this.y + this.height/3);
        ctx.lineTo(this.x + this.width/2, this.y + 2*this.height/3);
        ctx.stroke();
        
        // 頭
        ctx.fillStyle = '#556b2f';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/4, this.width/8, 0, Math.PI * 2);
        ctx.fill();
    }

    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.initObstacles();
    }

    initObstacles() {
        const gridSize = 46;
        
        // 道路エリアの車
        this.createRoadObstacles(gridSize);
        
        // 川エリアの丸太と亀
        this.createWaterObstacles(gridSize);
    }

    createRoadObstacles(gridSize) {
        // 道路の行（8-11行目、12行目はスタートエリアなので除外）
        const roadRows = [
            { row: 8, speed: 1.5, direction: 1 },   // 8行目: 右方向、遅い
            { row: 9, speed: -2.5, direction: -1 }, // 9行目: 左方向、中速
            { row: 10, speed: 3, direction: 1 },    // 10行目: 右方向、速い
            { row: 11, speed: -1, direction: -1 }   // 11行目: 左方向、非常に遅い
        ];
        
        roadRows.forEach((roadConfig, index) => {
            const y = roadConfig.row * gridSize;
            const speed = roadConfig.speed;
            const isRightDirection = roadConfig.direction === 1;
            
            // 車の配置
            for (let i = 0; i < 3; i++) {
                const x = isRightDirection ? i * 280 : i * 260 + 120;
                const type = Math.random() > 0.7 ? 'truck' : 'car';
                const width = type === 'truck' ? gridSize * 2 : gridSize * 1.5;
                
                this.obstacles.push(new Obstacle(x, y, width, gridSize, speed, type));
            }
        });
    }

    createWaterObstacles(gridSize) {
        // 川の行（2-6行目）
        const waterRows = [
            { row: 2, speed: 0.8, direction: 1, type: 'log', size: 4, count: 2 },     // 2行目: 右方向、遅い、長い丸太
            { row: 3, speed: -2.5, direction: -1, type: 'turtle', size: 1.8, count: 3 }, // 3行目: 左方向、速い、亀
            { row: 4, speed: 1.2, direction: 1, type: 'log', size: 3.5, count: 2 },   // 4行目: 右方向、やや遅い、中長丸太
            { row: 5, speed: -3.2, direction: -1, type: 'turtle', size: 1.5, count: 4 }, // 5行目: 左方向、とても速い、亀
            { row: 6, speed: 0.5, direction: 1, type: 'log', size: 5, count: 1 }      // 6行目: 右方向、非常に遅い、超長丸太
        ];
        
        waterRows.forEach((waterConfig) => {
            const y = waterConfig.row * gridSize;
            const speed = waterConfig.speed;
            const isRightDirection = waterConfig.direction === 1;
            const type = waterConfig.type;
            
            // 丸太または亀の配置（行ごとに1種類のみ）
            for (let i = 0; i < waterConfig.count; i++) {
                const spacing = 800 / (waterConfig.count + 1);
                const x = isRightDirection ? 
                    (i + 1) * spacing - waterConfig.size * gridSize / 2 :
                    (i + 1) * spacing - waterConfig.size * gridSize / 2;
                
                const width = gridSize * waterConfig.size;
                
                this.obstacles.push(new Obstacle(x, y, width, gridSize, speed, type));
            }
        });
    }

    update() {
        this.obstacles.forEach(obstacle => obstacle.update());
    }

    draw(ctx) {
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
    }

    getObstaclesInRow(row) {
        const gridSize = 46;
        return this.obstacles.filter(obstacle => 
            Math.floor(obstacle.y / gridSize) === row
        );
    }

    getRoadObstacles() {
        return this.obstacles.filter(obstacle => 
            obstacle.type === 'car' || obstacle.type === 'truck'
        );
    }

    getWaterObstacles() {
        return this.obstacles.filter(obstacle => 
            obstacle.type === 'log' || obstacle.type === 'turtle'
        );
    }
}