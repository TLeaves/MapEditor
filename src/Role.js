; (function () {
    
    var Role = function (option) {
        this.gx = option.gx;
        this.gy = option.gy;
        this.gw=option.gw;
        this.gh=option.gh;
        this.x = this.gx * option.gw + option.gw / 2;
        this.y = this.gy * option.gh + option.gh / 2;
        this.dir = option.dir;
        this.speed = option.speed;
       
        this.angle = Math.atan(option.gh / option.gw);
        

        this.sprite = option.sprite;

        this.path = [];
        this.setSpeed(this.dir);
        this.target = null;
        this.render();
    }

    Role.prototype = {
        setPath: function (path) {
       
            path.shift();
            this.path = path;
            
        },
        setSpeed: function (dir) {
            switch (dir) {
                case "down":
                    this.speedX = 0;
                    this.speedY = this.speed;
                    break;
                case "right":
                    this.speedX = this.speed;
                    this.speedY = 0;
                    break;
                case "up":
                    this.speedX = 0;
                    this.speedY = this.speed * -1;
                    break;
                case "left":
                    this.speedX = this.speed * -1;
                    this.speedY = 0;
                    break;
                case "right-down":
                    this.speedX = this.speed * Math.cos(this.angle);
                    this.speedY = this.speed * Math.sin(this.angle);
                    break;
                case "right-up":
                    this.speedX = this.speed * Math.cos(this.angle);
                    this.speedY = this.speed * Math.sin(this.angle) * -1;
                    break;
                case "left-down":
                    this.speedX = this.speed * Math.cos(this.angle) * -1;
                    this.speedY = this.speed * Math.sin(this.angle);
                    break;
                case "left-up":
                    this.speedX = this.speed * Math.cos(this.angle) * -1;
                    this.speedY = this.speed * Math.sin(this.angle) * -1;
                    break;
            }
            this.dir = dir;
        },
        moveTo: function (gx, gy) {
            var dir = this.getDir(gx, gy);
            
            if (this.dir !== dir) {
                this.setSpeed(dir);
            }

            this.x += this.speedX;
           
            this.y += this.speedY;

            var x=gx * this.gw + this.gw / 2;
            var y=gy * this.gh + this.gh / 2;

            var dx = x - this.x, dy = y - this.y;
             
            if (dx * dx + dy * dy < 9) {
                this.x = x;
                this.y = y;
                this.target = null;
                this.gx = gx;
                this.gy = gy;

                if (this.path.length === 0) {
                    this.dir === "right" && this.sprite.currentAnimation !== "standR" && this.sprite.gotoAndStop("standR");
                    this.dir === "left" && this.sprite.currentAnimation !== "standL" && this.sprite.gotoAndStop("standL");
                    this.dir === "down" && this.sprite.currentAnimation !== "standD" && this.sprite.gotoAndStop("standD");
                    this.dir === "up" && this.sprite.currentAnimation !== "standU" && this.sprite.gotoAndStop("standU");
                    this.dir === "right-down" && this.sprite.currentAnimation !== "standRD" && this.sprite.gotoAndStop("standRD");
                    this.dir === "right-up" && this.sprite.currentAnimation !== "standRU" && this.sprite.gotoAndStop("standRU");
                    this.dir === "left-down" && this.sprite.currentAnimation !== "standLD" && this.sprite.gotoAndStop("standLD");
                    this.dir === "left-up" && this.sprite.currentAnimation !== "standLU" && this.sprite.gotoAndStop("standLU")
                }
            }

        },
        render: function () {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
        },
        getDir: function (tx,ty) {
            var dx =tx- this.gx  ;
            var dy = ty - this.gy;
            
            if (dx === 0) {
                if (dy === 1) {
                    return "down";
                } else if (dy === -1) {
                    return "up";
                }
            }

            if (dx === 1) {
                if (dy === 1) {
                    return "right-down";
                } else if (dy === -1) {
                    return "right-up";
                } else if (dy === 0) {
                    return "right";
                }
            }

            if (dx === -1) {
                if (dy === 1) {
                    return "left-down";
                } else if (dy === -1) {
                    return "left-up";
                } else if (dy === 0) {
                    return "left";
                }
            }
        },
        tick: function () {
            if (!this.target && this.path.length > 0) {
                this.target = this.path.shift();
                var dir = this.getDir(this.target.x, this.target.y);
                dir === "right" && this.sprite.currentAnimation !== "runR" && this.sprite.gotoAndPlay("runR");
                dir === "left" && this.sprite.currentAnimation !== "runL" && this.sprite.gotoAndPlay("runL");
                dir === "down" && this.sprite.currentAnimation !== "runD" && this.sprite.gotoAndPlay("runD");
                dir === "up" && this.sprite.currentAnimation !== "runU" && this.sprite.gotoAndPlay("runU");
                dir === "right-down" && this.sprite.currentAnimation !== "runRD" && this.sprite.gotoAndPlay("runRD");
                dir === "right-up" && this.sprite.currentAnimation !== "runRU" && this.sprite.gotoAndPlay("runRU");
                dir === "left-down" && this.sprite.currentAnimation !== "runLD" && this.sprite.gotoAndPlay("runLD");
                dir === "left-up" && this.sprite.currentAnimation !== "runLU" && this.sprite.gotoAndPlay("runLU")
            };
            if (this.target) {
               
               
                this.moveTo(this.target.x, this.target.y);
                this.render();
            }
        }

    }

    ME.Role = Role;
})();