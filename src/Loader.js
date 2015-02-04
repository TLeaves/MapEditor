; (function () {

    var Loader = function (option) {
        this.res = option.res;
        this.complete = option.complete;
        this.progress = option.progress;

        this._loadedCount = 0;
        this._loadedRes = {};
    }

    Loader.prototype = {
        begin: function () {
            for (var i = 0, len = this.res.length; i < len; i++) {
                this._loadImg(this.res[i])
            }
        },
        _loadImg: function (item) {
            var self = this;
            var img = new Image();
            var len = this.res.length;
            img.src = item.src;
            img.onload = function () {
                self._loadedCount++;
                self._loadedRes[item.id] = img;
                if (self._loadedCount === len) {
                    self.complete();
                }
            }
        },
        get: function (id) {
            return this._loadedRes[id];
        }
    }

    ME.Loader = Loader;
})();