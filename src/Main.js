(function () {
    var img;
    var el;
    var tileWidth = gh = 30;
    var data = [];
    var view;
    var perm = false;
    var debugMode = true;
    var info;
    var options = false;
    var reg = new createjs.Container;
    var grid = new createjs.Container;
    var block = new createjs.Container;
    var stage = new createjs.Container;
    var evt;
    var p = new createjs.Stage("ourCanvas");
    createjs.Ticker.addEventListener("tick", onload);
    createjs.Ticker.setFPS(60);
    p.enableMouseOver(10);
    p.addChild(reg, grid, block, stage);
    var context = new ME.Loader({
        res: [{
            id: "kls",
            src: "img/kls.png"
        }, {
            id: "map",
            src: "img/test2.jpg"
        }],
        complete: function () {
            img = context.get("map");
            init();
            _collisionDistancePrecheck();
            draw(true);
            update()
        }
    });
    context.begin()

    function onload() {
        if (evt) {
            evt.tick()
        }
        p.update()
    }
    function _collisionDistancePrecheck() {
        reg.removeAllChildren();
        el = new createjs.Bitmap(img);
        el.scaleX = info.width / img.width;
        el.scaleY = info.height / img.height;
        reg.addChild(el)
    }
    function buildGrids(result) {
        block.removeAllChildren();
        var ii = 0;
        var iLength = result.length;
        for (; ii < iLength; ii++) {
            var x = result[ii].x;
            var y = result[ii].y;
            var o = new createjs.Shape;
            o.alpha = 0.5;
            o.mapId = x + "_" + y;
            o.graphics.beginFill("red").rect(x * tileWidth, y * gh, tileWidth, gh).endFill();
            block.addChild(o)
        }
    }
    function init() {
        info = ME.Util.getViewport();
        p.canvas.width = info.width;
        p.canvas.height = info.height;
        p.on("click", function (event) {
            var x = Math.floor(event.stageX / tileWidth);
            var y = Math.floor(event.stageY / gh);
            if (perm) {
                var expectationResult = view.getPath(evt.target ? evt.target : {
                    x: evt.gx,
                    y: evt.gy
                }, {
                    x: x,
                    y: y
                });
                if (expectationResult) {
                    buildGrids(expectationResult);
                    evt.setPath(expectationResult)
                } else {
                    alert("\u4e0d\u53ef\u5230\u8fbe")
                }
            } else {
                if (data[y][x] === 0) {
                    var item = new createjs.Shape;
                    item.alpha = 0.5;
                    item.mapId = x + "_" + y;
                    item.graphics.beginFill("yellow").rect(x * tileWidth, y * gh, tileWidth, gh).endFill();
                    grid.addChild(item);
                    data[y][x] = 1
                } else {
                    removeChild(x + "_" + y);
                    data[y][x] = 0
                }
            }
        });
        p.on("pressmove", function (event) {
            if (!perm) {
                var x = Math.floor(event.stageX / tileWidth);
                var y = Math.floor(event.stageY / gh);
                if (data[y][x] === 0) {
                    var item = new createjs.Shape;
                    item.alpha = 0.5;
                    item.mapId = x + "_" + y;
                    item.graphics.beginFill("yellow").rect(x * tileWidth, y * gh, tileWidth, gh).endFill();
                    grid.addChild(item);
                    data[y][x] = 1
                }
            }
        });
        window.addEventListener("resize", ME.Util.debounce(function () {
            block.removeAllChildren();
            init();
            _collisionDistancePrecheck();
            draw(true);
            update()
        }, 100, false), false);
        var tableview = document.getElementById("testBtn");
        tableview.addEventListener("click", function () {
            perm = !perm;
            if (perm) {
                this.value = "<<<\u8fd4\u56de\u7f16\u8f91"
            } else {
                this.value = "\u63a7\u5236\u4eba\u7269\u8fd0\u52a8"
            }
        }, false);
        var button = document.getElementById("exportBtn");
        button.addEventListener("click", function () {
            console.log(JSON.stringify(data))
        }, false);
        var elem = document.getElementById("ttSlt");
        elem.onchange = function () {
            var index = elem.selectedIndex;
            var raw = elem.options[index].value;
            if (raw === "0") {
                options = false;
                view.isfourDir = options
            } else {
                options = true;
                view.isfourDir = options
            }
        };
        var that = document.getElementById("modeSlt");
        that.onchange = function () {
            var idx = that.selectedIndex;
            var raw = that.options[idx].value;
            if (raw === "0") {
                grid.visible = true;
                block.visible = true
            } else {
                grid.visible = false;
                block.visible = false
            }
        };
        var e = document.getElementById("autoEdit");
        e.onclick = function () {
            f(ME.autoMap);
            grid.visible = true;
            block.visible = true;
            that.selectedIndex = 0
        };
        var testElement = document.getElementById("ctrl1");
        var aList = document.getElementById("ctrl2");
        var paddingElement = document.getElementById("ctrl3");
        var test = document.getElementById("hideBtn");
        test.onclick = function () {
            if (testElement.style.display == "none") {
                this.value = "\u9690\u85cf\u6240\u6709\u63a7\u4ef6";
                testElement.style.display = "block";
                aList.style.display = "block";
                paddingElement.style.left = "140px"
            } else {
                this.value = "\u663e\u793a";
                testElement.style.display = "none";
                aList.style.display = "none";
                paddingElement.style.left = "0px"
            }
        };
        var lbtn = document.getElementById("clearBtn");
        lbtn.onclick = function () {
            grid.removeAllChildren();
            draw(true)
        };
        button = document.getElementById("exportBtn");
        var _this = document.getElementById("optTextarea");
        var closeBtn = document.getElementById("closeBtn");
        var popup = document.getElementById("popup");
        button.onclick = function (event) {
            popup.style.display = "block";
            _this.value = JSON.stringify(data);
            event.stopPropagation()
        };
        closeBtn.onclick = function () {
            popup.style.display = "none"
        }
    }
    function removeChild(localName) {
        var children = grid.children;
        var l = children.length;
        var i = 0;
        for (; i < l; i++) {
            var child = children[i];
            if (child.mapId === localName) {
                grid.removeChild(child);
                l--;
                break
            }
        }
    }
    function draw(dataAndEvents) {
        grid.removeAllChildren();
        if (dataAndEvents) {
            tileWidth = 30 * info.width / img.width;
            gh = 30 * info.height / img.height
        } else {
            tileWidth = gh = 30
        }
        data.length = 0;
        var padLength = Math.ceil(p.canvas.height / gh);
        var numSpaces = Math.ceil(p.canvas.width / tileWidth);
        var i = 0;
        for (; i < padLength; i++) {
            data.push([]);
            var item = new createjs.Shape;
            item.alpha = 0.4;
            item.graphics.beginStroke("red").mt(0, i * gh).lt(p.canvas.width, i * gh).endStroke();
            grid.addChild(item);
            var j = 0;
            for (; j < numSpaces; j++) {
                data[i].push(0)
            }
        }
        i = 0;
        for (; i < numSpaces; i++) {
            item = new createjs.Shape;
            item.alpha = 0.4;
            item.graphics.beginStroke("red").mt(i * tileWidth, 0).lt(i * tileWidth, p.canvas.height).endStroke();
            grid.addChild(item)
        }
        view = new ME.Astar(data, options)
    }
    function update() {
        stage.removeAllChildren();
        var texture = new createjs.SpriteSheet({
            "images": [context.get("kls")],
            "frames": {
                "regX": 37,
                "height": 111,
                "count": 64,
                "regY": 111,
                "width": 75
            },
            "animations": {
                "runD": [1, 7, "runD", 0.2],
                "runL": [9, 15, "runL", 0.2],
                "runR": [17, 23, "runR", 0.2],
                "runU": [25, 31, "runU", 0.2],
                "runLD": [33, 39, "runLD", 0.2],
                "runRD": [41, 47, "runRD", 0.2],
                "runLU": [49, 55, "runLU", 0.2],
                "runRU": [57, 63, "runRU", 0.2],
                "standLD": [32, 32, "standLD", 0.2],
                "standRD": [40, 40, "standRD", 0.2],
                "standLU": [48, 48, "standLU", 0.2],
                "standRU": [56, 56, "standRU", 0.2],
                "standD": [0, 0, "standD", 0.2],
                "standL": [8, 8, "standL", 0.2],
                "standR": [16, 16, "standR", 0.2],
                "standU": [24, 24, "standU", 0.2]
            }
        });
        var sprite = new createjs.Sprite(texture, "runD");
        sprite.scaleX = info.width / img.width;
        sprite.scaleY = info.height / img.height;
        sprite.gotoAndStop("standU");
        sprite.y = 135;
        sprite.x = 135;
        stage.addChild(sprite);
        evt = new ME.Role({
            gx: 14,
            gy: 14,
            gw: tileWidth,
            gh: gh,
            dir: "right",
            speed: 2,
            sprite: sprite
        });
        window.role = evt
    }
    function f(a) {
        grid.removeAllChildren();
        draw(true);
        var al = a.length;
        var valuesLen = a[0].length;
        data = JSON.parse(JSON.stringify(a));
        view = new ME.Astar(data, options);
        var i = 0;
        for (; i < valuesLen; i++) {
            var j = 0;
            for (; j < al; j++) {
                if (data[j][i]) {
                    removeChild(i + "_" + j);
                    var item = new createjs.Shape;
                    item.alpha = 0.5;
                    item.mapId = i + "_" + j;
                    item.graphics.beginFill("yellow").rect(i * tileWidth, j * gh, tileWidth, gh).endFill();
                    grid.addChild(item)
                }
            }
        }
    }
    
})();