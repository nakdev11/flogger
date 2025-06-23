class UI {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.timeElement = document.getElementById('time');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.gameWinScreen = document.getElementById('gameWinScreen');
        this.finalScoreElement = document.getElementById('finalScore');
        this.winScoreElement = document.getElementById('winScore');
        this.restartButton = document.getElementById('restartButton');
        this.nextLevelButton = document.getElementById('nextLevelButton');
    }

    updateScore(score) {
        this.scoreElement.textContent = score;
    }

    updateLives(lives) {
        this.livesElement.textContent = lives;
    }

    updateLevel(level) {
        this.levelElement.textContent = level;
    }

    updateTime(time) {
        this.timeElement.textContent = Math.max(0, Math.floor(time));
    }

    showGameOver(finalScore) {
        this.finalScoreElement.textContent = finalScore;
        this.gameOverScreen.classList.remove('hidden');
    }

    showGameWin(score) {
        this.winScoreElement.textContent = score;
        this.gameWinScreen.classList.remove('hidden');
    }

    hideGameOver() {
        this.gameOverScreen.classList.add('hidden');
    }

    hideGameWin() {
        this.gameWinScreen.classList.add('hidden');
    }

    drawBackground(ctx) {
        const gridSize = 46;
        
        // ゴールエリア
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(0, 0, 800, gridSize);
        
        // 川エリア
        ctx.fillStyle = '#3498db';
        for (let i = 2; i <= 6; i++) {
            ctx.fillRect(0, i * gridSize, 800, gridSize);
        }
        
        // 中間安全地帯
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(0, 7 * gridSize, 800, gridSize);
        
        // 道路エリア
        ctx.fillStyle = '#2c3e50';
        for (let i = 8; i <= 11; i++) {
            ctx.fillRect(0, i * gridSize, 800, gridSize);
        }
        
        // スタートエリア
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(0, 12 * gridSize, 800, gridSize);
        
        // グリッドライン
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 13; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(800, i * gridSize);
            ctx.stroke();
        }
    }

    drawGoals(ctx, goals) {
        goals.forEach((goal, index) => {
            ctx.save();
            
            if (goal.filled) {
                // ゴールに到達したカエルを表示
                ctx.fillStyle = '#27ae60';
                ctx.beginPath();
                ctx.ellipse(goal.x + goal.width/2, goal.y + goal.height/2, 
                           goal.width/3, goal.height/3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // 目
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(goal.x + goal.width/2 - 5, goal.y + goal.height/2 - 3, 2, 0, Math.PI * 2);
                ctx.arc(goal.x + goal.width/2 + 5, goal.y + goal.height/2 - 3, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // 空のゴール表示
                ctx.strokeStyle = '#1e8449';
                ctx.lineWidth = 2;
                ctx.strokeRect(goal.x, goal.y, goal.width, goal.height);
                
                // ゴール番号
                ctx.fillStyle = '#1e8449';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText((index + 1).toString(), 
                           goal.x + goal.width/2, goal.y + goal.height/2 + 5);
            }
            
            ctx.restore();
        });
    }

    drawPauseScreen(ctx) {
        ctx.save();
        
        // 半透明オーバーレイ
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 600);
        
        // 一時停止テキスト
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('一時停止', 400, 280);
        
        ctx.font = '18px Arial';
        ctx.fillText('スペースキーで再開', 400, 320);
        
        ctx.restore();
    }
}