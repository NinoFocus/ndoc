var Cache = {

    _cache: {},

    enable: false,

    has: function(key) {
        if(!this.enable) return;

        return this._cache[key] !== void 0;
    },

    set: function(key, value) {
        if(!this.enable) return;

        this._cache[key] = value;
    },

    get: function(key) {
        if(!this.enable) return;

        return this._cache[key];
    },

    clear: function() {
        this._cache = {};
    }
}

module.exports = Cache;
