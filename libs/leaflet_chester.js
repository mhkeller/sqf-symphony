/*
 Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 Leaflet is a modern open-source JavaScript library for interactive maps.
 http://leaflet.cloudmade.com
*/
var q = 0;
(function (a) {
    a.L = {
        VERSION: "0.3",
        ROOT_URL: a.L_ROOT_URL ||
        function () {
            var a = document.getElementsByTagName("script"),
                b = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/,
                c, d, e, f;
            for (c = 0, d = a.length; c < d; c++) {
                e = a[c].src, f = e.match(b);
                if (f) return f[1] === "include" ? "../../dist/" : e.replace(b, "") + "/"
            }
            return ""
        }(),
        noConflict: function () {
            return a.L = this._originalL, this
        },
        _originalL: a.L
    }
})(this), L.Util = {
    extend: function (a) {
        var b = Array.prototype.slice.call(arguments, 1);
        for (var c = 0, d = b.length, e; c < d; c++) {
            e = b[c] || {};
            for (var f in e) e.hasOwnProperty(f) && (a[f] = e[f])
        }
        return a
    },
    bind: function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    },
    stamp: function () {
        var a = 0,
            b = "_leaflet_id";
        return function (c) {
            return c[b] = c[b] || ++a, c[b]
        }
    }(),
    requestAnimFrame: function () {
        function a(a) {
            window.setTimeout(a, 1e3 / 60)
        }
        var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || a;
        return function (c, d, e, f) {
            c = d ? L.Util.bind(c, d) : c, e && b === a ? c() : b(c, f)
        }
    }(),
    limitExecByInterval: function (a, b, c) {
        function g() {
            d = !1, e && (f.callee.apply(c, f), e = !1)
        }
        var d, e, f;
        return function () {
            f = arguments, d ? e = !0 : (d = !0, setTimeout(g, b), a.apply(c, f))
        }
    },
    falseFn: function () {
        return !1
    },
    formatNum: function (a, b) {
        var c = Math.pow(10, b || 5);
        return Math.round(a * c) / c
    },
    setOptions: function (a, b) {
        a.options = L.Util.extend({}, a.options, b)
    },
    getParamString: function (a) {
        var b = [];
        for (var c in a) a.hasOwnProperty(c) && b.push(c + "=" + a[c]);
        return "?" + b.join("&")
    },
    template: function (a, b) {
        return a.replace(/\{ *([\w_]+) *\}/g, function (a, c) {
            var d = b[c];
            if (!b.hasOwnProperty(c)) throw Error("No value provided for variable " + a);
            return d
        })
    }
}, L.Class = function () {}, L.Class.extend = function (a) {
    var b = function () {
            this.initialize && this.initialize.apply(this, arguments)
        },
        c = function () {};
    c.prototype = this.prototype;
    var d = new c;
    d.constructor = b, b.prototype = d, b.superclass = this.prototype;
    for (var e in this) this.hasOwnProperty(e) && e !== "prototype" && e !== "superclass" && (b[e] = this[e]);
    return a.statics && (L.Util.extend(b, a.statics), delete a.statics), a.includes && (L.Util.extend.apply(null, [d].concat(a.includes)), delete a.includes), a.options && d.options && (a.options = L.Util.extend({}, d.options, a.options)), L.Util.extend(d, a), b.extend = L.Class.extend, b.include = function (a) {
        L.Util.extend(this.prototype, a)
    }, b
}, L.Mixin = {}, L.Mixin.Events = {
    addEventListener: function (a, b, c) {
        var d = this._leaflet_events = this._leaflet_events || {};
        return d[a] = d[a] || [], d[a].push({
            action: b,
            context: c || this
        }), this
    },
    hasEventListeners: function (a) {
        var b = "_leaflet_events";
        return b in this && a in this[b] && this[b][a].length > 0
    },
    removeEventListener: function (a, b, c) {
        if (!this.hasEventListeners(a)) return this;
        for (var d = 0, e = this._leaflet_events, f = e[a].length; d < f; d++) if (e[a][d].action === b && (!c || e[a][d].context === c)) return e[a].splice(d, 1), this;
        return this
    },
    fireEvent: function (a, b) {
        if (!this.hasEventListeners(a)) return this;
        var c = L.Util.extend({
            type: a,
            target: this
        }, b),
            d = this._leaflet_events[a].slice();
        for (var e = 0, f = d.length; e < f; e++) d[e].action.call(d[e].context || this, c);
        return this
    }
}, L.Mixin.Events.on = L.Mixin.Events.addEventListener, L.Mixin.Events.off = L.Mixin.Events.removeEventListener, L.Mixin.Events.fire = L.Mixin.Events.fireEvent, function () {
    var a = navigator.userAgent.toLowerCase(),
        b = !! window.ActiveXObject,
        c = a.indexOf("webkit") !== -1,
        d = typeof orientation != "undefined" ? !0 : !1,
        e = a.indexOf("android") !== -1,
        f = window.opera;
    L.Browser = {
        ie: b,
        ie6: b && !window.XMLHttpRequest,
        webkit: c,
        webkit3d: c && "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix,
        gecko: a.indexOf("gecko") !== -1,
        opera: f,
        android: e,
        mobileWebkit: d && c,
        mobileOpera: d && f,
        mobile: d,
        touch: function () {
            var a = !1,
                b = "ontouchstart";
            if (b in document.documentElement) return !0;
            var c = document.createElement("div");
            return !c.setAttribute || !c.removeAttribute ? !1 : (c.setAttribute(b, "return;"), typeof c[b] == "function" && (a = !0), c.removeAttribute(b), c = null, a)
        }()
    }
}(), L.Point = function (a, b, c) {
    this.x = c ? Math.round(a) : a, this.y = c ? Math.round(b) : b
}, L.Point.prototype = {
    add: function (a) {
        return this.clone()._add(a)
    },
    _add: function (a) {
        return this.x += a.x, this.y += a.y, this
    },
    subtract: function (a) {
        return this.clone()._subtract(a)
    },
    _subtract: function (a) {
        return this.x -= a.x, this.y -= a.y, this
    },
    divideBy: function (a, b) {
        return new L.Point(this.x / a, this.y / a, b)
    },
    multiplyBy: function (a) {
        return new L.Point(this.x * a, this.y * a)
    },
    distanceTo: function (a) {
        var b = a.x - this.x,
            c = a.y - this.y;
        return Math.sqrt(b * b + c * c)
    },
    round: function () {
        return this.clone()._round()
    },
    _round: function () {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this
    },
    clone: function () {
        return new L.Point(this.x, this.y)
    },
    toString: function () {
        return "Point(" + L.Util.formatNum(this.x) + ", " + L.Util.formatNum(this.y) + ")"
    }
}, L.Bounds = L.Class.extend({
    initialize: function (a, b) {
        if (!a) return;
        var c = a instanceof Array ? a : [a, b];
        for (var d = 0, e = c.length; d < e; d++) this.extend(c[d])
    },
    extend: function (a) {
        !this.min && !this.max ? (this.min = new L.Point(a.x, a.y), this.max = new L.Point(a.x, a.y)) : (this.min.x = Math.min(a.x, this.min.x), this.max.x = Math.max(a.x, this.max.x), this.min.y = Math.min(a.y, this.min.y), this.max.y = Math.max(a.y, this.max.y))
    },
    getCenter: function (a) {
        return new L.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, a)
    },
    contains: function (a) {
        var b, c;
        return a instanceof L.Bounds ? (b = a.min, c = a.max) : b = c = a, b.x >= this.min.x && c.x <= this.max.x && b.y >= this.min.y && c.y <= this.max.y
    },
    intersects: function (a) {
        var b = this.min,
            c = this.max,
            d = a.min,
            e = a.max,
            f = e.x >= b.x && d.x <= c.x,
            g = e.y >= b.y && d.y <= c.y;
        return f && g
    }
}), L.Transformation = L.Class.extend({
    initialize: function (a, b, c, d) {
        this._a = a, this._b = b, this._c = c, this._d = d
    },
    transform: function (a, b) {
        return this._transform(a.clone(), b)
    },
    _transform: function (a, b) {
        return b = b || 1, a.x = b * (this._a * a.x + this._b), a.y = b * (this._c * a.y + this._d), a
    },
    untransform: function (a, b) {
        return b = b || 1, new L.Point((a.x / b - this._b) / this._a, (a.y / b - this._d) / this._c)
    }
}), L.DomUtil = {
    get: function (a) {
        return typeof a == "string" ? document.getElementById(a) : a
    },
    getStyle: function (a, b) {
        var c = a.style[b];
        !c && a.currentStyle && (c = a.currentStyle[b]);
        if (!c || c === "auto") {
            var d = document.defaultView.getComputedStyle(a, null);
            c = d ? d[b] : null
        }
        return c === "auto" ? null : c
    },
    getViewportOffset: function (a) {
        var b = 0,
            c = 0,
            d = a,
            e = document.body;
        do {
            b += d.offsetTop || 0, c += d.offsetLeft || 0;
            if (d.offsetParent === e && L.DomUtil.getStyle(d, "position") === "absolute") break;
            d = d.offsetParent
        } while (d);
        d = a;
        do {
            if (d === e) break;
            b -= d.scrollTop || 0, c -= d.scrollLeft || 0, d = d.parentNode
        } while (d);
        return new L.Point(c, b)
    },
    create: function (a, b, c) {
        var d = document.createElement(a);
        return d.className = b, c && c.appendChild(d), d
    },
    disableTextSelection: function () {
        document.selection && document.selection.empty && document.selection.empty(), this._onselectstart || (this._onselectstart = document.onselectstart, document.onselectstart = L.Util.falseFn)
    },
    enableTextSelection: function () {
        document.onselectstart = this._onselectstart, this._onselectstart = null
    },
    hasClass: function (a, b) {
        return a.className.length > 0 && RegExp("(^|\\s)" + b + "(\\s|$)").test(a.className)
    },
    addClass: function (a, b) {
        L.DomUtil.hasClass(a, b) || (a.className += (a.className ? " " : "") + b)
    },
    removeClass: function (a, b) {
        a.className = a.className.replace(/(\S+)\s*/g, function (a, c) {
            return c === b ? "" : a
        }).replace(/^\s+/, "")
    },
    setOpacity: function (a, b) {
        L.Browser.ie ? a.style.filter = "alpha(opacity=" + Math.round(b * 100) + ")" : a.style.opacity = b
    },
    testProp: function (a) {
        var b = document.documentElement.style;
        for (var c = 0; c < a.length; c++) if (a[c] in b) return a[c];
        return !1
    },
    getTranslateString: function (a) {
        return L.DomUtil.TRANSLATE_OPEN + a.x + "px," + a.y + "px" + L.DomUtil.TRANSLATE_CLOSE
    },
    getScaleString: function (a, b) {
        var c = L.DomUtil.getTranslateString(b),
            d = " scale(" + a + ") ",
            e = L.DomUtil.getTranslateString(b.multiplyBy(-1));
        return c + d + e
    },
    setPosition: function (a, b) {
        a._leaflet_pos = b, L.Browser.webkit3d ? (a.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(b), L.Browser.android && (a.style["-webkit-perspective"] = "1000", a.style["-webkit-backface-visibility"] = "hidden")) : (a.style.left = b.x + "px", a.style.top = b.y + "px")
    },
    getPosition: function (a) {
        return a._leaflet_pos
    }
}, L.Util.extend(L.DomUtil, {
    TRANSITION: L.DomUtil.testProp(["transition", "webkitTransition", "OTransition", "MozTransition", "msTransition"]),
    TRANSFORM: L.DomUtil.testProp(["transformProperty", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]),
    TRANSLATE_OPEN: "translate" + (L.Browser.webkit3d ? "3d(" : "("),
    TRANSLATE_CLOSE: L.Browser.webkit3d ? ",0)" : ")"
}), L.LatLng = function (a, b, c) {
    var d = parseFloat(a),
        e = parseFloat(b);
    if (isNaN(d) || isNaN(e)) throw Error("Invalid LatLng object: (" + a + ", " + b + ")");
    c !== !0 && (d = Math.max(Math.min(d, 90), -90), e = (e + 180) % 360 + (e < -180 || e === 180 ? 180 : -180)), this.lat = d, this.lng = e
}, L.Util.extend(L.LatLng, {
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    MAX_MARGIN: 1e-9
}), L.LatLng.prototype = {
    equals: function (a) {
        if (a instanceof L.LatLng) {
            var b = Math.max(Math.abs(this.lat - a.lat), Math.abs(this.lng - a.lng));
            return b <= L.LatLng.MAX_MARGIN
        }
        return !1
    },
    toString: function () {
        return "LatLng(" + L.Util.formatNum(this.lat) + ", " + L.Util.formatNum(this.lng) + ")"
    },
    distanceTo: function (a) {
        var b = 6378137,
            c = L.LatLng.DEG_TO_RAD,
            d = (a.lat - this.lat) * c,
            e = (a.lng - this.lng) * c,
            f = this.lat * c,
            g = a.lat * c,
            h = Math.sin(d / 2),
            i = Math.sin(e / 2),
            j = h * h + i * i * Math.cos(f) * Math.cos(g);
        return b * 2 * Math.atan2(Math.sqrt(j), Math.sqrt(1 - j))
    }
}, L.LatLngBounds = L.Class.extend({
    initialize: function (a, b) {
        if (!a) return;
        var c = a instanceof Array ? a : [a, b];
        for (var d = 0, e = c.length; d < e; d++) this.extend(c[d])
    },
    extend: function (a) {
        !this._southWest && !this._northEast ? (this._southWest = new L.LatLng(a.lat, a.lng, !0), this._northEast = new L.LatLng(a.lat, a.lng, !0)) : (this._southWest.lat = Math.min(a.lat, this._southWest.lat), this._southWest.lng = Math.min(a.lng, this._southWest.lng), this._northEast.lat = Math.max(a.lat, this._northEast.lat), this._northEast.lng = Math.max(a.lng, this._northEast.lng))
    },
    getCenter: function () {
        return new L.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
    },
    getSouthWest: function () {
        return this._southWest
    },
    getNorthEast: function () {
        return this._northEast
    },
    getNorthWest: function () {
        return new L.LatLng(this._northEast.lat, this._southWest.lng, !0)
    },
    getSouthEast: function () {
        return new L.LatLng(this._southWest.lat, this._northEast.lng, !0)
    },
    contains: function (a) {
        var b = this._southWest,
            c = this._northEast,
            d, e;
        return a instanceof L.LatLngBounds ? (d = a.getSouthWest(), e = a.getNorthEast()) : d = e = a, d.lat >= b.lat && e.lat <= c.lat && d.lng >= b.lng && e.lng <= c.lng
    },
    intersects: function (a) {
        var b = this._southWest,
            c = this._northEast,
            d = a.getSouthWest(),
            e = a.getNorthEast(),
            f = e.lat >= b.lat && d.lat <= c.lat,
            g = e.lng >= b.lng && d.lng <= c.lng;
        return f && g
    },
    toBBoxString: function () {
        var a = this._southWest,
            b = this._northEast;
        return [a.lng, a.lat, b.lng, b.lat].join(",")
    }
}), L.Projection = {}, L.Projection.SphericalMercator = {
    MAX_LATITUDE: 85.0511287798,
    project: function (a) {
        var b = L.LatLng.DEG_TO_RAD,
            c = this.MAX_LATITUDE,
            d = Math.max(Math.min(c, a.lat), -c),
            e = a.lng * b,
            f = d * b;
        return f = Math.log(Math.tan(Math.PI / 4 + f / 2)), new L.Point(e, f)
    },
    unproject: function (a, b) {
        var c = L.LatLng.RAD_TO_DEG,
            d = a.x * c,
            e = (2 * Math.atan(Math.exp(a.y)) - Math.PI / 2) * c;
        return new L.LatLng(e, d, b)
    }
}, L.Projection.LonLat = {
    project: function (a) {
        return new L.Point(a.lng, a.lat)
    },
    unproject: function (a, b) {
        return new L.LatLng(a.y, a.x, b)
    }
}, L.CRS = {
    latLngToPoint: function (a, b) {
        var c = this.projection.project(a);
        return this.transformation._transform(c, b)
    },
    pointToLatLng: function (a, b, c) {
        var d = this.transformation.untransform(a, b);
        return this.projection.unproject(d, c)
    },
    project: function (a) {
        return this.projection.project(a)
    }
}, L.CRS.EPSG3857 = L.Util.extend({}, L.CRS, {
    code: "EPSG:3857",
    projection: L.Projection.SphericalMercator,
    transformation: new L.Transformation(.5 / Math.PI, .5, -0.5 / Math.PI, .5),
    project: function (a) {
        var b = this.projection.project(a),
            c = 6378137;
        return b.multiplyBy(c)
    }
}), L.CRS.EPSG900913 = L.Util.extend({}, L.CRS.EPSG3857, {
    code: "EPSG:900913"
}), L.CRS.EPSG4326 = L.Util.extend({}, L.CRS, {
    code: "EPSG:4326",
    projection: L.Projection.LonLat,
    transformation: new L.Transformation(1 / 360, .5, -1 / 360, .5)
}), L.Map = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
        crs: L.CRS.EPSG3857 || L.CRS.EPSG4326,
        scale: function (a) {
            return 256 * Math.pow(2, a)
        },
        center: null,
        zoom: null,
        layers: [],
        dragging: !0,
        touchZoom: L.Browser.touch && !L.Browser.android,
        scrollWheelZoom: !L.Browser.touch,
        doubleClickZoom: !0,
        boxZoom: !0,
        zoomControl: !0,
        attributionControl: !0,
        fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android,
        zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android && !L.Browser.mobileOpera,
        trackResize: !0,
        closePopupOnClick: !0,
        worldCopyJump: !0
    },
    initialize: function (a, b) {
        L.Util.setOptions(this, b), this._container = L.DomUtil.get(a);
        if (this._container._leaflet) throw Error("Map container is already initialized.");
        this._container._leaflet = !0, this._initLayout(), L.DomEvent && (this._initEvents(), L.Handler && this._initInteraction(), L.Control && this._initControls()), this.options.maxBounds && this.setMaxBounds(this.options.maxBounds);
        var c = this.options.center,
            d = this.options.zoom;
        c !== null && d !== null && this.setView(c, d, !0);
        var e = this.options.layers;
        e = e instanceof Array ? e : [e], this._tileLayersNum = 0, this._initLayers(e)
    },
    setView: function (a, b) {
        return this._resetView(a, this._limitZoom(b)), this
    },
    setZoom: function (a) {
        return this.setView(this.getCenter(), a)
    },
    zoomIn: function () {
        return this.setZoom(this._zoom + 1)
    },
    zoomOut: function () {
        return this.setZoom(this._zoom - 1)
    },
    fitBounds: function (a) {
        var b = this.getBoundsZoom(a);
        return this.setView(a.getCenter(), b)
    },
    fitWorld: function () {
        var a = new L.LatLng(-60, -170),
            b = new L.LatLng(85, 179);
        return this.fitBounds(new L.LatLngBounds(a, b))
    },
    panTo: function (a) {
        return this.setView(a, this._zoom)
    },
    panBy: function (a) {
        return this.fire("movestart"), this._rawPanBy(a), this.fire("move"), this.fire("moveend"), this
    },
    setMaxBounds: function (a) {
        this.options.maxBounds = a;
        if (!a) return this._boundsMinZoom = null, this;
        var b = this.getBoundsZoom(a, !0);
        return this._boundsMinZoom = b, this._loaded && (this._zoom < b ? this.setView(a.getCenter(), b) : this.panInsideBounds(a)), this
    },
    panInsideBounds: function (a) {
        var b = this.getBounds(),
            c = this.project(b.getSouthWest()),
            d = this.project(b.getNorthEast()),
            e = this.project(a.getSouthWest()),
            f = this.project(a.getNorthEast()),
            g = 0,
            h = 0;
        return d.y < f.y && (h = f.y - d.y), d.x > f.x && (g = f.x - d.x), c.y > e.y && (h = e.y - c.y), c.x < e.x && (g = e.x - c.x), this.panBy(new L.Point(g, h, !0))
    },
    addLayer: function (a, b) {
        var c = L.Util.stamp(a);
        if (this._layers[c]) return this;
        this._layers[c] = a, a.options && !isNaN(a.options.maxZoom) && (this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, a.options.maxZoom)), a.options && !isNaN(a.options.minZoom) && (this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, a.options.minZoom)), this.options.zoomAnimation && L.TileLayer && a instanceof L.TileLayer && (this._tileLayersNum++, a.on("load", this._onTileLayerLoad, this)), this.attributionControl && a.getAttribution && this.attributionControl.addAttribution(a.getAttribution());
        var d = function () {
                a.onAdd(this, b), this.fire("layeradd", {
                    layer: a
                })
            };
        return this._loaded ? d.call(this) : this.on("load", d, this), this
    },
    removeLayer: function (a) {
        var b = L.Util.stamp(a);
        return this._layers[b] && (a.onRemove(this), delete this._layers[b], this.options.zoomAnimation && L.TileLayer && a instanceof L.TileLayer && (this._tileLayersNum--, a.off("load", this._onTileLayerLoad, this)), this.attributionControl && a.getAttribution && this.attributionControl.removeAttribution(a.getAttribution()), this.fire("layerremove", {
            layer: a
        })), this
    },
    hasLayer: function (a) {
        var b = L.Util.stamp(a);
        return this._layers.hasOwnProperty(b)
    },
    invalidateSize: function () {
        var a = this.getSize();
        return this._sizeChanged = !0, this.options.maxBounds && this.setMaxBounds(this.options.maxBounds), this._loaded ? (this._rawPanBy(a.subtract(this.getSize()).divideBy(2, !0)), this.fire("move"), clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(L.Util.bind(function () {
            this.fire("moveend")
        }, this), 200), this) : this
    },
    getCenter: function (a) {
        var b = this.getSize().divideBy(2),
            c = this._getTopLeftPoint().add(b);
        return this.unproject(c, this._zoom, a)
    },
    getZoom: function () {
        return this._zoom
    },
    getBounds: function () {
        var a = this.getPixelBounds(),
            b = this.unproject(new L.Point(a.min.x, a.max.y), this._zoom, !0),
            c = this.unproject(new L.Point(a.max.x, a.min.y), this._zoom, !0);
        return new L.LatLngBounds(b, c)
    },
    getMinZoom: function () {
        var a = this.options.minZoom || 0,
            b = this._layersMinZoom || 0,
            c = this._boundsMinZoom || 0;
        return Math.max(a, b, c)
    },
    getMaxZoom: function () {
        var a = isNaN(this.options.maxZoom) ? Infinity : this.options.maxZoom,
            b = this._layersMaxZoom || Infinity;
        return Math.min(a, b)
    },
    getBoundsZoom: function (a, b) {
        var c = this.getSize(),
            d = this.options.minZoom || 0,
            e = this.getMaxZoom(),
            f = a.getNorthEast(),
            g = a.getSouthWest(),
            h, i, j, k = !0;
        b && d--;
        do d++, i = this.project(f, d), j = this.project(g, d), h = new L.Point(i.x - j.x, j.y - i.y), b ? k = h.x < c.x || h.y < c.y : k = h.x <= c.x && h.y <= c.y;
        while (k && d <= e);
        return k && b ? null : b ? d : d - 1
    },
    getSize: function () {
        if (!this._size || this._sizeChanged) this._size = new L.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1;
        return this._size
    },
    getPixelBounds: function () {
        var a = this._getTopLeftPoint(),
            b = this.getSize();
        return new L.Bounds(a, a.add(b))
    },
    getPixelOrigin: function () {
        return this._initialTopLeftPoint
    },
    getPanes: function () {
        return this._panes
    },
    mouseEventToContainerPoint: function (a) {
        return L.DomEvent.getMousePosition(a, this._container)
    },
    mouseEventToLayerPoint: function (a) {
        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(a))
    },
    mouseEventToLatLng: function (a) {
        return this.layerPointToLatLng(this.mouseEventToLayerPoint(a))
    },
    containerPointToLayerPoint: function (a) {
        return a.subtract(L.DomUtil.getPosition(this._mapPane))
    },
    layerPointToContainerPoint: function (a) {
        return a.add(L.DomUtil.getPosition(this._mapPane))
    },
    layerPointToLatLng: function (a) {
        return this.unproject(a.add(this._initialTopLeftPoint))
    },
    latLngToLayerPoint: function (a) {
        return this.project(a)._round()._subtract(this._initialTopLeftPoint)
    },
    project: function (a, b) {
        return b = typeof b == "undefined" ? this._zoom : b, this.options.crs.latLngToPoint(a, this.options.scale(b))
    },
    unproject: function (a, b, c) {
        return b = typeof b == "undefined" ? this._zoom : b, this.options.crs.pointToLatLng(a, this.options.scale(b), c)
    },
    _initLayout: function () {
        var a = this._container;
        a.innerHTML = "", a.className += " leaflet-container", this.options.fadeAnimation && (a.className += " leaflet-fade-anim");
        var b = L.DomUtil.getStyle(a, "position");
        b !== "absolute" && b !== "relative" && (a.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
    },
    _initPanes: function () {
        var a = this._panes = {};
        this._mapPane = a.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = a.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), this._objectsPane = a.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), a.shadowPane = this._createPane("leaflet-shadow-pane"), a.overlayPane = this._createPane("leaflet-overlay-pane"), a.markerPane = this._createPane("leaflet-marker-pane"), a.popupPane = this._createPane("leaflet-popup-pane")
    },
    _createPane: function (a, b) {
        return L.DomUtil.create("div", a, b || this._objectsPane)
    },
    _resetView: function (a, b, c, d) {
        var e = this._zoom !== b;
        d || (this.fire("movestart"), e && this.fire("zoomstart")), this._zoom = b, this._initialTopLeftPoint = this._getNewTopLeftPoint(a);
        if (!c) L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
        else {
            var f = L.DomUtil.getPosition(this._mapPane);
            this._initialTopLeftPoint._add(f)
        }
        this._tileLayersToLoad = this._tileLayersNum, this.fire("viewreset", {
            hard: !c
        }), this.fire("move"), (e || d) && this.fire("zoomend"), this.fire("moveend"), this._loaded || (this._loaded = !0, this.fire("load"))
    },
    _initLayers: function (a) {
        this._layers = {};
        var b, c;
        for (b = 0, c = a.length; b < c; b++) this.addLayer(a[b])
    },
    _initControls: function () {
        this.options.zoomControl && this.addControl(new L.Control.Zoom), this.options.attributionControl && (this.attributionControl = new L.Control.Attribution, this.addControl(this.attributionControl))
    },
    _rawPanBy: function (a) {
        var b = L.DomUtil.getPosition(this._mapPane);
        L.DomUtil.setPosition(this._mapPane, b.subtract(a))
    },
    _initEvents: function () {
        L.DomEvent.addListener(this._container, "click", this._onMouseClick, this);
        var a = ["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "contextmenu"],
            b, c;
        for (b = 0, c = a.length; b < c; b++) L.DomEvent.addListener(this._container, a[b], this._fireMouseEvent, this);
        this.options.trackResize && L.DomEvent.addListener(window, "resize", this._onResize, this)
    },
    _onResize: function () {
        L.Util.requestAnimFrame(this.invalidateSize, this, !1, this._container)
    },
    _onMouseClick: function (a) {
        if (!this._loaded || this.dragging && this.dragging.moved()) return;
        this.fire("pre" + a.type), this._fireMouseEvent(a)
    },
    _fireMouseEvent: function (a) {
        if (!this._loaded) return;
        var b = a.type;
        b = b === "mouseenter" ? "mouseover" : b === "mouseleave" ? "mouseout" : b;
        if (!this.hasEventListeners(b)) return;
        b === "contextmenu" && L.DomEvent.preventDefault(a), this.fire(b, {
            latlng: this.mouseEventToLatLng(a),
            layerPoint: this.mouseEventToLayerPoint(a)
        })
    },
    _initInteraction: function () {
        var a = {
            dragging: L.Map.Drag,
            touchZoom: L.Map.TouchZoom,
            doubleClickZoom: L.Map.DoubleClickZoom,
            scrollWheelZoom: L.Map.ScrollWheelZoom,
            boxZoom: L.Map.BoxZoom
        },
            b;
        for (b in a) a.hasOwnProperty(b) && a[b] && (this[b] = new a[b](this), this.options[b] && this[b].enable())
    },
    _onTileLayerLoad: function () {
        this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this._tileBg && (clearTimeout(this._clearTileBgTimer), this._clearTileBgTimer = setTimeout(L.Util.bind(this._clearTileBg, this), 500))
    },
    _getTopLeftPoint: function () {
        if (!this._loaded) throw Error("Set map center and zoom first.");
        var a = L.DomUtil.getPosition(this._mapPane);
        return this._initialTopLeftPoint.subtract(a)
    },
    _getNewTopLeftPoint: function (a) {
        var b = this.getSize().divideBy(2);
        return this.project(a).subtract(b).round()
    },
    _limitZoom: function (a) {
        var b = this.getMinZoom(),
            c = this.getMaxZoom();
        return Math.max(b, Math.min(c, a))
    }
}), L.Projection.Mercator = {
    MAX_LATITUDE: 85.0840591556,
    R_MINOR: 6356752.3142,
    R_MAJOR: 6378137,
    project: function (a) {
        var b = L.LatLng.DEG_TO_RAD,
            c = this.MAX_LATITUDE,
            d = Math.max(Math.min(c, a.lat), -c),
            e = this.R_MAJOR,
            f = this.R_MINOR,
            g = a.lng * b * e,
            h = d * b,
            i = f / e,
            j = Math.sqrt(1 - i * i),
            k = j * Math.sin(h);
        k = Math.pow((1 - k) / (1 + k), j * .5);
        var l = Math.tan(.5 * (Math.PI * .5 - h)) / k;
        return h = -f * Math.log(l), new L.Point(g, h)
    },
    unproject: function (a, b) {
        var c = L.LatLng.RAD_TO_DEG,
            d = this.R_MAJOR,
            e = this.R_MINOR,
            f = a.x * c / d,
            g = e / d,
            h = Math.sqrt(1 - g * g),
            i = Math.exp(-a.y / e),
            j = Math.PI / 2 - 2 * Math.atan(i),
            k = 15,
            l = 1e-7,
            m = k,
            n = .1,
            o;
        while (Math.abs(n) > l && --m > 0) o = h * Math.sin(j), n = Math.PI / 2 - 2 * Math.atan(i * Math.pow((1 - o) / (1 + o), .5 * h)) - j, j += n;
        return new L.LatLng(j * c, f, b)
    }
}, L.CRS.EPSG3395 = L.Util.extend({}, L.CRS, {
    code: "EPSG:3395",
    projection: L.Projection.Mercator,
    transformation: function () {
        var a = L.Projection.Mercator,
            b = a.R_MAJOR,
            c = a.R_MINOR;
        return new L.Transformation(.5 / (Math.PI * b), .5, -0.5 / (Math.PI * c), .5)
    }()
}), L.TileLayer = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
        minZoom: 0,
        maxZoom: 18,
        tileSize: 256,
        subdomains: "abc",
        errorTileUrl: "",
        attribution: "",
        opacity: 1,
        scheme: "xyz",
        continuousWorld: !1,
        noWrap: !1,
        zoomOffset: 0,
        zoomReverse: !1,
        unloadInvisibleTiles: L.Browser.mobile,
        updateWhenIdle: L.Browser.mobile,
        reuseTiles: L.Browser.mobile
    },
    initialize: function (a, b, c) {
        L.Util.setOptions(this, b), this._url = a, this._urlParams = c, typeof this.options.subdomains == "string" && (this.options.subdomains = this.options.subdomains.split(""))
    },
    onAdd: function (a, b) {
        this._map = a, this._insertAtTheBottom = b, this._initContainer(), this._createTileProto(), a.on("viewreset", this._resetCallback, this), this.options.updateWhenIdle ? a.on("moveend", this._update, this) : (this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this), a.on("move", this._limitedUpdate, this)), this._reset(), this._update()
    },
    onRemove: function (a) {
        this._map.getPanes().tilePane.removeChild(this._container), this._container = null, this._map.off("viewreset", this._resetCallback, this), this.options.updateWhenIdle ? this._map.off("moveend", this._update, this) : this._map.off("move", this._limitedUpdate, this)
    },
    getAttribution: function () {
        return this.options.attribution
    },
    setOpacity: function (a) {
        this.options.opacity = a, this._setOpacity(a);
        if (L.Browser.webkit) for (var b in this._tiles) this._tiles.hasOwnProperty(b) && (this._tiles[b].style.webkitTransform += " translate(0,0)")
    },
    _setOpacity: function (a) {
        a < 1 && L.DomUtil.setOpacity(this._container, a)
    },
    _initContainer: function () {
        var a = this._map.getPanes().tilePane,
            b = a.firstChild;
        if (!this._container || a.empty) this._container = L.DomUtil.create("div", "leaflet-layer"), this._insertAtTheBottom && b ? a.insertBefore(this._container, b) : a.appendChild(this._container), this._setOpacity(this.options.opacity)
    },
    _resetCallback: function (a) {
        this._reset(a.hard)
    },
    _reset: function (a) {
        var b;
        for (b in this._tiles) this._tiles.hasOwnProperty(b) && this.fire("tileunload", {
            tile: this._tiles[b]
        });
        this._tiles = {}, this.options.reuseTiles && (this._unusedTiles = []), a && this._container && (this._container.innerHTML = ""), this._initContainer()
    },
    _update: function () {
        var a = this._map.getPixelBounds(),
            b = this._map.getZoom(),
            c = this.options.tileSize;
        if (b > this.options.maxZoom || b < this.options.minZoom) return;
        var d = new L.Point(Math.floor(a.min.x / c), Math.floor(a.min.y / c)),
            e = new L.Point(Math.floor(a.max.x / c), Math.floor(a.max.y / c)),
            f = new L.Bounds(d, e);
        this._addTilesFromCenterOut(f), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(f)
    },
    _addTilesFromCenterOut: function (a) {
        var b = [],
            c = a.getCenter();
        for (var d = a.min.y; d <= a.max.y; d++) for (var e = a.min.x; e <= a.max.x; e++) {
            if (e + ":" + d in this._tiles) continue;
            b.push(new L.Point(e, d))
        }
        b.sort(function (a, b) {
            return a.distanceTo(c) - b.distanceTo(c)
        });
        var f = document.createDocumentFragment();
        this._tilesToLoad = b.length;
        for (var g = 0, h = this._tilesToLoad; g < h; g++) this._addTile(b[g], f);
        this._container.appendChild(f)
    },
    _removeOtherTiles: function (a) {
        var b, c, d, e, f;
        for (e in this._tiles) if (this._tiles.hasOwnProperty(e)) {
            b = e.split(":"), c = parseInt(b[0], 10), d = parseInt(b[1], 10);
            if (c < a.min.x || c > a.max.x || d < a.min.y || d > a.max.y) f = this._tiles[e], this.fire("tileunload", {
                tile: f,
                url: f.src
            }), f.parentNode === this._container && this._container.removeChild(f), this.options.reuseTiles && this._unusedTiles.push(this._tiles[e]), delete this._tiles[e]
        }
    },
    _addTile: function (a, b) {
        var c = this._getTilePos(a),
            d = this._map.getZoom(),
            e = a.x + ":" + a.y,
            f = Math.pow(2, this._getOffsetZoom(d));
        if (!this.options.continuousWorld) {
            if (!this.options.noWrap) a.x = (a.x % f + f) % f;
            else if (a.x < 0 || a.x >= f) {
                this._tilesToLoad--;
                return
            }
            if (a.y < 0 || a.y >= f) {
                this._tilesToLoad--;
                return
            }
        }
        var g = this._getTile();
        L.DomUtil.setPosition(g, c), this._tiles[e] = g, this.options.scheme === "tms" && (a.y = f - a.y - 1), this._loadTile(g, a, d), b.appendChild(g)
    },
    _getOffsetZoom: function (a) {
        return a = this.options.zoomReverse ? this.options.maxZoom - a : a, a + this.options.zoomOffset
    },
    _getTilePos: function (a) {
        var b = this._map.getPixelOrigin(),
            c = this.options.tileSize;
        return a.multiplyBy(c).subtract(b)
    },
    getTileUrl: function (a, b) {
        var c = this.options.subdomains,
            d = this.options.subdomains[(a.x + a.y) % c.length];
        return L.Util.template(this._url, L.Util.extend({
            s: d,
            z: this._getOffsetZoom(b),
            x: a.x,
            y: a.y
        }, this._urlParams))
    },
    _createTileProto: function () {
        this._tileImg = L.DomUtil.create("img", "leaflet-tile"), this._tileImg.galleryimg = "no";
        var a = this.options.tileSize;
        this._tileImg.style.width = a + "px", this._tileImg.style.height = a + "px"
    },
    _getTile: function () {
        if (this.options.reuseTiles && this._unusedTiles.length > 0) {
            var a = this._unusedTiles.pop();
            return this._resetTile(a), a
        }
        return this._createTile()
    },
    _resetTile: function (a) {},
    _createTile: function () {
        var a = this._tileImg.cloneNode(!1);
        return a.onselectstart = a.onmousemove = L.Util.falseFn, a
    },
    _loadTile: function (a, b, c) {
        a._layer = this, a.onload = this._tileOnLoad, a.onerror = this._tileOnError, a.src = this.getTileUrl(b, c)
    },
    _tileOnLoad: function (a) {
        var b = this._layer;
        this.className += " leaflet-tile-loaded", b.fire("tileload", {
            tile: this,
            url: this.src
        }), b._tilesToLoad--, b._tilesToLoad || b.fire("load")
    },
    _tileOnError: function (a) {
        var b = this._layer;
        b.fire("tileerror", {
            tile: this,
            url: this.src
        });
        var c = b.options.errorTileUrl;
        c && (this.src = c)
    }
}), L.TileLayer.WMS = L.TileLayer.extend({
    defaultWmsParams: {
        service: "WMS",
        request: "GetMap",
        version: "1.1.1",
        layers: "",
        styles: "",
        format: "image/jpeg",
        transparent: !1
    },
    initialize: function (a, b) {
        this._url = a, this.wmsParams = L.Util.extend({}, this.defaultWmsParams), this.wmsParams.width = this.wmsParams.height = this.options.tileSize;
        for (var c in b) this.options.hasOwnProperty(c) || (this.wmsParams[c] = b[c]);
        L.Util.setOptions(this, b)
    },
    onAdd: function (a) {
        var b = parseFloat(this.wmsParams.version) < 1.3 ? "srs" : "crs";
        this.wmsParams[b] = a.options.crs.code, L.TileLayer.prototype.onAdd.call(this, a)
    },
    getTileUrl: function (a, b) {
        var c = this.options.tileSize,
            d = a.multiplyBy(c),
            e = d.add(new L.Point(c, c)),
            f = this._map.unproject(d, this._zoom, !0),
            g = this._map.unproject(e, this._zoom, !0),
            h = this._map.options.crs.project(f),
            i = this._map.options.crs.project(g),
            j = [h.x, i.y, i.x, h.y].join(",");
        return this._url + L.Util.getParamString(this.wmsParams) + "&bbox=" + j
    }
}), L.TileLayer.Canvas = L.TileLayer.extend({
    options: {
        async: !1
    },
    initialize: function (a) {
        L.Util.setOptions(this, a)
    },
    redraw: function () {
        for (var a in this._tiles) {
            var b = this._tiles[a];
            this._redrawTile(b)
        }
    },
    _redrawTile: function (a) {
        this.drawTile(a, a._tilePoint, a._zoom)
    },
    _createTileProto: function () {
        this._canvasProto = L.DomUtil.create("canvas", "leaflet-tile");
        var a = this.options.tileSize;
        this._canvasProto.width = a, this._canvasProto.height = a
    },
    _createTile: function () {
        var a = this._canvasProto.cloneNode(!1);
        return a.onselectstart = a.onmousemove = L.Util.falseFn, a
    },
    _loadTile: function (a, b, c) {
        a._layer = this, a._tilePoint = b, a._zoom = c, this.drawTile(a, b, c), this.options.async || this.tileDrawn(a)
    },
    drawTile: function (a, b, c) {},
    tileDrawn: function (a) {
        this._tileOnLoad.call(a)
    }
}), L.ImageOverlay = L.Class.extend({
    includes: L.Mixin.Events,
    initialize: function (a, b) {
        this._url = a, this._bounds = b
    },
    onAdd: function (a) {
        this._map = a, this._image || this._initImage(), a.getPanes().overlayPane.appendChild(this._image), a.on("viewreset", this._reset, this), this._reset()
    },
    onRemove: function (a) {
        a.getPanes().overlayPane.removeChild(this._image), a.off("viewreset", this._reset, this)
    },
    _initImage: function () {
        this._image = L.DomUtil.create("img", "leaflet-image-layer"), this._image.style.visibility = "hidden", L.Util.extend(this._image, {
            galleryimg: "no",
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.Util.bind(this._onImageLoad, this),
            src: this._url
        })
    },
    _reset: function () {
        var a = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            b = this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
            c = b.subtract(a);
        L.DomUtil.setPosition(this._image, a), this._image.style.width = c.x + "px", this._image.style.height = c.y + "px"
    },
    _onImageLoad: function () {
        this._image.style.visibility = "", this.fire("load")
    }
}), L.Icon = L.Class.extend({
    iconUrl: L.ROOT_URL + "images/marker.png",
    shadowUrl: L.ROOT_URL + "images/marker-shadow.png",
    iconSize: new L.Point(25, 41),
    shadowSize: new L.Point(41, 41),
    iconAnchor: new L.Point(13, 41),
    popupAnchor: new L.Point(0, -33),
    initialize: function (a) {
        a && (this.iconUrl = a)
    },
    createIcon: function () {
        return this._createIcon("icon")
    },
    createShadow: function () {
        return this._createIcon("shadow")
    },
    _createIcon: function (a) {
        var b = this[a + "Size"],
            c = this[a + "Url"];
        if (!c && a === "shadow") return null;
        var d;
        return c ? d = this._createImg(c) : d = this._createDiv(), d.className = "leaflet-marker-" + a, d.style.marginLeft = -this.iconAnchor.x + "px", d.style.marginTop = -this.iconAnchor.y + "px", b && (d.style.width = b.x + "px", d.style.height = b.y + "px"), d

    },
    _createImg: function (a) {
        var b;
        return L.Browser.ie6 ? (b = document.createElement("div"), b.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + a + '")') : (b = document.createElement("img"), b.src = a), b
    },
    _createDiv: function () {
        return document.createElement("div")
    }
}), L.CustomIcon = L.Class.extend({
	    iconUrl: L.ROOT_URL + "images/marker.png",
	    shadowUrl: L.ROOT_URL + "images/marker-shadow.png",
	    iconSize: new L.Point(25, 41),
	    shadowSize: new L.Point(41, 41),
	    iconAnchor: new L.Point(0, 0),
	    popupAnchor: new L.Point(0, -33),
	    initialize: function (a) {
	        a && (this.iconUrl = a)
	    },
	    createIcon: function () {
	        return this._createIcon("icon")
	    },
	    createShadow: function () {
	        //return this._createIcon("shadow")
	    },
	    _createIcon: function (a) {
	        var b = this[a + "Size"],
	            c = this[a + "Url"];
	        if (!c && a === "shadow") return null;
	        var d;
			q++;
			//console.log(d)
	        return c, d = this._createDiv(), d.className = "leaflet-marker-custom", d.id = "marker_" + q, d.style.marginLeft = -this.iconAnchor.x + "px", d.style.marginTop = -this.iconAnchor.y + "px", b, d

	    },
	    _createImg: function (a) {
	        var b;
	        return L.Browser.ie6 ? (b = document.createElement("div"), b.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + a + '")') : (b = document.createElement("img"), b.src = a), b
	    },
	    _createDiv: function () {
	        return document.createElement("div")
	    }
	}), L.Marker = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
        icon: new L.Icon,
        title: "",
        clickable: !0,
        draggable: !1,
        zIndexOffset: 0
    },
    initialize: function (a, b) {
        L.Util.setOptions(this, b), this._latlng = a
    },
    onAdd: function (a) {
        this._map = a, this._initIcon(), a.on("viewreset", this._reset, this), this._reset()
    },
    onRemove: function (a) {
        this._removeIcon(), this.closePopup && this.closePopup(), this._map = null, a.off("viewreset", this._reset, this)
    },
    getLatLng: function () {
        return this._latlng
    },
    setLatLng: function (a) {
        this._latlng = a, this._icon && (this._reset(), this._popup && this._popup.setLatLng(this._latlng))
    },
    setZIndexOffset: function (a) {
        this.options.zIndexOffset = a, this._icon && this._reset()
    },
    setIcon: function (a) {
        this._map && this._removeIcon(), this.options.icon = a, this._map && (this._initIcon(), this._reset())
    },
    _initIcon: function () {
        this._icon || (this._icon = this.options.icon.createIcon(), this.options.title && (this._icon.title = this.options.title), this._initInteraction()), this._shadow || (this._shadow = this.options.icon.createShadow()), this._map._panes.markerPane.appendChild(this._icon), this._shadow && this._map._panes.shadowPane.appendChild(this._shadow)
    },
    _removeIcon: function () {
        this._map._panes.markerPane.removeChild(this._icon), this._shadow && this._map._panes.shadowPane.removeChild(this._shadow), this._icon = this._shadow = null
    },
    _reset: function () {
        var a = this._map.latLngToLayerPoint(this._latlng).round();
        L.DomUtil.setPosition(this._icon, a), this._shadow && L.DomUtil.setPosition(this._shadow, a), this._icon.style.zIndex = a.y + this.options.zIndexOffset
    },
    _initInteraction: function () {
        // if (this.options.clickable) {
        //            this._icon.className += " leaflet-clickable", L.DomEvent.addListener(this._icon, "click", this._onMouseClick, this);
        //            var a = ["dblclick", "mousedown", "mouseover", "mouseout"];
        //            for (var b = 0; b < a.length; b++) L.DomEvent.addListener(this._icon, a[b], this._fireMouseEvent, this)
        //        }
        //        L.Handler.MarkerDrag && (this.dragging = new L.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
    },
    _onMouseClick: function (a) {
        L.DomEvent.stopPropagation(a);
        if (this.dragging && this.dragging.moved()) return;
        this.fire(a.type)
    },
    _fireMouseEvent: function (a) {
        this.fire(a.type), L.DomEvent.stopPropagation(a)
    }
}), L.CustomMarker = L.Class.extend({
	    includes: L.Mixin.Events,
	    options: {
	        icon: new L.CustomIcon,
	        title: "",
	        clickable: !0,
	        draggable: !1,
	        zIndexOffset: 0
	    },
	    initialize: function (a, b) {
	        L.Util.setOptions(this, b), this._latlng = a
	    },
	    onAdd: function (a) {
	        this._map = a, this._initIcon(), a.on("viewreset", this._reset, this), this._reset()
	    },
	    onRemove: function (a) {
	        this._removeIcon(), this.closePopup && this.closePopup(), this._map = null, a.off("viewreset", this._reset, this)
	    },
	    getLatLng: function () {
	        return this._latlng
	    },
	    setLatLng: function (a) {
	        this._latlng = a, this._icon && (this._reset(), this._popup && this._popup.setLatLng(this._latlng))
	    },
	    setZIndexOffset: function (a) {
	        this.options.zIndexOffset = a, this._icon && this._reset()
	    },
	    setIcon: function (a) {
	        this._map && this._removeIcon(), this.options.icon = a, this._map && (this._initIcon(), this._reset())
	    },
	     _initIcon: function () {
	     	        this._icon || (this._icon = this.options.icon.createIcon(), this.options.title && (this._icon.title = this.options.title), this._initInteraction()), this._shadow || (this._shadow = this.options.icon.createShadow()), this._map._panes.markerPane.appendChild(this._icon), this._shadow && this._map._panes.shadowPane.appendChild(this._shadow)
	     	    },
	    _removeIcon: function () {
	        this._map._panes.markerPane.removeChild(this._icon), this._shadow && this._map._panes.shadowPane.removeChild(this._shadow), this._icon = this._shadow = null
	    },
	    _reset: function () {
	        var a = this._map.latLngToLayerPoint(this._latlng).round();
	        L.DomUtil.setPosition(this._icon, a), this._shadow && L.DomUtil.setPosition(this._shadow, a), this._icon.style.zIndex = a.y + this.options.zIndexOffset
	    },
	    _initInteraction: function () {
	        if (this.options.clickable) {
	            this._icon.className += " leaflet-clickable", L.DomEvent.addListener(this._icon, "click", this._onMouseClick, this);
	            var a = ["dblclick", "mousedown", "mouseover", "mouseout"];
	            for (var b = 0; b < a.length; b++) L.DomEvent.addListener(this._icon, a[b], this._fireMouseEvent, this)
	        }
	        L.Handler.MarkerDrag && (this.dragging = new L.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
	    },
	    _onMouseClick: function (a) {
	        L.DomEvent.stopPropagation(a);
	        if (this.dragging && this.dragging.moved()) return;
	        this.fire(a.type)
	    },
	    _fireMouseEvent: function (a) {
	        this.fire(a.type), L.DomEvent.stopPropagation(a)
	    }
	}), L.Popup = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
        minWidth: 50,
        maxWidth: 300,
        autoPan: !0,
        closeButton: !0,
        offset: new L.Point(0, 2),
        autoPanPadding: new L.Point(5, 5),
        className: ""
    },
    initialize: function (a, b) {
        L.Util.setOptions(this, a), this._source = b
    },
    onAdd: function (a) {
        this._map = a, this._container || this._initLayout(), this._updateContent(), this._container.style.opacity = "0", this._map._panes.popupPane.appendChild(this._container), this._map.on("viewreset", this._updatePosition, this), this._map.options.closePopupOnClick && this._map.on("preclick", this._close, this), this._update(), this._container.style.opacity = "1", this._opened = !0
    },
    onRemove: function (a) {
        a._panes.popupPane.removeChild(this._container), L.Util.falseFn(this._container.offsetWidth), a.off("viewreset", this._updatePosition, this), a.off("click", this._close, this), this._container.style.opacity = "0", this._opened = !1
    },
    setLatLng: function (a) {
        return this._latlng = a, this._opened && this._update(), this
    },
    setContent: function (a) {
        return this._content = a, this._opened && this._update(), this
    },
    _close: function () {
        this._opened && this._map.closePopup()
    },
    _initLayout: function () {
        this._container = L.DomUtil.create("div", "leaflet-popup " + this.options.className), this.options.closeButton && (this._closeButton = L.DomUtil.create("a", "leaflet-popup-close-button", this._container), this._closeButton.href = "#close", L.DomEvent.addListener(this._closeButton, "click", this._onCloseButtonClick, this)), this._wrapper = L.DomUtil.create("div", "leaflet-popup-content-wrapper", this._container), L.DomEvent.disableClickPropagation(this._wrapper), this._contentNode = L.DomUtil.create("div", "leaflet-popup-content", this._wrapper), this._tipContainer = L.DomUtil.create("div", "leaflet-popup-tip-container", this._container), this._tip = L.DomUtil.create("div", "leaflet-popup-tip", this._tipContainer)
    },
    _update: function () {
        this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan()
    },
    _updateContent: function () {
        if (!this._content) return;
        typeof this._content == "string" ? this._contentNode.innerHTML = this._content : (this._contentNode.innerHTML = "", this._contentNode.appendChild(this._content))
    },
    _updateLayout: function () {
        this._container.style.width = "", this._container.style.whiteSpace = "nowrap";
        var a = this._container.offsetWidth;
        this._container.style.width = (a > this.options.maxWidth ? this.options.maxWidth : a < this.options.minWidth ? this.options.minWidth : a) + "px", this._container.style.whiteSpace = "", this._containerWidth = this._container.offsetWidth
    },
    _updatePosition: function () {
        var a = this._map.latLngToLayerPoint(this._latlng);
        this._containerBottom = -a.y - this.options.offset.y, this._containerLeft = a.x - Math.round(this._containerWidth / 2) + this.options.offset.x, this._container.style.bottom = this._containerBottom + "px", this._container.style.left = this._containerLeft + "px"
    },
    _adjustPan: function () {
        if (!this.options.autoPan) return;
        var a = this._container.offsetHeight,
            b = new L.Point(this._containerLeft, -a - this._containerBottom),
            c = this._map.layerPointToContainerPoint(b),
            d = new L.Point(0, 0),
            e = this.options.autoPanPadding,
            f = this._map.getSize();
        c.x < 0 && (d.x = c.x - e.x), c.x + this._containerWidth > f.x && (d.x = c.x + this._containerWidth - f.x + e.x), c.y < 0 && (d.y = c.y - e.y), c.y + a > f.y && (d.y = c.y + a - f.y + e.y), (d.x || d.y) && this._map.panBy(d)
    },
    _onCloseButtonClick: function (a) {
        this._close(), L.DomEvent.stop(a)
    }
}), L.Marker.include({
    openPopup: function () {
        return this._popup.setLatLng(this._latlng), this._map && this._map.openPopup(this._popup), this
    },
    closePopup: function () {
        return this._popup && this._popup._close(), this
    },
    bindPopup: function (a, b) {
        return b = L.Util.extend({
            offset: this.options.icon.popupAnchor
        }, b), this._popup || this.on("click", this.openPopup, this), this._popup = new L.Popup(b, this), this._popup.setContent(a), this
    },
    unbindPopup: function () {
        return this._popup && (this._popup = null, this.off("click", this.openPopup)), this
    }
}), L.Map.include({
    openPopup: function (a) {
        return this.closePopup(), this._popup = a, this.addLayer(a), this.fire("popupopen", {
            popup: this._popup
        }), this
    },
    closePopup: function () {
        return this._popup && (this.removeLayer(this._popup), this.fire("popupclose", {
            popup: this._popup
        }), this._popup = null), this
    }
}), L.LayerGroup = L.Class.extend({
    initialize: function (a) {
        this._layers = {};
        if (a) for (var b = 0, c = a.length; b < c; b++) this.addLayer(a[b])
    },
    addLayer: function (a) {
        var b = L.Util.stamp(a);
        return this._layers[b] = a, this._map && this._map.addLayer(a), this
    },
    removeLayer: function (a) {
        var b = L.Util.stamp(a);
        return delete this._layers[b], this._map && this._map.removeLayer(a), this
    },
    clearLayers: function () {
        return this._iterateLayers(this.removeLayer, this), this
    },
    invoke: function (a) {
        var b = Array.prototype.slice.call(arguments, 1),
            c, d;
        for (c in this._layers) this._layers.hasOwnProperty(c) && (d = this._layers[c], d[a] && d[a].apply(d, b));
        return this
    },
    onAdd: function (a) {
        this._map = a, this._iterateLayers(a.addLayer, a)
    },
    onRemove: function (a) {
        this._iterateLayers(a.removeLayer, a), delete this._map
    },
    _iterateLayers: function (a, b) {
        for (var c in this._layers) this._layers.hasOwnProperty(c) && a.call(b, this._layers[c])
    }
}), L.FeatureGroup = L.LayerGroup.extend({
    includes: L.Mixin.Events,
    addLayer: function (a) {
        this._initEvents(a), L.LayerGroup.prototype.addLayer.call(this, a), this._popupContent && a.bindPopup && a.bindPopup(this._popupContent)
    },
    bindPopup: function (a) {
        return this._popupContent = a, this.invoke("bindPopup", a)
    },
    setStyle: function (a) {
        return this.invoke("setStyle", a)
    },
    _events: ["click", "dblclick", "mouseover", "mouseout"],
    _initEvents: function (a) {
        for (var b = 0, c = this._events.length; b < c; b++) a.on(this._events[b], this._propagateEvent, this)
    },
    _propagateEvent: function (a) {
        a.layer = a.target, a.target = this, this.fire(a.type, a)
    }
}), L.Path = L.Class.extend({
    includes: [L.Mixin.Events],
    statics: {
        CLIP_PADDING: .5
    },
    options: {
        stroke: !0,
        color: "#0033ff",
        weight: 5,
        opacity: .5,
        fill: !1,
        fillColor: null,
        fillOpacity: .2,
        clickable: !0,
        updateOnMoveEnd: !0
    },
    initialize: function (a) {
        L.Util.setOptions(this, a)
    },
    onAdd: function (a) {
        this._map = a, this._initElements(), this._initEvents(), this.projectLatlngs(), this._updatePath(), a.on("viewreset", this.projectLatlngs, this), this._updateTrigger = this.options.updateOnMoveEnd ? "moveend" : "viewreset", a.on(this._updateTrigger, this._updatePath, this)
    },
    onRemove: function (a) {
        this._map = null, a._pathRoot.removeChild(this._container), a.off("viewreset", this.projectLatlngs, this), a.off(this._updateTrigger, this._updatePath, this)
    },
    projectLatlngs: function () {},
    setStyle: function (a) {
        return L.Util.setOptions(this, a), this._container && this._updateStyle(), this
    },
    _redraw: function () {
        this._map && (this.projectLatlngs(), this._updatePath())
    }
}), L.Map.include({
    _updatePathViewport: function () {
        var a = L.Path.CLIP_PADDING,
            b = this.getSize(),
            c = L.DomUtil.getPosition(this._mapPane),
            d = c.multiplyBy(-1).subtract(b.multiplyBy(a)),
            e = d.add(b.multiplyBy(1 + a * 2));
        this._pathViewport = new L.Bounds(d, e)
    }
}), L.Path.SVG_NS = "http://www.w3.org/2000/svg", L.Browser.svg = !! document.createElementNS && !! document.createElementNS(L.Path.SVG_NS, "svg").createSVGRect, L.Path = L.Path.extend({
    statics: {
        SVG: L.Browser.svg,
        _createElement: function (a) {
            return document.createElementNS(L.Path.SVG_NS, a)
        }
    },
    getPathString: function () {},
    _initElements: function () {
        this._map._initPathRoot(), this._initPath(), this._initStyle()
    },
    _initPath: function () {
        this._container = L.Path._createElement("g"), this._path = L.Path._createElement("path"), this._container.appendChild(this._path), this._map._pathRoot.appendChild(this._container)
    },
    _initStyle: function () {
        this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round")), this.options.fill ? this._path.setAttribute("fill-rule", "evenodd") : this._path.setAttribute("fill", "none"), this._updateStyle()
    },
    _updateStyle: function () {
        this.options.stroke && (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width", this.options.weight)), this.options.fill && (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity))
    },
    _updatePath: function () {
        var a = this.getPathString();
        a || (a = "M0 0"), this._path.setAttribute("d", a)
    },
    _initEvents: function () {
        if (this.options.clickable) {
            L.Browser.vml || this._path.setAttribute("class", "leaflet-clickable"), L.DomEvent.addListener(this._container, "click", this._onMouseClick, this);
            var a = ["dblclick", "mousedown", "mouseover", "mouseout", "mousemove"];
            for (var b = 0; b < a.length; b++) L.DomEvent.addListener(this._container, a[b], this._fireMouseEvent, this)
        }
    },
    _onMouseClick: function (a) {
        if (this._map.dragging && this._map.dragging.moved()) return;
        this._fireMouseEvent(a)
    },
    _fireMouseEvent: function (a) {
        if (!this.hasEventListeners(a.type)) return;
        this.fire(a.type, {
            latlng: this._map.mouseEventToLatLng(a),
            layerPoint: this._map.mouseEventToLayerPoint(a)
        }), L.DomEvent.stopPropagation(a)
    }
}), L.Map.include({
    _initPathRoot: function () {
        this._pathRoot || (this._pathRoot = L.Path._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport())
    },
    _updateSvgViewport: function () {
        this._updatePathViewport();
        var a = this._pathViewport,
            b = a.min,
            c = a.max,
            d = c.x - b.x,
            e = c.y - b.y,
            f = this._pathRoot,
            g = this._panes.overlayPane;
        L.Browser.webkit && g.removeChild(f), L.DomUtil.setPosition(f, b), f.setAttribute("width", d), f.setAttribute("height", e), f.setAttribute("viewBox", [b.x, b.y, d, e].join(" ")), L.Browser.webkit && g.appendChild(f)
    }
}), L.Path.include({
    bindPopup: function (a, b) {
        if (!this._popup || this._popup.options !== b) this._popup = new L.Popup(b, this);
        return this._popup.setContent(a), this._openPopupAdded || (this.on("click", this._openPopup, this), this._openPopupAdded = !0), this
    },
    _openPopup: function (a) {
        this._popup.setLatLng(a.latlng), this._map.openPopup(this._popup)
    }
}), L.Browser.vml = function () {
    var a = document.createElement("div"),
        b;
    return a.innerHTML = '<v:shape adj="1"/>', b = a.firstChild, b.style.behavior = "url(#default#VML)", b && typeof b.adj == "object"
}(), L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
    statics: {
        VML: !0,
        CLIP_PADDING: .02,
        _createElement: function () {
            try {
                return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (a) {
                    return document.createElement("<lvml:" + a + ' class="lvml">')
                }
            } catch (a) {
                return function (a) {
                    return document.createElement("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
                }
            }
        }()
    },
    _initPath: function () {
        this._container = L.Path._createElement("shape"), this._container.className += " leaflet-vml-shape" + (this.options.clickable ? " leaflet-clickable" : ""), this._container.coordsize = "1 1", this._path = L.Path._createElement("path"), this._container.appendChild(this._path), this._map._pathRoot.appendChild(this._container)
    },
    _initStyle: function () {
        this.options.stroke ? (this._stroke = L.Path._createElement("stroke"), this._stroke.endcap = "round", this._container.appendChild(this._stroke)) : this._container.stroked = !1, this.options.fill ? (this._container.filled = !0, this._fill = L.Path._createElement("fill"), this._container.appendChild(this._fill)) : this._container.filled = !1, this._updateStyle()
    },
    _updateStyle: function () {
        this.options.stroke && (this._stroke.weight = this.options.weight + "px", this._stroke.color = this.options.color, this._stroke.opacity = this.options.opacity), this.options.fill && (this._fill.color = this.options.fillColor || this.options.color, this._fill.opacity = this.options.fillOpacity)
    },
    _updatePath: function () {
        this._container.style.display = "none", this._path.v = this.getPathString() + " ", this._container.style.display = ""
    }
}), L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
    _initPathRoot: function () {
        this._pathRoot || (this._pathRoot = document.createElement("div"), this._pathRoot.className = "leaflet-vml-container", this._panes.overlayPane.appendChild(this._pathRoot), this.on("moveend", this._updatePathViewport), this._updatePathViewport())
    }
}), L.Browser.canvas = function () {
    return !!document.createElement("canvas").getContext
}(), L.Path = L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas ? L.Path : L.Path.extend({
    statics: {
        CANVAS: !0,
        SVG: !1
    },
    options: {
        updateOnMoveEnd: !0
    },
    _initElements: function () {
        this._map._initPathRoot(), this._ctx = this._map._canvasCtx
    },
    _updateStyle: function () {
        this.options.stroke && (this._ctx.lineWidth = this.options.weight, this._ctx.strokeStyle = this.options.color), this.options.fill && (this._ctx.fillStyle = this.options.fillColor || this.options.color)
    },
    _drawPath: function () {
        var a, b, c, d, e, f;
        this._ctx.beginPath();
        for (a = 0, c = this._parts.length; a < c; a++) {
            for (b = 0, d = this._parts[a].length; b < d; b++) e = this._parts[a][b], f = (b === 0 ? "move" : "line") + "To", this._ctx[f](e.x, e.y);
            this instanceof L.Polygon && this._ctx.closePath()
        }
    },
    _checkIfEmpty: function () {
        return !this._parts.length
    },
    _updatePath: function () {
        if (this._checkIfEmpty()) return;
        this._drawPath(), this._ctx.save(), this._updateStyle();
        var a = this.options.opacity,
            b = this.options.fillOpacity;
        this.options.fill && (b < 1 && (this._ctx.globalAlpha = b), this._ctx.fill()), this.options.stroke && (a < 1 && (this._ctx.globalAlpha = a), this._ctx.stroke()), this._ctx.restore()
    },
    _initEvents: function () {
        this.options.clickable && this._map.on("click", this._onClick, this)
    },
    _onClick: function (a) {
        this._containsPoint(a.layerPoint) && this.fire("click", a)
    },
    onRemove: function (a) {
        a.off("viewreset", this._projectLatlngs, this), a.off(this._updateTrigger, this._updatePath, this), a.fire(this._updateTrigger)
    }
}), L.Map.include(L.Path.SVG && !window.L_PREFER_CANVAS || !L.Browser.canvas ? {} : {
    _initPathRoot: function () {
        var a = this._pathRoot,
            b;
        a || (a = this._pathRoot = document.createElement("canvas"), a.style.position = "absolute", b = this._canvasCtx = a.getContext("2d"), b.lineCap = "round", b.lineJoin = "round", this._panes.overlayPane.appendChild(a), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport())
    },
    _updateCanvasViewport: function () {
        this._updatePathViewport();
        var a = this._pathViewport,
            b = a.min,
            c = a.max.subtract(b),
            d = this._pathRoot;
        L.DomUtil.setPosition(d, b), d.width = c.x, d.height = c.y, d.getContext("2d").translate(-b.x, -b.y)
    }
}), L.LineUtil = {
    simplify: function (a, b) {
        if (!b || !a.length) return a.slice();
        var c = b * b;
        return a = this._reducePoints(a, c), a = this._simplifyDP(a, c), a
    },
    pointToSegmentDistance: function (a, b, c) {
        return Math.sqrt(this._sqClosestPointOnSegment(a, b, c, !0))
    },
    closestPointOnSegment: function (a, b, c) {
        return this._sqClosestPointOnSegment(a, b, c)
    },
    _simplifyDP: function (a, b) {
        var c = a.length,
            d = typeof Uint8Array != "undefined" ? Uint8Array : Array,
            e = new d(c);
        e[0] = e[c - 1] = 1, this._simplifyDPStep(a, e, b, 0, c - 1);
        var f, g = [];
        for (f = 0; f < c; f++) e[f] && g.push(a[f]);
        return g
    },
    _simplifyDPStep: function (a, b, c, d, e) {
        var f = 0,
            g, h, i;
        for (h = d + 1; h <= e - 1; h++) i = this._sqClosestPointOnSegment(a[h], a[d], a[e], !0), i > f && (g = h, f = i);
        f > c && (b[g] = 1, this._simplifyDPStep(a, b, c, d, g), this._simplifyDPStep(a, b, c, g, e))
    },
    _reducePoints: function (a, b) {
        var c = [a[0]];
        for (var d = 1, e = 0, f = a.length; d < f; d++) this._sqDist(a[d], a[e]) > b && (c.push(a[d]), e = d);
        return e < f - 1 && c.push(a[f - 1]), c
    },
    clipSegment: function (a, b, c, d) {
        var e = c.min,
            f = c.max,
            g = d ? this._lastCode : this._getBitCode(a, c),
            h = this._getBitCode(b, c);
        this._lastCode = h;
        for (;;) {
            if (!(g | h)) return [a, b];
            if (g & h) return !1;
            var i = g || h,
                j = this._getEdgeIntersection(a, b, i, c),
                k = this._getBitCode(j, c);
            i === g ? (a = j, g = k) : (b = j, h = k)
        }
    },
    _getEdgeIntersection: function (a, b, c, d) {
        var e = b.x - a.x,
            f = b.y - a.y,
            g = d.min,
            h = d.max;
        if (c & 8) return new L.Point(a.x + e * (h.y - a.y) / f, h.y);
        if (c & 4) return new L.Point(a.x + e * (g.y - a.y) / f, g.y);
        if (c & 2) return new L.Point(h.x, a.y + f * (h.x - a.x) / e);
        if (c & 1) return new L.Point(g.x, a.y + f * (g.x - a.x) / e)
    },
    _getBitCode: function (a, b) {
        var c = 0;
        return a.x < b.min.x ? c |= 1 : a.x > b.max.x && (c |= 2), a.y < b.min.y ? c |= 4 : a.y > b.max.y && (c |= 8), c
    },
    _sqDist: function (a, b) {
        var c = b.x - a.x,
            d = b.y - a.y;
        return c * c + d * d
    },
    _sqClosestPointOnSegment: function (a, b, c, d) {
        var e = b.x,
            f = b.y,
            g = c.x - e,
            h = c.y - f,
            i = g * g + h * h,
            j;
        return i > 0 && (j = ((a.x - e) * g + (a.y - f) * h) / i, j > 1 ? (e = c.x, f = c.y) : j > 0 && (e += g * j, f += h * j)), g = a.x - e, h = a.y - f, d ? g * g + h * h : new L.Point(e, f)
    }
}, L.Polyline = L.Path.extend({
    initialize: function (a, b) {
        L.Path.prototype.initialize.call(this, b), this._latlngs = a
    },
    options: {
        smoothFactor: 1,
        noClip: !1,
        updateOnMoveEnd: !0
    },
    projectLatlngs: function () {
        this._originalPoints = [];
        for (var a = 0, b = this._latlngs.length; a < b; a++) this._originalPoints[a] = this._map.latLngToLayerPoint(this._latlngs[a])
    },
    getPathString: function () {
        for (var a = 0, b = this._parts.length, c = ""; a < b; a++) c += this._getPathPartStr(this._parts[a]);
        return c
    },
    getLatLngs: function () {
        return this._latlngs
    },
    setLatLngs: function (a) {
        return this._latlngs = a, this._redraw(), this
    },
    addLatLng: function (a) {
        return this._latlngs.push(a), this._redraw(), this
    },
    spliceLatLngs: function (a, b) {
        var c = [].splice.apply(this._latlngs, arguments);
        return this._redraw(), c
    },
    closestLayerPoint: function (a) {
        var b = Infinity,
            c = this._parts,
            d, e, f = null;
        for (var g = 0, h = c.length; g < h; g++) {
            var i = c[g];
            for (var j = 1, k = i.length; j < k; j++) {
                d = i[j - 1], e = i[j];
                var l = L.LineUtil._sqClosestPointOnSegment(a, d, e);
                l._sqDist < b && (b = l._sqDist, f = l)
            }
        }
        return f && (f.distance = Math.sqrt(b)), f
    },
    getBounds: function () {
        var a = new L.LatLngBounds,
            b = this.getLatLngs();
        for (var c = 0, d = b.length; c < d; c++) a.extend(b[c]);
        return a
    },
    _getPathPartStr: function (a) {
        var b = L.Path.VML;
        for (var c = 0, d = a.length, e = "", f; c < d; c++) f = a[c], b && f._round(), e += (c ? "L" : "M") + f.x + " " + f.y;
        return e
    },
    _clipPoints: function () {
        var a = this._originalPoints,
            b = a.length,
            c, d, e;
        if (this.options.noClip) {
            this._parts = [a];
            return
        }
        this._parts = [];
        var f = this._parts,
            g = this._map._pathViewport,
            h = L.LineUtil;
        for (c = 0, d = 0; c < b - 1; c++) {
            e = h.clipSegment(a[c], a[c + 1], g, c);
            if (!e) continue;
            f[d] = f[d] || [], f[d].push(e[0]);
            if (e[1] !== a[c + 1] || c === b - 2) f[d].push(e[1]), d++
        }
    },
    _simplifyPoints: function () {
        var a = this._parts,
            b = L.LineUtil;
        for (var c = 0, d = a.length; c < d; c++) a[c] = b.simplify(a[c], this.options.smoothFactor)
    },
    _updatePath: function () {
        this._clipPoints(), this._simplifyPoints(), L.Path.prototype._updatePath.call(this)
    }
}), L.PolyUtil = {}, L.PolyUtil.clipPolygon = function (a, b) {
    var c = b.min,
        d = b.max,
        e, f = [1, 4, 2, 8],
        g, h, i, j, k, l, m, n, o = L.LineUtil;
    for (g = 0, l = a.length; g < l; g++) a[g]._code = o._getBitCode(a[g], b);
    for (i = 0; i < 4; i++) {
        m = f[i], e = [];
        for (g = 0, l = a.length, h = l - 1; g < l; h = g++) j = a[g], k = a[h], j._code & m ? k._code & m || (n = o._getEdgeIntersection(k, j, m, b), n._code = o._getBitCode(n, b), e.push(n)) : (k._code & m && (n = o._getEdgeIntersection(k, j, m, b), n._code = o._getBitCode(n, b), e.push(n)), e.push(j));
        a = e
    }
    return a
}, L.Polygon = L.Polyline.extend({
    options: {
        fill: !0
    },
    initialize: function (a, b) {
        L.Polyline.prototype.initialize.call(this, a, b), a && a[0] instanceof Array && (this._latlngs = a[0], this._holes = a.slice(1))
    },
    projectLatlngs: function () {
        L.Polyline.prototype.projectLatlngs.call(this), this._holePoints = [];
        if (!this._holes) return;
        for (var a = 0, b = this._holes.length, c; a < b; a++) {
            this._holePoints[a] = [];
            for (var d = 0, e = this._holes[a].length; d < e; d++) this._holePoints[a][d] = this._map.latLngToLayerPoint(this._holes[a][d])
        }
    },
    _clipPoints: function () {
        var a = this._originalPoints,
            b = [];
        this._parts = [a].concat(this._holePoints);
        if (this.options.noClip) return;
        for (var c = 0, d = this._parts.length; c < d; c++) {
            var e = L.PolyUtil.clipPolygon(this._parts[c], this._map._pathViewport);
            if (!e.length) continue;
            b.push(e)
        }
        this._parts = b
    },
    _getPathPartStr: function (a) {
        var b = L.Polyline.prototype._getPathPartStr.call(this, a);
        return b + (L.Browser.svg ? "z" : "x")
    }
}), function () {
    function a(a) {
        return L.FeatureGroup.extend({
            initialize: function (a, b) {
                this._layers = {}, this._options = b, this.setLatLngs(a)
            },
            setLatLngs: function (b) {
                var c = 0,
                    d = b.length;
                this._iterateLayers(function (a) {
                    c < d ? a.setLatLngs(b[c++]) : this.removeLayer(a)
                }, this);
                while (c < d) this.addLayer(new a(b[c++], this._options))
            }
        })
    }
    L.MultiPolyline = a(L.Polyline), L.MultiPolygon = a(L.Polygon)
}(), L.Circle = L.Path.extend({
    initialize: function (a, b, c) {
        L.Path.prototype.initialize.call(this, c), this._latlng = a, this._mRadius = b
    },
    options: {
        fill: !0
    },
    setLatLng: function (a) {
        return this._latlng = a, this._redraw(), this
    },
    setRadius: function (a) {
        return this._mRadius = a, this._redraw(), this
    },
    projectLatlngs: function () {
        var a = 40075017,
            b = a * Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat),
            c = this._mRadius / b * 360,
            d = new L.LatLng(this._latlng.lat, this._latlng.lng - c, !0),
            e = this._map.latLngToLayerPoint(d);
        this._point = this._map.latLngToLayerPoint(this._latlng), this._radius = Math.round(this._point.x - e.x)
    },
    getPathString: function () {
        var a = this._point,
            b = this._radius;
        return this._checkIfEmpty() ? "" : L.Browser.svg ? "M" + a.x + "," + (a.y - b) + "A" + b + "," + b + ",0,1,1," + (a.x - .1) + "," + (a.y - b) + " z" : (a._round(), b = Math.round(b), "AL " + a.x + "," + a.y + " " + b + "," + b + " 0," + 23592600)
    },
    _checkIfEmpty: function () {
        var a = this._map._pathViewport,
            b = this._radius,
            c = this._point;
        return c.x - b > a.max.x || c.y - b > a.max.y || c.x + b < a.min.x || c.y + b < a.min.y
    }
}), L.CircleMarker = L.Circle.extend({
    options: {
        radius: 10,
        weight: 2
    },
    initialize: function (a, b) {
        L.Circle.prototype.initialize.call(this, a, null, b), this._radius = this.options.radius
    },
    projectLatlngs: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng)
    },
    setRadius: function (a) {
        return this._radius = a, this._redraw(), this
    }
}), L.Polyline.include(L.Path.CANVAS ? {
    _containsPoint: function (a, b) {
        var c, d, e, f, g, h, i, j = this.options.weight / 2;
        L.Browser.touch && (j += 10);
        for (c = 0, f = this._parts.length; c < f; c++) {
            i = this._parts[c];
            for (d = 0, g = i.length, e = g - 1; d < g; e = d++) {
                if (!b && d === 0) continue;
                h = L.LineUtil.pointToSegmentDistance(a, i[e], i[d]);
                if (h <= j) return !0
            }
        }
        return !1
    }
} : {}), L.Polygon.include(L.Path.CANVAS ? {
    _containsPoint: function (a) {
        var b = !1,
            c, d, e, f, g, h, i, j;
        if (L.Polyline.prototype._containsPoint.call(this, a, !0)) return !0;
        for (f = 0, i = this._parts.length; f < i; f++) {
            c = this._parts[f];
            for (g = 0, j = c.length, h = j - 1; g < j; h = g++) d = c[g], e = c[h], d.y > a.y != e.y > a.y && a.x < (e.x - d.x) * (a.y - d.y) / (e.y - d.y) + d.x && (b = !b)
        }
        return b
    }
} : {}), L.Circle.include(L.Path.CANVAS ? {
    _drawPath: function () {
        var a = this._point;
        this._ctx.beginPath(), this._ctx.arc(a.x, a.y, this._radius, 0, Math.PI * 2)
    },
    _containsPoint: function (a) {
        var b = this._point,
            c = this.options.stroke ? this.options.weight / 2 : 0;
        return a.distanceTo(b) <= this._radius + c
    }
} : {}), L.GeoJSON = L.FeatureGroup.extend({
    initialize: function (a, b) {
        L.Util.setOptions(this, b), this._geojson = a, this._layers = {}, a && this.addGeoJSON(a)
    },
    addGeoJSON: function (a) {
        if (a.features) {
            for (var b = 0, c = a.features.length; b < c; b++) this.addGeoJSON(a.features[b]);
            return
        }
        var d = a.type === "Feature",
            e = d ? a.geometry : a,
            f = L.GeoJSON.geometryToLayer(e, this.options.pointToLayer);
        this.fire("featureparse", {
            layer: f,
            properties: a.properties,
            geometryType: e.type,
            bbox: a.bbox,
            id: a.id
        }), this.addLayer(f)
    }
}), L.Util.extend(L.GeoJSON, {
    geometryToLayer: function (a, b) {
        var c = a.coordinates,
            d, e, f, g, h, i = [];
        switch (a.type) {
        case "Point":
            return d = this.coordsToLatLng(c), b ? b(d) : new L.Marker(d);
        case "MultiPoint":
            for (f = 0, g = c.length; f < g; f++) d = this.coordsToLatLng(c[f]), h = b ? b(d) : new L.Marker(d), i.push(h);
            return new L.FeatureGroup(i);
        case "LineString":
            return e = this.coordsToLatLngs(c), new L.Polyline(e);
        case "Polygon":
            return e = this.coordsToLatLngs(c, 1), new L.Polygon(e);
        case "MultiLineString":
            return e = this.coordsToLatLngs(c, 1), new L.MultiPolyline(e);
        case "MultiPolygon":
            return e = this.coordsToLatLngs(c, 2), new L.MultiPolygon(e);
        case "GeometryCollection":
            for (f = 0, g = a.geometries.length; f < g; f++) h = this.geometryToLayer(a.geometries[f], b), i.push(h);
            return new L.FeatureGroup(i);
        default:
            throw Error("Invalid GeoJSON object.")
        }
    },
    coordsToLatLng: function (a, b) {
        var c = parseFloat(a[b ? 0 : 1]),
            d = parseFloat(a[b ? 1 : 0]);
        return new L.LatLng(c, d, !0)
    },
    coordsToLatLngs: function (a, b, c) {
        var d, e = [],
            f, g = a.length;
        for (f = 0; f < g; f++) d = b ? this.coordsToLatLngs(a[f], b - 1, c) : this.coordsToLatLng(a[f], c), e.push(d);
        return e
    }
}), L.DomEvent = {
    addListener: function (a, b, c, d) {
        var e = L.Util.stamp(c),
            f = "_leaflet_" + b + e;
        if (a[f]) return;
        var g = function (b) {
                return c.call(d || a, b || L.DomEvent._getEvent())
            };
        if (L.Browser.touch && b === "dblclick" && this.addDoubleTapListener) this.addDoubleTapListener(a, g, e);
        else if ("addEventListener" in a) if (b === "mousewheel") a.addEventListener("DOMMouseScroll", g, !1), a.addEventListener(b, g, !1);
        else if (b === "mouseenter" || b === "mouseleave") {
            var h = g,
                i = b === "mouseenter" ? "mouseover" : "mouseout";
            g = function (b) {
                if (!L.DomEvent._checkMouse(a, b)) return;
                return h(b)
            }, a.addEventListener(i, g, !1)
        } else a.addEventListener(b, g, !1);
        else "attachEvent" in a && a.attachEvent("on" + b, g);
        a[f] = g
    },
    removeListener: function (a, b, c) {
        var d = L.Util.stamp(c),
            e = "_leaflet_" + b + d,
            f = a[e];
        if (!f) return;
        L.Browser.touch && b === "dblclick" && this.removeDoubleTapListener ? this.removeDoubleTapListener(a, d) : "removeEventListener" in a ? b === "mousewheel" ? (a.removeEventListener("DOMMouseScroll", f, !1), a.removeEventListener(b, f, !1)) : b === "mouseenter" || b === "mouseleave" ? a.removeEventListener(b === "mouseenter" ? "mouseover" : "mouseout", f, !1) : a.removeEventListener(b, f, !1) : "detachEvent" in a && a.detachEvent("on" + b, f), a[e] = null
    },
    _checkMouse: function (a, b) {
        var c = b.relatedTarget;
        if (!c) return !0;
        try {
            while (c && c !== a) c = c.parentNode
        } catch (d) {
            return !1
        }
        return c !== a
    },
    _getEvent: function () {
        var a = window.event;
        if (!a) {
            var b = arguments.callee.caller;
            while (b) {
                a = b.arguments[0];
                if (a && window.Event === a.constructor) break;
                b = b.caller
            }
        }
        return a
    },
    stopPropagation: function (a) {
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
    },
    disableClickPropagation: function (a) {
        L.DomEvent.addListener(a, L.Draggable.START, L.DomEvent.stopPropagation), L.DomEvent.addListener(a, "click", L.DomEvent.stopPropagation), L.DomEvent.addListener(a, "dblclick", L.DomEvent.stopPropagation)
    },
    preventDefault: function (a) {
        a.preventDefault ? a.preventDefault() : a.returnValue = !1
    },
    stop: function (a) {
        L.DomEvent.preventDefault(a), L.DomEvent.stopPropagation(a)
    },
    getMousePosition: function (a, b) {
        var c = a.pageX ? a.pageX : a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
            d = a.pageY ? a.pageY : a.clientY + document.body.scrollTop + document.documentElement.scrollTop,
            e = new L.Point(c, d);
        return b ? e.subtract(L.DomUtil.getViewportOffset(b)) : e
    },
    getWheelDelta: function (a) {
        var b = 0;
        return a.wheelDelta && (b = a.wheelDelta / 120), a.detail && (b = -a.detail / 3), b
    }
}, L.Draggable = L.Class.extend({
    includes: L.Mixin.Events,
    statics: {
        START: L.Browser.touch ? "touchstart" : "mousedown",
        END: L.Browser.touch ? "touchend" : "mouseup",
        MOVE: L.Browser.touch ? "touchmove" : "mousemove",
        TAP_TOLERANCE: 15
    },
    initialize: function (a, b) {
        this._element = a, this._dragStartTarget = b || a
    },
    enable: function () {
        if (this._enabled) return;
        L.DomEvent.addListener(this._dragStartTarget, L.Draggable.START, this._onDown, this), this._enabled = !0
    },
    disable: function () {
        if (!this._enabled) return;
        L.DomEvent.removeListener(this._dragStartTarget, L.Draggable.START, this._onDown), this._enabled = !1
    },
    _onDown: function (a) {
        if (!L.Browser.touch && a.shiftKey || a.which !== 1 && a.button !== 1 && !a.touches) return;
        if (a.touches && a.touches.length > 1) return;
        var b = a.touches && a.touches.length === 1 ? a.touches[0] : a,
            c = b.target;
        L.DomEvent.preventDefault(a), L.Browser.touch && c.tagName.toLowerCase() === "a" && (c.className += " leaflet-active"), this._moved = !1;
        if (this._moving) return;
        L.Browser.touch || (L.DomUtil.disableTextSelection(), this._setMovingCursor()), this._startPos = this._newPos = L.DomUtil.getPosition(this._element), this._startPoint = new L.Point(b.clientX, b.clientY), L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this), L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this)
    },
    _onMove: function (a) {
        if (a.touches && a.touches.length > 1) return;
        L.DomEvent.preventDefault(a);
        var b = a.touches && a.touches.length === 1 ? a.touches[0] : a;
        this._moved || (this.fire("dragstart"), this._moved = !0), this._moving = !0;
        var c = new L.Point(b.clientX, b.clientY);
        this._newPos = this._startPos.add(c).subtract(this._startPoint), L.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget)
    },
    _updatePosition: function () {
        this.fire("predrag"), L.DomUtil.setPosition(this._element, this._newPos), this.fire("drag")
    },
    _onUp: function (a) {
        if (a.changedTouches) {
            var b = a.changedTouches[0],
                c = b.target,
                d = this._newPos && this._newPos.distanceTo(this._startPos) || 0;
            c.tagName.toLowerCase() === "a" && (c.className = c.className.replace(" leaflet-active", "")), d < L.Draggable.TAP_TOLERANCE && this._simulateEvent("click", b)
        }
        L.Browser.touch || (L.DomUtil.enableTextSelection(), this._restoreCursor()), L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove), L.DomEvent.removeListener(document, L.Draggable.END, this._onUp), this._moved && this.fire("dragend"), this._moving = !1
    },
    _setMovingCursor: function () {
        this._bodyCursor = document.body.style.cursor, document.body.style.cursor = "move"
    },
    _restoreCursor: function () {
        document.body.style.cursor = this._bodyCursor
    },
    _simulateEvent: function (a, b) {
        var c = document.createEvent("MouseEvents");
        c.initMouseEvent(a, !0, !0, window, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null), b.target.dispatchEvent(c)
    }
}), L.Handler = L.Class.extend({
    initialize: function (a) {
        this._map = a
    },
    enable: function () {
        if (this._enabled) return;
        this._enabled = !0, this.addHooks()
    },
    disable: function () {
        if (!this._enabled) return;
        this._enabled = !1, this.removeHooks()
    },
    enabled: function () {
        return !!this._enabled
    }
}), L.Map.Drag = L.Handler.extend({
    addHooks: function () {
        if (!this._draggable) {
            this._draggable = new L.Draggable(this._map._mapPane, this._map._container), this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this);
            var a = this._map.options;
            a.worldCopyJump && !a.continuousWorld && (this._draggable.on("predrag", this._onPreDrag, this), this._map.on("viewreset", this._onViewReset, this))
        }
        this._draggable.enable()
    },
    removeHooks: function () {
        this._draggable.disable()
    },
    moved: function () {
        return this._draggable && this._draggable._moved
    },
    _onDragStart: function () {
        this._map.fire("movestart").fire("dragstart")
    },
    _onDrag: function () {
        this._map.fire("move").fire("drag")
    },
    _onViewReset: function () {
        var a = this._map.getSize().divideBy(2),
            b = this._map.latLngToLayerPoint(new L.LatLng(0, 0));
        this._initialWorldOffset = b.subtract(a)
    },
    _onPreDrag: function () {
        var a = this._map,
            b = a.options.scale(a.getZoom()),
            c = Math.round(b / 2),
            d = this._initialWorldOffset.x,
            e = this._draggable._newPos.x,
            f = (e - c + d) % b + c - d,
            g = (e + c + d) % b - c - d,
            h = Math.abs(f + d) < Math.abs(g + d) ? f : g;
        this._draggable._newPos.x = h
    },
    _onDragEnd: function () {
        var a = this._map;
        a.fire("moveend").fire("dragend"), a.options.maxBounds && L.Util.requestAnimFrame(this._panInsideMaxBounds, a, !0, a._container)
    },
    _panInsideMaxBounds: function () {
        this.panInsideBounds(this.options.maxBounds)
    }
}), L.Map.DoubleClickZoom = L.Handler.extend({
    addHooks: function () {
        this._map.on("dblclick", this._onDoubleClick)
    },
    removeHooks: function () {
        this._map.off("dblclick", this._onDoubleClick)
    },
    _onDoubleClick: function (a) {
        this.setView(a.latlng, this._zoom + 1)
    }
}), L.Map.ScrollWheelZoom = L.Handler.extend({
    addHooks: function () {
        L.DomEvent.addListener(this._map._container, "mousewheel", this._onWheelScroll, this), this._delta = 0
    },
    removeHooks: function () {
        L.DomEvent.removeListener(this._map._container, "mousewheel", this._onWheelScroll)
    },
    _onWheelScroll: function (a) {
        var b = L.DomEvent.getWheelDelta(a);
        this._delta += b, this._lastMousePos = this._map.mouseEventToContainerPoint(a), clearTimeout(this._timer), this._timer = setTimeout(L.Util.bind(this._performZoom, this), 50), L.DomEvent.preventDefault(a)
    },
    _performZoom: function () {
        var a = this._map,
            b = Math.round(this._delta),
            c = a.getZoom();
        b = Math.max(Math.min(b, 4), -4), b = a._limitZoom(c + b) - c, this._delta = 0;
        if (!b) return;
        var d = this._getCenterForScrollWheelZoom(this._lastMousePos, b),
            e = c + b;
        a.setView(d, e)
    },
    _getCenterForScrollWheelZoom: function (a, b) {
        var c = this._map,
            d = c.getPixelBounds().getCenter(),
            e = c.getSize().divideBy(2),
            f = a.subtract(e).multiplyBy(1 - Math.pow(2, -b)),
            g = d.add(f);
        return c.unproject(g, c._zoom, !0)
    }
}), L.Util.extend(L.DomEvent, {
    addDoubleTapListener: function (a, b, c) {
        function k(a) {
            if (a.touches.length !== 1) return;
            var b = Date.now(),
                c = b - (d || b);
            g = a.touches[0], e = c > 0 && c <= f, d = b
        }
        function l(a) {
            e && (g.type = "dblclick", b(g), d = null)
        }
        var d, e = !1,
            f = 250,
            g, h = "_leaflet_",
            i = "touchstart",
            j = "touchend";
        a[h + i + c] = k, a[h + j + c] = l, a.addEventListener(i, k, !1), a.addEventListener(j, l, !1)
    },
    removeDoubleTapListener: function (a, b) {
        var c = "_leaflet_";
        a.removeEventListener(a, a[c + "touchstart" + b], !1), a.removeEventListener(a, a[c + "touchend" + b], !1)
    }
}), L.Map.TouchZoom = L.Handler.extend({
    addHooks: function () {
        L.DomEvent.addListener(this._map._container, "touchstart", this._onTouchStart, this)
    },
    removeHooks: function () {
        L.DomEvent.removeListener(this._map._container, "touchstart", this._onTouchStart, this)
    },
    _onTouchStart: function (a) {
        if (!a.touches || a.touches.length !== 2 || this._map._animatingZoom) return;
        var b = this._map.mouseEventToLayerPoint(a.touches[0]),
            c = this._map.mouseEventToLayerPoint(a.touches[1]),
            d = this._map.containerPointToLayerPoint(this._map.getSize().divideBy(2));
        this._startCenter = b.add(c).divideBy(2, !0), this._startDist = b.distanceTo(c), this._moved = !1, this._zooming = !0, this._centerOffset = d.subtract(this._startCenter), L.DomEvent.addListener(document, "touchmove", this._onTouchMove, this), L.DomEvent.addListener(document, "touchend", this._onTouchEnd, this), L.DomEvent.preventDefault(a)
    },
    _onTouchMove: function (a) {
        if (!a.touches || a.touches.length !== 2) return;
        this._moved || (this._map._mapPane.className += " leaflet-zoom-anim", this._map.fire("zoomstart").fire("movestart")._prepareTileBg(), this._moved = !0);
        var b = this._map.mouseEventToLayerPoint(a.touches[0]),
            c = this._map.mouseEventToLayerPoint(a.touches[1]);
        this._scale = b.distanceTo(c) / this._startDist, this._delta = b.add(c).divideBy(2, !0).subtract(this._startCenter), this._map._tileBg.style.webkitTransform = [L.DomUtil.getTranslateString(this._delta), L.DomUtil.getScaleString(this._scale, this._startCenter)].join(" "), L.DomEvent.preventDefault(a)
    },
    _onTouchEnd: function (a) {
        if (!this._moved || !this._zooming) return;
        this._zooming = !1;
        var b = this._map.getZoom(),
            c = Math.log(this._scale) / Math.LN2,
            d = c > 0 ? Math.ceil(c) : Math.floor(c),
            e = this._map._limitZoom(b + d),
            f = e - b,
            g = this._centerOffset.subtract(this._delta).divideBy(this._scale),
            h = this._map.getPixelOrigin().add(this._startCenter).add(g),
            i = this._map.unproject(h);
        L.DomEvent.removeListener(document, "touchmove", this._onTouchMove), L.DomEvent.removeListener(document, "touchend", this._onTouchEnd);
        var j = Math.pow(2, f);
        this._map._runAnimation(i, e, j / this._scale, this._startCenter.add(g))
    }
}), L.Map.BoxZoom = L.Handler.extend({
    initialize: function (a) {
        this._map = a, this._container = a._container, this._pane = a._panes.overlayPane
    },
    addHooks: function () {
        L.DomEvent.addListener(this._container, "mousedown", this._onMouseDown, this)
    },
    removeHooks: function () {
        L.DomEvent.removeListener(this._container, "mousedown", this._onMouseDown)
    },
    _onMouseDown: function (a) {
        if (!a.shiftKey || a.which !== 1 && a.button !== 1) return !1;
        L.DomUtil.disableTextSelection(), this._startLayerPoint = this._map.mouseEventToLayerPoint(a), this._box = L.DomUtil.create("div", "leaflet-zoom-box", this._pane), L.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", L.DomEvent.addListener(document, "mousemove", this._onMouseMove, this), L.DomEvent.addListener(document, "mouseup", this._onMouseUp, this), L.DomEvent.preventDefault(a)
    },
    _onMouseMove: function (a) {
        var b = this._map.mouseEventToLayerPoint(a),
            c = b.x - this._startLayerPoint.x,
            d = b.y - this._startLayerPoint.y,
            e = Math.min(b.x, this._startLayerPoint.x),
            f = Math.min(b.y, this._startLayerPoint.y),
            g = new L.Point(e, f);
        L.DomUtil.setPosition(this._box, g), this._box.style.width = Math.abs(c) - 4 + "px", this._box.style.height = Math.abs(d) - 4 + "px"
    },
    _onMouseUp: function (a) {
        this._pane.removeChild(this._box), this._container.style.cursor = "", L.DomUtil.enableTextSelection(), L.DomEvent.removeListener(document, "mousemove", this._onMouseMove), L.DomEvent.removeListener(document, "mouseup", this._onMouseUp);
        var b = this._map.mouseEventToLayerPoint(a),
            c = new L.LatLngBounds(this._map.layerPointToLatLng(this._startLayerPoint), this._map.layerPointToLatLng(b));
        this._map.fitBounds(c)
    }
}), L.Handler.MarkerDrag = L.Handler.extend({
    initialize: function (a) {
        this._marker = a
    },
    addHooks: function () {
        var a = this._marker._icon;
        this._draggable || (this._draggable = new L.Draggable(a, a), this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this)), this._draggable.enable()
    },
    removeHooks: function () {
        this._draggable.disable()
    },
    moved: function () {
        return this._draggable && this._draggable._moved
    },
    _onDragStart: function (a) {
        this._marker.closePopup().fire("movestart").fire("dragstart")
    },
    _onDrag: function (a) {
        var b = L.DomUtil.getPosition(this._marker._icon);
        this._marker._shadow && L.DomUtil.setPosition(this._marker._shadow, b), this._marker._latlng = this._marker._map.layerPointToLatLng(b), this._marker.fire("move").fire("drag")
    },
    _onDragEnd: function () {
        this._marker.fire("moveend").fire("dragend")
    }
}), L.Control = {}, L.Control.Position = {
    TOP_LEFT: "topLeft",
    TOP_RIGHT: "topRight",
    BOTTOM_LEFT: "bottomLeft",
    BOTTOM_RIGHT: "bottomRight"
}, L.Map.include({
    addControl: function (a) {
        a.onAdd(this);
        var b = a.getPosition(),
            c = this._controlCorners[b],
            d = a.getContainer();
        return L.DomUtil.addClass(d, "leaflet-control"), b.indexOf("bottom") !== -1 ? c.insertBefore(d, c.firstChild) : c.appendChild(d), this
    },
    removeControl: function (a) {
        var b = a.getPosition(),
            c = this._controlCorners[b],
            d = a.getContainer();
        return c.removeChild(d), a.onRemove && a.onRemove(this), this
    },
    _initControlPos: function () {
        var a = this._controlCorners = {},
            b = "leaflet-",
            c = b + "top",
            d = b + "bottom",
            e = b + "left",
            f = b + "right",
            g = L.DomUtil.create("div", b + "control-container", this._container);
        L.Browser.touch && (g.className += " " + b + "big-buttons"), a.topLeft = L.DomUtil.create("div", c + " " + e, g), a.topRight = L.DomUtil.create("div", c + " " + f, g), a.bottomLeft = L.DomUtil.create("div", d + " " + e, g), a.bottomRight = L.DomUtil.create("div", d + " " + f, g)
    }
}), L.Control.Zoom = L.Class.extend({
    onAdd: function (a) {
        this._map = a, this._container = L.DomUtil.create("div", "leaflet-control-zoom"), this._zoomInButton = this._createButton("Zoom in", "leaflet-control-zoom-in", this._map.zoomIn, this._map), this._zoomOutButton = this._createButton("Zoom out", "leaflet-control-zoom-out", this._map.zoomOut, this._map), this._container.appendChild(this._zoomInButton), this._container.appendChild(this._zoomOutButton)
    },
    getContainer: function () {
        return this._container
    },
    getPosition: function () {
        return L.Control.Position.TOP_LEFT
    },
    _createButton: function (a, b, c, d) {
        var e = document.createElement("a");
        return e.href = "#", e.title = a, e.className = b, L.Browser.touch || L.DomEvent.disableClickPropagation(e), L.DomEvent.addListener(e, "click", L.DomEvent.preventDefault), L.DomEvent.addListener(e, "click", c, d), e
    }
}), L.Control.Attribution = L.Class.extend({
    initialize: function (a) {
        this._prefix = a || 'Powered by <a href="http://leaflet.cloudmade.com">Leaflet</a>', this._attributions = {}
    },
    onAdd: function (a) {
        this._container = L.DomUtil.create("div", "leaflet-control-attribution"), L.DomEvent.disableClickPropagation(this._container), this._map = a, this._update()
    },
    getPosition: function () {
        return L.Control.Position.BOTTOM_RIGHT
    },
    getContainer: function () {
        return this._container
    },
    setPrefix: function (a) {
        this._prefix = a, this._update()
    },
    addAttribution: function (a) {
        if (!a) return;
        this._attributions[a] || (this._attributions[a] = 0), this._attributions[a]++, this._update()
    },
    removeAttribution: function (a) {
        if (!a) return;
        this._attributions[a]--, this._update()
    },
    _update: function () {
        if (!this._map) return;
        var a = [];
        for (var b in this._attributions) this._attributions.hasOwnProperty(b) && a.push(b);
        var c = [];
        this._prefix && c.push(this._prefix), a.length && c.push(a.join(", ")), this._container.innerHTML = c.join(" &mdash; ")
    }
}), L.Control.Layers = L.Class.extend({
    options: {
        collapsed: !0
    },
    initialize: function (a, b, c) {
        L.Util.setOptions(this, c), this._layers = {};
        for (var d in a) a.hasOwnProperty(d) && this._addLayer(a[d], d);
        for (d in b) b.hasOwnProperty(d) && this._addLayer(b[d], d, !0)
    },
    onAdd: function (a) {
        this._map = a, this._initLayout(), this._update()
    },
    getContainer: function () {
        return this._container
    },
    getPosition: function () {
        return L.Control.Position.TOP_RIGHT
    },
    addBaseLayer: function (a, b) {
        return this._addLayer(a, b), this._update(), this
    },
    addOverlay: function (a, b) {
        return this._addLayer(a, b, !0), this._update(), this
    },
    removeLayer: function (a) {
        var b = L.Util.stamp(a);
        return delete this._layers[b], this._update(), this
    },
    _initLayout: function () {
        this._container = L.DomUtil.create("div", "leaflet-control-layers"), L.Browser.touch || L.DomEvent.disableClickPropagation(this._container), this._form = L.DomUtil.create("form", "leaflet-control-layers-list");
        if (this.options.collapsed) {
            L.DomEvent.addListener(this._container, "mouseover", this._expand, this), L.DomEvent.addListener(this._container, "mouseout", this._collapse, this);
            var a = this._layersLink = L.DomUtil.create("a", "leaflet-control-layers-toggle");
            a.href = "#", a.title = "Layers", L.Browser.touch ? L.DomEvent.addListener(a, "click", this._expand, this) : L.DomEvent.addListener(a, "focus", this._expand, this), this._map.on("movestart", this._collapse, this), this._container.appendChild(a)
        } else this._expand();
        this._baseLayersList = L.DomUtil.create("div", "leaflet-control-layers-base", this._form), this._separator = L.DomUtil.create("div", "leaflet-control-layers-separator", this._form), this._overlaysList = L.DomUtil.create("div", "leaflet-control-layers-overlays", this._form), this._container.appendChild(this._form)
    },
    _addLayer: function (a, b, c) {
        var d = L.Util.stamp(a);
        this._layers[d] = {
            layer: a,
            name: b,
            overlay: c
        }
    },
    _update: function () {
        if (!this._container) return;
        this._baseLayersList.innerHTML = "", this._overlaysList.innerHTML = "";
        var a = !1,
            b = !1;
        for (var c in this._layers) if (this._layers.hasOwnProperty(c)) {
            var d = this._layers[c];
            this._addItem(d), b = b || d.overlay, a = a || !d.overlay
        }
        this._separator.style.display = b && a ? "" : "none"
    },
    _addItem: function (a, b) {
        var c = document.createElement("label"),
            d = document.createElement("input");
        a.overlay || (d.name = "leaflet-base-layers"), d.type = a.overlay ? "checkbox" : "radio", d.checked = this._map.hasLayer(a.layer), d.layerId = L.Util.stamp(a.layer), L.DomEvent.addListener(d, "click", this._onInputClick, this);
        var e = document.createTextNode(" " + a.name);
        c.appendChild(d), c.appendChild(e);
        var f = a.overlay ? this._overlaysList : this._baseLayersList;
        f.appendChild(c)
    },
    _onInputClick: function () {
        var a, b, c, d = this._form.getElementsByTagName("input"),
            e = d.length;
        for (a = 0; a < e; a++) b = d[a], c = this._layers[b.layerId], b.checked ? this._map.addLayer(c.layer, !c.overlay) : this._map.removeLayer(c.layer)
    },
    _expand: function () {
        L.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
    },
    _collapse: function () {
        this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
    }
}), L.Transition = L.Class.extend({
    includes: L.Mixin.Events,
    statics: {
        CUSTOM_PROPS_SETTERS: {
            position: L.DomUtil.setPosition
        },
        implemented: function () {
            return L.Transition.NATIVE || L.Transition.TIMER
        }
    },
    options: {
        easing: "ease",
        duration: .5
    },
    _setProperty: function (a, b) {
        var c = L.Transition.CUSTOM_PROPS_SETTERS;
        a in c ? c[a](this._el, b) : this._el.style[a] = b
    }
}), L.Transition = L.Transition.extend({
    statics: function () {
        var a = L.DomUtil.TRANSITION,
            b = a === "webkitTransition" || a === "OTransition" ? a + "End" : "transitionend";
        return {
            NATIVE: !! a,
            TRANSITION: a,
            PROPERTY: a + "Property",
            DURATION: a + "Duration",
            EASING: a + "TimingFunction",
            END: b,
            CUSTOM_PROPS_PROPERTIES: {
                position: L.Browser.webkit ? L.DomUtil.TRANSFORM : "top, left"
            }
        }
    }(),
    options: {
        fakeStepInterval: 100
    },
    initialize: function (a, b) {
        this._el = a, L.Util.setOptions(this, b), L.DomEvent.addListener(a, L.Transition.END, this._onTransitionEnd, this), this._onFakeStep = L.Util.bind(this._onFakeStep, this)
    },
    run: function (a) {
        var b, c = [],
            d = L.Transition.CUSTOM_PROPS_PROPERTIES;
        for (b in a) a.hasOwnProperty(b) && (b = d[b] ? d[b] : b, b = this._dasherize(b), c.push(b));
        this._el.style[L.Transition.DURATION] = this.options.duration + "s", this._el.style[L.Transition.EASING] = this.options.easing, this._el.style[L.Transition.PROPERTY] = c.join(", ");
        for (b in a) a.hasOwnProperty(b) && this._setProperty(b, a[b]);
        this._inProgress = !0, this.fire("start"), L.Transition.NATIVE ? (clearInterval(this._timer), this._timer = setInterval(this._onFakeStep, this.options.fakeStepInterval)) : this._onTransitionEnd()
    },
    _dasherize: function () {
        function b(a) {
            return "-" + a.toLowerCase()
        }
        var a = /([A-Z])/g;
        return function (c) {
            return c.replace(a, b)
        }
    }(),
    _onFakeStep: function () {
        this.fire("step")
    },
    _onTransitionEnd: function () {
        this._inProgress && (this._inProgress = !1, clearInterval(this._timer), this._el.style[L.Transition.PROPERTY] = "none", this.fire("step"), this.fire("end"))
    }
}), L.Transition = L.Transition.NATIVE ? L.Transition : L.Transition.extend({
    statics: {
        getTime: Date.now ||
        function () {
            return +(new Date)
        },
        TIMER: !0,
        EASINGS: {
            ease: [.25, .1, .25, 1],
            linear: [0, 0, 1, 1],
            "ease-in": [.42, 0, 1, 1],
            "ease-out": [0, 0, .58, 1],
            "ease-in-out": [.42, 0, .58, 1]
        },
        CUSTOM_PROPS_GETTERS: {
            position: L.DomUtil.getPosition
        },
        UNIT_RE: /^[\d\.]+(\D*)$/
    },
    options: {
        fps: 50
    },
    initialize: function (a, b) {
        this._el = a, L.Util.extend(this.options, b);
        var c = L.Transition.EASINGS[this.options.easing] || L.Transition.EASINGS.ease;
        this._p1 = new L.Point(0, 0), this._p2 = new L.Point(c[0], c[1]), this._p3 = new L.Point(c[2], c[3]), this._p4 = new L.Point(1, 1), this._step = L.Util.bind(this._step, this), this._interval = Math.round(1e3 / this.options.fps)
    },
    run: function (a) {
        this._props = {};
        var b = L.Transition.CUSTOM_PROPS_GETTERS,
            c = L.Transition.UNIT_RE;
        this.fire("start");
        for (var d in a) if (a.hasOwnProperty(d)) {
            var e = {};
            if (d in b) e.from = b[d](this._el);
            else {
                var f = this._el.style[d].match(c);
                e.from = parseFloat(f[0]), e.unit = f[1]
            }
            e.to = a[d], this._props[d] = e
        }
        clearInterval(this._timer), this._timer = setInterval(this._step, this._interval), this._startTime = L.Transition.getTime()
    },
    _step: function () {
        var a = L.Transition.getTime(),
            b = a - this._startTime,
            c = this.options.duration * 1e3;
        b < c ? this._runFrame(this._cubicBezier(b / c)) : (this._runFrame(1), this._complete())
    },
    _runFrame: function (a) {
        var b = L.Transition.CUSTOM_PROPS_SETTERS,
            c, d, e;
        for (c in this._props) this._props.hasOwnProperty(c) && (d = this._props[c], c in b ? (e = d.to.subtract(d.from).multiplyBy(a).add(d.from), b[c](this._el, e)) : this._el.style[c] = (d.to - d.from) * a + d.from + d.unit);
        this.fire("step")
    },
    _complete: function () {
        clearInterval(this._timer), this.fire("end")
    },
    _cubicBezier: function (a) {
        var b = Math.pow(1 - a, 3),
            c = 3 * Math.pow(1 - a, 2) * a,
            d = 3 * (1 - a) * Math.pow(a, 2),
            e = Math.pow(a, 3),
            f = this._p1.multiplyBy(b),
            g = this._p2.multiplyBy(c),
            h = this._p3.multiplyBy(d),
            i = this._p4.multiplyBy(e);
        return f.add(g).add(h).add(i).y
    }
}), L.Map.include(!L.Transition || !L.Transition.implemented() ? {} : {
    setView: function (a, b, c) {
        b = this._limitZoom(b);
        var d = this._zoom !== b;
        if (this._loaded && !c && this._layers) {
            var e = this._getNewTopLeftPoint(a).subtract(this._getTopLeftPoint());
            a = new L.LatLng(a.lat, a.lng);
            var f = d ? !! this._zoomToIfCenterInView && this._zoomToIfCenterInView(a, b, e) : this._panByIfClose(e);
            if (f) return this
        }
        return this._resetView(a, b), this
    },
    panBy: function (a) {
        return !a.x && !a.y ? this : (this._panTransition || (this._panTransition = new L.Transition(this._mapPane, {
            duration: .3
        }), this._panTransition.on("step", this._onPanTransitionStep, this), this._panTransition.on("end", this._onPanTransitionEnd, this)), this.fire("movestart"), this._panTransition.run({
            position: L.DomUtil.getPosition(this._mapPane).subtract(a)
        }), this)
    },
    _onPanTransitionStep: function () {
        this.fire("move")
    },
    _onPanTransitionEnd: function () {
        this.fire("moveend")
    },
    _panByIfClose: function (a) {
        return this._offsetIsWithinView(a) ? (this.panBy(a), !0) : !1
    },
    _offsetIsWithinView: function (a, b) {
        var c = b || 1,
            d = this.getSize();
        return Math.abs(a.x) <= d.x * c && Math.abs(a.y) <= d.y * c
    }
}), L.Map.include(L.DomUtil.TRANSITION ? {
    _zoomToIfCenterInView: function (a, b, c) {
        if (this._animatingZoom) return !0;
        if (!this.options.zoomAnimation) return !1;
        var d = b - this._zoom,
            e = Math.pow(2, d),
            f = c.divideBy(1 - 1 / e);
        if (!this._offsetIsWithinView(f, 1)) return !1;
        this._mapPane.className += " leaflet-zoom-anim", this.fire("movestart").fire("zoomstart");
        var g = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
            h = g.add(f);
        return this._prepareTileBg(), this._runAnimation(a, b, e, h), !0
    },
    _runAnimation: function (a, b, c, d) {
        this._animatingZoom = !0, this._animateToCenter = a, this._animateToZoom = b;
        var e = L.DomUtil.TRANSFORM;
        clearTimeout(this._clearTileBgTimer);
        if (L.Browser.gecko || window.opera) this._tileBg.style[e] += " translate(0,0)";
        var f;
        L.Browser.android ? (this._tileBg.style[e + "Origin"] = d.x + "px " + d.y + "px", f = "scale(" + c + ")") : f = L.DomUtil.getScaleString(c, d), L.Util.falseFn(this._tileBg.offsetWidth);
        var g = {};
        g[e] = this._tileBg.style[e] + " " + f, this._tileBg.transition.run(g)
    },
    _prepareTileBg: function () {
        this._tileBg || (this._tileBg = this._createPane("leaflet-tile-pane", this._mapPane), this._tileBg.style.zIndex = 1);
        var a = this._tilePane,
            b = this._tileBg;
        b.style[L.DomUtil.TRANSFORM] = "", b.style.visibility = "hidden", b.empty = !0, a.empty = !1, this._tilePane = this._panes.tilePane = b, this._tileBg = a, this._tileBg.transition || (this._tileBg.transition = new L.Transition(this._tileBg, {
            duration: .3,
            easing: "cubic-bezier(0.25,0.1,0.25,0.75)"
        }), this._tileBg.transition.on("end", this._onZoomTransitionEnd, this)), this._stopLoadingBgTiles()
    },
    _stopLoadingBgTiles: function () {
        var a = [].slice.call(this._tileBg.getElementsByTagName("img"));
        for (var b = 0, c = a.length; b < c; b++) a[b].complete || (a[b].onload = L.Util.falseFn, a[b].onerror = L.Util.falseFn, a[b].src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", a[b].parentNode.removeChild(a[b]), a[b] = null)
    },
    _onZoomTransitionEnd: function () {
        this._restoreTileFront(), L.Util.falseFn(this._tileBg.offsetWidth), this._resetView(this._animateToCenter, this._animateToZoom, !0, !0), this._mapPane.className = this._mapPane.className.replace(" leaflet-zoom-anim", ""), this._animatingZoom = !1
    },
    _restoreTileFront: function () {
        this._tilePane.innerHTML = "", this._tilePane.style.visibility = "", this._tilePane.style.zIndex = 2, this._tileBg.style.zIndex = 1
    },
    _clearTileBg: function () {
        !this._animatingZoom && !this.touchZoom._zooming && (this._tileBg.innerHTML = "")
    }
} : {}), L.Map.include({
    locate: function (a) {
        this._locationOptions = a = L.Util.extend({
            watch: !1,
            setView: !1,
            maxZoom: Infinity,
            timeout: 1e4,
            maximumAge: 0,
            enableHighAccuracy: !1
        }, a);
        if (!navigator.geolocation) return this.fire("locationerror", {
            code: 0,
            message: "Geolocation not supported."
        });
        var b = L.Util.bind(this._handleGeolocationResponse, this),
            c = L.Util.bind(this._handleGeolocationError, this);
        return a.watch ? this._locationWatchId = navigator.geolocation.watchPosition(b, c, a) : navigator.geolocation.getCurrentPosition(b, c, a), this
    },
    stopLocate: function () {
        navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId)
    },
    locateAndSetView: function (a, b) {
        return b = L.Util.extend({
            maxZoom: a || Infinity,
            setView: !0
        }, b), this.locate(b)
    },
    _handleGeolocationError: function (a) {
        var b = a.code,
            c = b === 1 ? "permission denied" : b === 2 ? "position unavailable" : "timeout";
        this._locationOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
            code: b,
            message: "Geolocation error: " + c + "."
        })
    },
    _handleGeolocationResponse: function (a) {
        var b = 180 * a.coords.accuracy / 4e7,
            c = b * 2,
            d = a.coords.latitude,
            e = a.coords.longitude,
            f = new L.LatLng(d, e),
            g = new L.LatLng(d - b, e - c),
            h = new L.LatLng(d + b, e + c),
            i = new L.LatLngBounds(g, h);
        if (this._locationOptions.setView) {
            var j = Math.min(this.getBoundsZoom(i), this._locationOptions.maxZoom);
            this.setView(f, j)
        }
        this.fire("locationfound", {
            latlng: f,
            bounds: i,
            accuracy: a.coords.accuracy
        })
    }
});
