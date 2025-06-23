class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 46;
        
        // ゲーム状態
        this.gameState = 'playing'; // 'playing', 'paused', 'gameOver', 'win'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.time = 60;
        this.lastTime = 0;
        
        // ゲームオブジェクト
        this.player = new Player(375, 12 * this.gridSize, this.gridSize);
        this.obstacleManager = new ObstacleManager();
        this.collisionManager = new CollisionManager();
        this.ui = new UI();
        
        // ゴール設定
        this.goals = [];
        this.initGoals();
        
        // 入力管理
        this.keys = {};
        this.keyPressed = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.gameLoop();
    }

    initGoals() {
        this.goals = [];
        const goalWidth = 120;
        const goalHeight = this.gridSize;
        const spacing = (800 - 5 * goalWidth) / 6;
        
        for (let i = 0; i < 5; i++) {
            this.goals.push({
                x: spacing + i * (goalWidth + spacing),
                y: 0,
                width: goalWidth,
                height: goalHeight,
                filled: false
            });
        }
    }

    setupEventListeners() {
        // キーボードイベント
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (this.gameState === 'playing' && !this.keyPressed) {
                this.handlePlayerInput(e.key);
                this.keyPressed = true;
            } else if (e.key === ' ') {
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.keyPressed = false;
        });

        // モバイル用タッチイベント
        this.setupMobileControls();

        // UI イベント
        this.ui.restartButton.addEventListener('click', () => {
            this.restart();
        });

        this.ui.nextLevelButton.addEventListener('click', () => {
            this.nextLevel();
        });
    }

    setupMobileControls() {
        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        // タッチイベントを追加
        if (upBtn) {
            upBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowUp');
                }
            });
        }

        if (downBtn) {
            downBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowDown');
                }
            });
        }

        if (leftBtn) {
            leftBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowLeft');
                }
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowRight');
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.togglePause();
            });
        }

        // クリックイベントも追加（デスクトップ環境でも使用可能）
        if (upBtn) {
            upBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowUp');
                }
            });
        }

        if (downBtn) {
            downBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowDown');
                }
            });
        }

        if (leftBtn) {
            leftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowLeft');
                }
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.handlePlayerInput('ArrowRight');
                }
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePause();
            });
        }
    }

    handlePlayerInput(key) {
        let points = 0;
        
        switch(key) {
            case 'ArrowUp':
                points = this.player.move('up', this.gridSize);
                break;
            case 'ArrowDown':
                this.player.move('down', this.gridSize);
                break;
            case 'ArrowLeft':
                this.player.move('left', this.gridSize);
                break;
            case 'ArrowRight':
                this.player.move('right', this.gridSize);
                break;
        }
        
        this.score += points;
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }

    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // 時間更新
        this.time -= deltaTime / 1000;
        if (this.time <= 0) {
            this.loseLife();
            return;
        }
        
        // プレイヤー更新
        if (!this.player.update()) {
            this.loseLife();
            return;
        }
        
        // 障害物更新
        this.obstacleManager.update();
        
        // 衝突判定
        this.checkCollisions();
    }

    checkCollisions() {
        // 境界チェック
        if (this.collisionManager.checkBoundaryCollision(this.player)) {
            this.loseLife();
            return;
        }
        
        // 車との衝突チェック
        if (this.collisionManager.checkPlayerVehicleCollision(this.player, this.obstacleManager)) {
            this.loseLife();
            return;
        }
        
        // 水との衝突チェック
        if (this.collisionManager.checkPlayerWaterCollision(this.player, this.obstacleManager)) {
            this.loseLife();
            return;
        }
        
        // ゴールチェック
        const goalIndex = this.collisionManager.checkGoalCollision(this.player, this.goals);
        if (goalIndex !== -1) {
            this.reachGoal();
        }
    }

    reachGoal() {
        this.score += 50;
        this.score += Math.floor(this.time); // 時間ボーナス
        
        // プレイヤーをスタート位置に戻す
        this.player.reset();
        this.time = 60; // 時間リセット
        
        // 全ゴールクリアチェック
        if (this.goals.every(goal => goal.filled)) {
            this.gameState = 'win';
            this.ui.showGameWin(this.score);
        }
    }

    loseLife() {
        this.lives--;
        this.player.reset();
        this.time = 60;
        
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
            this.ui.showGameOver(this.score);
        }
    }

    draw() {
        // 画面クリア
        this.ctx.clearRect(0, 0, 800, 600);
        
        // 背景描画
        this.ui.drawBackground(this.ctx);
        
        // ゴール描画
        this.ui.drawGoals(this.ctx, this.goals);
        
        // 障害物描画
        this.obstacleManager.draw(this.ctx);
        
        // プレイヤー描画
        this.player.draw(this.ctx);
        
        // 一時停止画面
        if (this.gameState === 'paused') {
            this.ui.drawPauseScreen(this.ctx);
        }
    }

    updateUI() {
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateLevel(this.level);
        this.ui.updateTime(this.time);
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        this.updateUI();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    restart() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.time = 60;
        
        this.player.reset();
        this.initGoals();
        this.obstacleManager = new ObstacleManager();
        
        this.ui.hideGameOver();
        this.ui.hideGameWin();
    }

    nextLevel() {
        this.level++;
        this.gameState = 'playing';
        this.time = Math.max(30, 60 - (this.level - 1) * 5); // 時間短縮
        
        this.player.reset();
        this.initGoals();
        
        // 障害物の速度を上げる
        this.obstacleManager.obstacles.forEach(obstacle => {
            obstacle.speed *= 1.2;
        });
        
        this.ui.hideGameWin();
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    new Game();
});