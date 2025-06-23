class CollisionManager {
    constructor() {}

    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    checkPlayerVehicleCollision(player, obstacleManager) {
        const playerRect = player.getRect();
        const roadObstacles = obstacleManager.getRoadObstacles();
        
        for (let obstacle of roadObstacles) {
            if (this.checkRectCollision(playerRect, obstacle.getRect())) {
                return true;
            }
        }
        return false;
    }

    checkPlayerWaterCollision(player, obstacleManager) {
        const gridSize = 46;
        const waterRows = [2, 3, 4, 5, 6];
        
        if (!player.isInWater(waterRows, gridSize)) {
            player.onLog = false;
            player.logSpeed = 0;
            return false;
        }

        // 水中にいる場合、丸太や亀に乗っているかチェック
        const playerRect = player.getRect();
        const waterObstacles = obstacleManager.getWaterObstacles();
        
        for (let obstacle of waterObstacles) {
            if (this.checkRectCollision(playerRect, obstacle.getRect())) {
                // 丸太や亀に乗っている
                player.onLog = true;
                player.logSpeed = obstacle.speed;
                return false;
            }
        }
        
        // 水中で何にも乗っていない = 溺れる
        return true;
    }

    checkGoalCollision(player, goals) {
        const playerRect = player.getRect();
        
        for (let i = 0; i < goals.length; i++) {
            const goal = goals[i];
            if (!goal.filled && this.checkRectCollision(playerRect, goal)) {
                goal.filled = true;
                return i;
            }
        }
        return -1;
    }

    checkBoundaryCollision(player) {
        return player.x < 0 || player.x > 800 - player.size ||
               player.y > 600;
    }
}