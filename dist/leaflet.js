/*
 Copyright (c) 2010-2012, CloudMade, Vladimir Agafonkin
 Leaflet is an open-source JavaScript library for mobile-friendly interactive maps.
 http://leaflet.cloudmade.com
*/
(function (e, t) {
    var n, r;
    typeof exports != t + "" ? n = exports : (r = e.L, n = {}, n.noConflict = function () {
        return e.L = r, this
    }, e.L = n), n.version = "0.4.5", n.Util = {
        extend: function (e) {
            var t = Array.prototype.slice.call(arguments, 1);
            for (var n = 0, r = t.length, i; n < r; n++) {
                i = t[n] || {};
                for (var s in i) i.hasOwnProperty(s) && (e[s] = i[s])
            }
            return e
        },
        bind: function (e, t) {
            var n = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
            return function () {
                return e.apply(t, n || arguments)
            }
        },
        stamp: function () {
            var e = 0,
                t = "_leaflet_id";
            return function (n) {
                return n[t] = n[t] || ++e, n[t]
            }
        }(),
        limitExecByInterval: function (e, t, n) {
            var r, i;
            return function s() {
                var o = arguments;
                if (r) {
                    i = !0;
                    return
                }
                r = !0, setTimeout(function () {
                    r = !1, i && (s.apply(n, o), i = !1)
                }, t), e.apply(n, o)
            }
        },
        falseFn: function () {
            return !1
        },
        formatNum: function (e, t) {
            var n = Math.pow(10, t || 5);
            return Math.round(e * n) / n
        },
        splitWords: function (e) {
            return e.replace(/^\s+|\s+$/g, "").split(/\s+/)
        },
        setOptions: function (e, t) {
            return e.options = n.Util.extend({}, e.options, t), e.options
        },
        getParamString: function (e) {
            var t = [];
            for (var n in e) e.hasOwnProperty(n) && t.push(n + "=" + e[n]);
            return "?" + t.join("&")
        },
        template: function (e, t) {
            return e.replace(/\{ *([\w_]+) *\}/g, function (e, n) {
                var r = t[n];
                if (!t.hasOwnProperty(n)) throw Error("No value provided for variable " + e);
                return r
            })
        },
        emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    },
    function () {
        function t(t) {
            var n, r, i = ["webkit", "moz", "o", "ms"];
            for (n = 0; n < i.length && !r; n++) r = e[i[n] + t];
            return r
        }
        function r(t) {
            return e.setTimeout(t, 1e3 / 60)
        }
        var i = e.requestAnimationFrame || t("RequestAnimationFrame") || r,
            s = e.cancelAnimationFrame || t("CancelAnimationFrame") || t("CancelRequestAnimationFrame") || function (t) {
                e.clearTimeout(t)
            };
        n.Util.requestAnimFrame = function (t, s, o, u) {
            t = n.Util.bind(t, s);
            if (!o || i !== r) return i.call(e, t, u);
            t()
        }, n.Util.cancelAnimFrame = function (t) {
            t && s.call(e, t)
        }
    }(), n.Class = function () {}, n.Class.extend = function (e) {
        var t = function () {
            this.initialize && this.initialize.apply(this, arguments)
        }, r = function () {};
        r.prototype = this.prototype;
        var i = new r;
        i.constructor = t, t.prototype = i;
        for (var s in this) this.hasOwnProperty(s) && s !== "prototype" && (t[s] = this[s]);
        return e.statics && (n.Util.extend(t, e.statics), delete e.statics), e.includes && (n.Util.extend.apply(null, [i].concat(e.includes)), delete e.includes), e.options && i.options && (e.options = n.Util.extend({}, i.options, e.options)), n.Util.extend(i, e), t
    }, n.Class.include = function (e) {
        n.Util.extend(this.prototype, e)
    }, n.Class.mergeOptions = function (e) {
        n.Util.extend(this.prototype.options, e)
    };
    var i = "_leaflet_events";
    n.Mixin = {}, n.Mixin.Events = {
        addEventListener: function (e, t, r) {
            var s = this[i] = this[i] || {}, o, u, a;
            if (typeof e == "object") {
                for (o in e) e.hasOwnProperty(o) && this.addEventListener(o, e[o], t);
                return this
            }
            e = n.Util.splitWords(e);
            for (u = 0, a = e.length; u < a; u++) s[e[u]] = s[e[u]] || [], s[e[u]].push({
                action: t,
                context: r || this
            });
            return this
        },
        hasEventListeners: function (e) {
            return i in this && e in this[i] && this[i][e].length > 0
        },
        removeEventListener: function (e, t, r) {
            var s = this[i],
                o, u, a, f, l;
            if (typeof e == "object") {
                for (o in e) e.hasOwnProperty(o) && this.removeEventListener(o, e[o], t);
                return this
            }
            e = n.Util.splitWords(e);
            for (u = 0, a = e.length; u < a; u++) if (this.hasEventListeners(e[u])) {
                f = s[e[u]];
                for (l = f.length - 1; l >= 0; l--)(!t || f[l].action === t) && (!r || f[l].context === r) && f.splice(l, 1)
            }
            return this
        },
        fireEvent: function (e, t) {
            if (!this.hasEventListeners(e)) return this;
            var r = n.Util.extend({
                type: e,
                target: this
            }, t),
                s = this[i][e].slice();
            for (var o = 0, u = s.length; o < u; o++) s[o].action.call(s[o].context || this, r);
            return this
        }
    }, n.Mixin.Events.on = n.Mixin.Events.addEventListener, n.Mixin.Events.off = n.Mixin.Events.removeEventListener, n.Mixin.Events.fire = n.Mixin.Events.fireEvent,
    function () {
        var r = navigator.userAgent.toLowerCase(),
            i = !! e.ActiveXObject,
            s = i && !e.XMLHttpRequest,
            o = r.indexOf("webkit") !== -1,
            u = r.indexOf("gecko") !== -1,
            a = r.indexOf("chrome") !== -1,
            f = e.opera,
            l = r.indexOf("android") !== -1,
            c = r.search("android [23]") !== -1,
            h = typeof orientation != t + "" ? !0 : !1,
            p = document.documentElement,
            d = i && "transition" in p.style,
            v = o && "WebKitCSSMatrix" in e && "m11" in new e.WebKitCSSMatrix,
            m = u && "MozPerspective" in p.style,
            g = f && "OTransition" in p.style,
            y = !e.L_NO_TOUCH && function () {
                var e = "ontouchstart";
                if (e in p) return !0;
                var t = document.createElement("div"),
                    n = !1;
                return t.setAttribute ? (t.setAttribute(e, "return;"), typeof t[e] == "function" && (n = !0), t.removeAttribute(e), t = null, n) : !1
            }(),
            b = "devicePixelRatio" in e && e.devicePixelRatio > 1 || "matchMedia" in e && e.matchMedia("(min-resolution:144dpi)").matches;
        n.Browser = {
            ua: r,
            ie: i,
            ie6: s,
            webkit: o,
            gecko: u,
            opera: f,
            android: l,
            android23: c,
            chrome: a,
            ie3d: d,
            webkit3d: v,
            gecko3d: m,
            opera3d: g,
            any3d: !e.L_DISABLE_3D && (d || v || m || g),
            mobile: h,
            mobileWebkit: h && o,
            mobileWebkit3d: h && v,
            mobileOpera: h && f,
            touch: y,
            retina: b
        }
    }(), n.Point = function (e, t, n) {
        this.x = n ? Math.round(e) : e, this.y = n ? Math.round(t) : t
    }, n.Point.prototype = {
        add: function (e) {
            return this.clone()._add(n.point(e))
        },
        _add: function (e) {
            return this.x += e.x, this.y += e.y, this
        },
        subtract: function (e) {
            return this.clone()._subtract(n.point(e))
        },
        _subtract: function (e) {
            return this.x -= e.x, this.y -= e.y, this
        },
        divideBy: function (e, t) {
            return new n.Point(this.x / e, this.y / e, t)
        },
        multiplyBy: function (e, t) {
            return new n.Point(this.x * e, this.y * e, t)
        },
        distanceTo: function (e) {
            e = n.point(e);
            var t = e.x - this.x,
                r = e.y - this.y;
            return Math.sqrt(t * t + r * r)
        },
        round: function () {
            return this.clone()._round()
        },
        _round: function () {
            return this.x = Math.round(this.x), this.y = Math.round(this.y), this
        },
        floor: function () {
            return this.clone()._floor()
        },
        _floor: function () {
            return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
        },
        clone: function () {
            return new n.Point(this.x, this.y)
        },
        toString: function () {
            return "Point(" + n.Util.formatNum(this.x) + ", " + n.Util.formatNum(this.y) + ")"
        }
    }, n.point = function (e, t, r) {
        return e instanceof n.Point ? e : e instanceof Array ? new n.Point(e[0], e[1]) : isNaN(e) ? e : new n.Point(e, t, r)
    }, n.Bounds = n.Class.extend({
        initialize: function (e, t) {
            if (!e) return;
            var n = t ? [e, t] : e;
            for (var r = 0, i = n.length; r < i; r++) this.extend(n[r])
        },
        extend: function (e) {
            return e = n.point(e), !this.min && !this.max ? (this.min = e.clone(), this.max = e.clone()) : (this.min.x = Math.min(e.x, this.min.x), this.max.x = Math.max(e.x, this.max.x), this.min.y = Math.min(e.y, this.min.y), this.max.y = Math.max(e.y, this.max.y)), this
        },
        getCenter: function (e) {
            return new n.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, e)
        },
        getBottomLeft: function () {
            return new n.Point(this.min.x, this.max.y)
        },
        getTopRight: function () {
            return new n.Point(this.max.x, this.min.y)
        },
        contains: function (e) {
            var t, r;
            return typeof e[0] == "number" || e instanceof n.Point ? e = n.point(e) : e = n.bounds(e), e instanceof n.Bounds ? (t = e.min, r = e.max) : t = r = e, t.x >= this.min.x && r.x <= this.max.x && t.y >= this.min.y && r.y <= this.max.y
        },
        intersects: function (e) {
            e = n.bounds(e);
            var t = this.min,
                r = this.max,
                i = e.min,
                s = e.max,
                o = s.x >= t.x && i.x <= r.x,
                u = s.y >= t.y && i.y <= r.y;
            return o && u
        }
    }), n.bounds = function (e, t) {
        return !e || e instanceof n.Bounds ? e : new n.Bounds(e, t)
    }, n.Transformation = n.Class.extend({
        initialize: function (e, t, n, r) {
            this._a = e, this._b = t, this._c = n, this._d = r
        },
        transform: function (e, t) {
            return this._transform(e.clone(), t)
        },
        _transform: function (e, t) {
            return t = t || 1, e.x = t * (this._a * e.x + this._b), e.y = t * (this._c * e.y + this._d), e
        },
        untransform: function (e, t) {
            return t = t || 1, new n.Point((e.x / t - this._b) / this._a, (e.y / t - this._d) / this._c)
        }
    }), n.DomUtil = {
        get: function (e) {
            return typeof e == "string" ? document.getElementById(e) : e
        },
        getStyle: function (e, t) {
            var n = e.style[t];
            !n && e.currentStyle && (n = e.currentStyle[t]);
            if (!n || n === "auto") {
                var r = document.defaultView.getComputedStyle(e, null);
                n = r ? r[t] : null
            }
            return n === "auto" ? null : n
        },
        getViewportOffset: function (e) {
            var t = 0,
                r = 0,
                i = e,
                s = document.body;
            do {
                t += i.offsetTop || 0, r += i.offsetLeft || 0;
                if (i.offsetParent === s && n.DomUtil.getStyle(i, "position") === "absolute") break;
                if (n.DomUtil.getStyle(i, "position") === "fixed") {
                    t += s.scrollTop || 0, r += s.scrollLeft || 0;
                    break
                }
                i = i.offsetParent
            } while (i);
            i = e;
            do {
                if (i === s) break;
                t -= i.scrollTop || 0, r -= i.scrollLeft || 0, i = i.parentNode
            } while (i);
            return new n.Point(r, t)
        },
        create: function (e, t, n) {
            var r = document.createElement(e);
            return r.className = t, n && n.appendChild(r), r
        },
        disableTextSelection: function () {
            document.selection && document.selection.empty && document.selection.empty(), this._onselectstart || (this._onselectstart = document.onselectstart, document.onselectstart = n.Util.falseFn)
        },
        enableTextSelection: function () {
            document.onselectstart = this._onselectstart, this._onselectstart = null
        },
        hasClass: function (e, t) {
            return e.className.length > 0 && RegExp("(^|\\s)" + t + "(\\s|$)").test(e.className)
        },
        addClass: function (e, t) {
            n.DomUtil.hasClass(e, t) || (e.className += (e.className ? " " : "") + t)
        },
        removeClass: function (e, t) {
            function n(e, n) {
                return n === t ? "" : e
            }
            e.className = e.className.replace(/(\S+)\s*/g, n).replace(/(^\s+|\s+$)/, "")
        },
        setOpacity: function (e, t) {
            if ("opacity" in e.style) e.style.opacity = t;
            else if (n.Browser.ie) {
                var r = !1,
                    i = "DXImageTransform.Microsoft.Alpha";
                try {
                    r = e.filters.item(i)
                } catch (s) {}
                t = Math.round(t * 100), r ? (r.Enabled = t !== 100, r.Opacity = t) : e.style.filter += " progid:" + i + "(opacity=" + t + ")"
            }
        },
        testProp: function (e) {
            var t = document.documentElement.style;
            for (var n = 0; n < e.length; n++) if (e[n] in t) return e[n];
            return !1
        },
        getTranslateString: function (e) {
            var t = n.Browser.webkit3d,
                r = "translate" + (t ? "3d" : "") + "(",
                i = (t ? ",0" : "") + ")";
            return r + e.x + "px," + e.y + "px" + i
        },
        getScaleString: function (e, t) {
            var r = n.DomUtil.getTranslateString(t.add(t.multiplyBy(-1 * e))),
                i = " scale(" + e + ") ";
            return r + i
        },
        setPosition: function (e, t, r) {
            e._leaflet_pos = t, !r && n.Browser.any3d ? (e.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(t), n.Browser.mobileWebkit3d && (e.style.WebkitBackfaceVisibility = "hidden")) : (e.style.left = t.x + "px", e.style.top = t.y + "px")
        },
        getPosition: function (e) {
            return e._leaflet_pos
        }
    }, n.Util.extend(n.DomUtil, {
        TRANSITION: n.DomUtil.testProp(["transition", "webkitTransition", "OTransition", "MozTransition", "msTransition"]),
        TRANSFORM: n.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"])
    }), n.LatLng = function (e, t, n) {
        var r = parseFloat(e),
            i = parseFloat(t);
        if (isNaN(r) || isNaN(i)) throw Error("Invalid LatLng object: (" + e + ", " + t + ")");
        n !== !0 && (r = Math.max(Math.min(r, 90), -90), i = (i + 180) % 360 + (i < -180 || i === 180 ? 180 : -180)), this.lat = r, this.lng = i
    }, n.Util.extend(n.LatLng, {
        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        MAX_MARGIN: 1e-9
    }), n.LatLng.prototype = {
        equals: function (e) {
            if (!e) return !1;
            e = n.latLng(e);
            var t = Math.max(Math.abs(this.lat - e.lat), Math.abs(this.lng - e.lng));
            return t <= n.LatLng.MAX_MARGIN
        },
        toString: function () {
            return "LatLng(" + n.Util.formatNum(this.lat) + ", " + n.Util.formatNum(this.lng) + ")"
        },
        distanceTo: function (e) {
            e = n.latLng(e);
            var t = 6378137,
                r = n.LatLng.DEG_TO_RAD,
                i = (e.lat - this.lat) * r,
                s = (e.lng - this.lng) * r,
                o = this.lat * r,
                u = e.lat * r,
                a = Math.sin(i / 2),
                f = Math.sin(s / 2),
                l = a * a + f * f * Math.cos(o) * Math.cos(u);
            return t * 2 * Math.atan2(Math.sqrt(l), Math.sqrt(1 - l))
        }
    }, n.latLng = function (e, t, r) {
        return e instanceof n.LatLng ? e : e instanceof Array ? new n.LatLng(e[0], e[1]) : isNaN(e) ? e : new n.LatLng(e, t, r)
    }, n.LatLngBounds = n.Class.extend({
        initialize: function (e, t) {
            if (!e) return;
            var n = t ? [e, t] : e;
            for (var r = 0, i = n.length; r < i; r++) this.extend(n[r])
        },
        extend: function (e) {
            return typeof e[0] == "number" || e instanceof n.LatLng ? e = n.latLng(e) : e = n.latLngBounds(e), e instanceof n.LatLng ? !this._southWest && !this._northEast ? (this._southWest = new n.LatLng(e.lat, e.lng, !0), this._northEast = new n.LatLng(e.lat, e.lng, !0)) : (this._southWest.lat = Math.min(e.lat, this._southWest.lat), this._southWest.lng = Math.min(e.lng, this._southWest.lng), this._northEast.lat = Math.max(e.lat, this._northEast.lat), this._northEast.lng = Math.max(e.lng, this._northEast.lng)) : e instanceof n.LatLngBounds && (this.extend(e._southWest), this.extend(e._northEast)), this
        },
        pad: function (e) {
            var t = this._southWest,
                r = this._northEast,
                i = Math.abs(t.lat - r.lat) * e,
                s = Math.abs(t.lng - r.lng) * e;
            return new n.LatLngBounds(new n.LatLng(t.lat - i, t.lng - s), new n.LatLng(r.lat + i, r.lng + s))
        },
        getCenter: function () {
            return new n.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2)
        },
        getSouthWest: function () {
            return this._southWest
        },
        getNorthEast: function () {
            return this._northEast
        },
        getNorthWest: function () {
            return new n.LatLng(this._northEast.lat, this._southWest.lng, !0)
        },
        getSouthEast: function () {
            return new n.LatLng(this._southWest.lat, this._northEast.lng, !0)
        },
        contains: function (e) {
            typeof e[0] == "number" || e instanceof n.LatLng ? e = n.latLng(e) : e = n.latLngBounds(e);
            var t = this._southWest,
                r = this._northEast,
                i, s;
            return e instanceof n.LatLngBounds ? (i = e.getSouthWest(), s = e.getNorthEast()) : i = s = e, i.lat >= t.lat && s.lat <= r.lat && i.lng >= t.lng && s.lng <= r.lng
        },
        intersects: function (e) {
            e = n.latLngBounds(e);
            var t = this._southWest,
                r = this._northEast,
                i = e.getSouthWest(),
                s = e.getNorthEast(),
                o = s.lat >= t.lat && i.lat <= r.lat,
                u = s.lng >= t.lng && i.lng <= r.lng;
            return o && u
        },
        toBBoxString: function () {
            var e = this._southWest,
                t = this._northEast;
            return [e.lng, e.lat, t.lng, t.lat].join(",")
        },
        equals: function (e) {
            return e ? (e = n.latLngBounds(e), this._southWest.equals(e.getSouthWest()) && this._northEast.equals(e.getNorthEast())) : !1
        }
    }), n.latLngBounds = function (e, t) {
        return !e || e instanceof n.LatLngBounds ? e : new n.LatLngBounds(e, t)
    }, n.Projection = {}, n.Projection.SphericalMercator = {
        MAX_LATITUDE: 85.0511287798,
        project: function (e) {
            var t = n.LatLng.DEG_TO_RAD,
                r = this.MAX_LATITUDE,
                i = Math.max(Math.min(r, e.lat), -r),
                s = e.lng * t,
                o = i * t;
            return o = Math.log(Math.tan(Math.PI / 4 + o / 2)), new n.Point(s, o)
        },
        unproject: function (e) {
            var t = n.LatLng.RAD_TO_DEG,
                r = e.x * t,
                i = (2 * Math.atan(Math.exp(e.y)) - Math.PI / 2) * t;
            return new n.LatLng(i, r, !0)
        }
    }, n.Projection.LonLat = {
        project: function (e) {
            return new n.Point(e.lng, e.lat)
        },
        unproject: function (e) {
            return new n.LatLng(e.y, e.x, !0)
        }
    }, n.CRS = {
        latLngToPoint: function (e, t) {
            var n = this.projection.project(e),
                r = this.scale(t);
            return this.transformation._transform(n, r)
        },
        pointToLatLng: function (e, t) {
            var n = this.scale(t),
                r = this.transformation.untransform(e, n);
            return this.projection.unproject(r)
        },
        project: function (e) {
            return this.projection.project(e)
        },
        scale: function (e) {
            return 256 * Math.pow(2, e)
        }
    }, n.CRS.EPSG3857 = n.Util.extend({}, n.CRS, {
        code: "EPSG:3857",
        projection: n.Projection.SphericalMercator,
        transformation: new n.Transformation(.5 / Math.PI, .5, -0.5 / Math.PI, .5),
        project: function (e) {
            var t = this.projection.project(e),
                n = 6378137;
            return t.multiplyBy(n)
        }
    }), n.CRS.EPSG900913 = n.Util.extend({}, n.CRS.EPSG3857, {
        code: "EPSG:900913"
    }), n.CRS.EPSG4326 = n.Util.extend({}, n.CRS, {
        code: "EPSG:4326",
        projection: n.Projection.LonLat,
        transformation: new n.Transformation(1 / 360, .5, -1 / 360, .5)
    }), n.Map = n.Class.extend({
        includes: n.Mixin.Events,
        options: {
            crs: n.CRS.EPSG3857,
            fadeAnimation: n.DomUtil.TRANSITION && !n.Browser.android23,
            trackResize: !0,
            markerZoomAnimation: n.DomUtil.TRANSITION && n.Browser.any3d
        },
        initialize: function (e, r) {
            r = n.Util.setOptions(this, r), this._initContainer(e), this._initLayout(), this._initHooks(), this._initEvents(), r.maxBounds && this.setMaxBounds(r.maxBounds), r.center && r.zoom !== t && this.setView(n.latLng(r.center), r.zoom, !0), this._initLayers(r.layers)
        },
        setView: function (e, t) {
            return this._resetView(n.latLng(e), this._limitZoom(t)), this
        },
        setZoom: function (e) {
            return this.setView(this.getCenter(), e)
        },
        zoomIn: function () {
            return this.setZoom(this._zoom + 1)
        },
        zoomOut: function () {
            return this.setZoom(this._zoom - 1)
        },
        fitBounds: function (e) {
            var t = this.getBoundsZoom(e);
            return this.setView(n.latLngBounds(e).getCenter(), t)
        },
        fitWorld: function () {
            var e = new n.LatLng(-60, -170),
                t = new n.LatLng(85, 179);
            return this.fitBounds(new n.LatLngBounds(e, t))
        },
        panTo: function (e) {
            return this.setView(e, this._zoom)
        },
        panBy: function (e) {
            return this.fire("movestart"), this._rawPanBy(n.point(e)), this.fire("move"), this.fire("moveend")
        },
        setMaxBounds: function (e) {
            e = n.latLngBounds(e), this.options.maxBounds = e;
            if (!e) return this._boundsMinZoom = null, this;
            var t = this.getBoundsZoom(e, !0);
            return this._boundsMinZoom = t, this._loaded && (this._zoom < t ? this.setView(e.getCenter(), t) : this.panInsideBounds(e)), this
        },
        panInsideBounds: function (e) {
            e = n.latLngBounds(e);
            var t = this.getBounds(),
                r = this.project(t.getSouthWest()),
                i = this.project(t.getNorthEast()),
                s = this.project(e.getSouthWest()),
                o = this.project(e.getNorthEast()),
                u = 0,
                a = 0;
            return i.y < o.y && (a = o.y - i.y), i.x > o.x && (u = o.x - i.x), r.y > s.y && (a = s.y - r.y), r.x < s.x && (u = s.x - r.x), this.panBy(new n.Point(u, a, !0))
        },
        addLayer: function (e) {
            var t = n.Util.stamp(e);
            if (this._layers[t]) return this;
            this._layers[t] = e, e.options && !isNaN(e.options.maxZoom) && (this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, e.options.maxZoom)), e.options && !isNaN(e.options.minZoom) && (this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, e.options.minZoom)), this.options.zoomAnimation && n.TileLayer && e instanceof n.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, e.on("load", this._onTileLayerLoad, this));
            var r = function () {
                e.onAdd(this), this.fire("layeradd", {
                    layer: e
                })
            };
            return this._loaded ? r.call(this) : this.on("load", r, this), this
        },
        removeLayer: function (e) {
            var t = n.Util.stamp(e);
            if (!this._layers[t]) return;
            return e.onRemove(this), delete this._layers[t], this.options.zoomAnimation && n.TileLayer && e instanceof n.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, e.off("load", this._onTileLayerLoad, this)), this.fire("layerremove", {
                layer: e
            })
        },
        hasLayer: function (e) {
            var t = n.Util.stamp(e);
            return this._layers.hasOwnProperty(t)
        },
        invalidateSize: function (e) {
            var t = this.getSize();
            this._sizeChanged = !0, this.options.maxBounds && this.setMaxBounds(this.options.maxBounds);
            if (!this._loaded) return this;
            var r = t.subtract(this.getSize()).divideBy(2, !0);
            return e === !0 ? this.panBy(r) : (this._rawPanBy(r), this.fire("move"), clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(n.Util.bind(this.fire, this, "moveend"), 200)), this
        },
        addHandler: function (e, t) {
            if (!t) return;
            return this[e] = new t(this), this.options[e] && this[e].enable(), this
        },
        getCenter: function () {
            return this.layerPointToLatLng(this._getCenterLayerPoint())
        },
        getZoom: function () {
            return this._zoom
        },
        getBounds: function () {
            var e = this.getPixelBounds(),
                t = this.unproject(e.getBottomLeft()),
                r = this.unproject(e.getTopRight());
            return new n.LatLngBounds(t, r)
        },
        getMinZoom: function () {
            var e = this.options.minZoom || 0,
                t = this._layersMinZoom || 0,
                n = this._boundsMinZoom || 0;
            return Math.max(e, t, n)
        },
        getMaxZoom: function () {
            var e = this.options.maxZoom === t ? Infinity : this.options.maxZoom,
                n = this._layersMaxZoom === t ? Infinity : this._layersMaxZoom;
            return Math.min(e, n)
        },
        getBoundsZoom: function (e, t) {
            e = n.latLngBounds(e);
            var r = this.getSize(),
                i = this.options.minZoom || 0,
                s = this.getMaxZoom(),
                o = e.getNorthEast(),
                u = e.getSouthWest(),
                a, f, l, c = !0;
            t && i--;
            do i++, f = this.project(o, i), l = this.project(u, i), a = new n.Point(Math.abs(f.x - l.x), Math.abs(l.y - f.y)), t ? c = a.x < r.x || a.y < r.y : c = a.x <= r.x && a.y <= r.y;
            while (c && i <= s);
            return c && t ? null : t ? i : i - 1
        },
        getSize: function () {
            if (!this._size || this._sizeChanged) this._size = new n.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1;
            return this._size
        },
        getPixelBounds: function () {
            var e = this._getTopLeftPoint();
            return new n.Bounds(e, e.add(this.getSize()))
        },
        getPixelOrigin: function () {
            return this._initialTopLeftPoint
        },
        getPanes: function () {
            return this._panes
        },
        getContainer: function () {
            return this._container
        },
        getZoomScale: function (e) {
            var t = this.options.crs;
            return t.scale(e) / t.scale(this._zoom)
        },
        getScaleZoom: function (e) {
            return this._zoom + Math.log(e) / Math.LN2
        },
        project: function (e, r) {
            return r = r === t ? this._zoom : r, this.options.crs.latLngToPoint(n.latLng(e), r)
        },
        unproject: function (e, r) {
            return r = r === t ? this._zoom : r, this.options.crs.pointToLatLng(n.point(e), r)
        },
        layerPointToLatLng: function (e) {
            var t = n.point(e).add(this._initialTopLeftPoint);
            return this.unproject(t)
        },
        latLngToLayerPoint: function (e) {
            var t = this.project(n.latLng(e))._round();
            return t._subtract(this._initialTopLeftPoint)
        },
        containerPointToLayerPoint: function (e) {
            return n.point(e).subtract(this._getMapPanePos())
        },
        layerPointToContainerPoint: function (e) {
            return n.point(e).add(this._getMapPanePos())
        },
        containerPointToLatLng: function (e) {
            var t = this.containerPointToLayerPoint(n.point(e));
            return this.layerPointToLatLng(t)
        },
        latLngToContainerPoint: function (e) {
            return this.layerPointToContainerPoint(this.latLngToLayerPoint(n.latLng(e)))
        },
        mouseEventToContainerPoint: function (e) {
            return n.DomEvent.getMousePosition(e, this._container)
        },
        mouseEventToLayerPoint: function (e) {
            return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e))
        },
        mouseEventToLatLng: function (e) {
            return this.layerPointToLatLng(this.mouseEventToLayerPoint(e))
        },
        _initContainer: function (e) {
            var t = this._container = n.DomUtil.get(e);
            if (t._leaflet) throw Error("Map container is already initialized.");
            t._leaflet = !0
        },
        _initLayout: function () {
            var e = this._container;
            e.innerHTML = "", n.DomUtil.addClass(e, "leaflet-container"), n.Browser.touch && n.DomUtil.addClass(e, "leaflet-touch"), this.options.fadeAnimation && n.DomUtil.addClass(e, "leaflet-fade-anim");
            var t = n.DomUtil.getStyle(e, "position");
            t !== "absolute" && t !== "relative" && t !== "fixed" && (e.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos()
        },
        _initPanes: function () {
            var e = this._panes = {};
            this._mapPane = e.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = e.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), this._objectsPane = e.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), e.shadowPane = this._createPane("leaflet-shadow-pane"), e.overlayPane = this._createPane("leaflet-overlay-pane"), e.markerPane = this._createPane("leaflet-marker-pane"), e.popupPane = this._createPane("leaflet-popup-pane");
            var t = " leaflet-zoom-hide";
            this.options.markerZoomAnimation || (n.DomUtil.addClass(e.markerPane, t), n.DomUtil.addClass(e.shadowPane, t), n.DomUtil.addClass(e.popupPane, t))
        },
        _createPane: function (e, t) {
            return n.DomUtil.create("div", e, t || this._objectsPane)
        },
        _initializers: [],
        _initHooks: function () {
            var e, t;
            for (e = 0, t = this._initializers.length; e < t; e++) this._initializers[e].call(this)
        },
        _initLayers: function (e) {
            e = e ? e instanceof Array ? e : [e] : [], this._layers = {}, this._tileLayersNum = 0;
            var t, n;
            for (t = 0, n = e.length; t < n; t++) this.addLayer(e[t])
        },
        _resetView: function (e, t, r, i) {
            var s = this._zoom !== t;
            i || (this.fire("movestart"), s && this.fire("zoomstart")), this._zoom = t, this._initialTopLeftPoint = this._getNewTopLeftPoint(e), r ? this._initialTopLeftPoint._add(this._getMapPanePos()) : n.DomUtil.setPosition(this._mapPane, new n.Point(0, 0)), this._tileLayersToLoad = this._tileLayersNum, this.fire("viewreset", {
                hard: !r
            }), this.fire("move"), (s || i) && this.fire("zoomend"), this.fire("moveend", {
                hard: !r
            }), this._loaded || (this._loaded = !0, this.fire("load"))
        },
        _rawPanBy: function (e) {
            n.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(e))
        },
        _initEvents: function () {
            if (!n.DomEvent) return;
            n.DomEvent.on(this._container, "click", this._onMouseClick, this);
            var t = ["dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu"],
                r, i;
            for (r = 0, i = t.length; r < i; r++) n.DomEvent.on(this._container, t[r], this._fireMouseEvent, this);
            this.options.trackResize && n.DomEvent.on(e, "resize", this._onResize, this)
        },
        _onResize: function () {
            n.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = n.Util.requestAnimFrame(this.invalidateSize, this, !1, this._container)
        },
        _onMouseClick: function (e) {
            if (!this._loaded || this.dragging && this.dragging.moved()) return;
            this.fire("preclick"), this._fireMouseEvent(e)
        },
        _fireMouseEvent: function (e) {
            if (!this._loaded) return;
            var t = e.type;
            t = t === "mouseenter" ? "mouseover" : t === "mouseleave" ? "mouseout" : t;
            if (!this.hasEventListeners(t)) return;
            t === "contextmenu" && n.DomEvent.preventDefault(e);
            var r = this.mouseEventToContainerPoint(e),
                i = this.containerPointToLayerPoint(r),
                s = this.layerPointToLatLng(i);
            this.fire(t, {
                latlng: s,
                layerPoint: i,
                containerPoint: r,
                originalEvent: e
            })
        },
        _onTileLayerLoad: function () {
            this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this._tileBg && (clearTimeout(this._clearTileBgTimer), this._clearTileBgTimer = setTimeout(n.Util.bind(this._clearTileBg, this), 500))
        },
        _getMapPanePos: function () {
            return n.DomUtil.getPosition(this._mapPane)
        },
        _getTopLeftPoint: function () {
            if (!this._loaded) throw Error("Set map center and zoom first.");
            return this._initialTopLeftPoint.subtract(this._getMapPanePos())
        },
        _getNewTopLeftPoint: function (e, t) {
            var n = this.getSize().divideBy(2);
            return this.project(e, t)._subtract(n)._round()
        },
        _latLngToNewLayerPoint: function (e, t, n) {
            var r = this._getNewTopLeftPoint(n, t).add(this._getMapPanePos());
            return this.project(e, t)._subtract(r)
        },
        _getCenterLayerPoint: function () {
            return this.containerPointToLayerPoint(this.getSize().divideBy(2))
        },
        _getCenterOffset: function (e) {
            return this.latLngToLayerPoint(e).subtract(this._getCenterLayerPoint())
        },
        _limitZoom: function (e) {
            var t = this.getMinZoom(),
                n = this.getMaxZoom();
            return Math.max(t, Math.min(n, e))
        }
    }), n.Map.addInitHook = function (e) {
        var t = Array.prototype.slice.call(arguments, 1),
            n = typeof e == "function" ? e : function () {
                this[e].apply(this, t)
            };
        this.prototype._initializers.push(n)
    }, n.map = function (e, t) {
        return new n.Map(e, t)
    }, n.Projection.Mercator = {
        MAX_LATITUDE: 85.0840591556,
        R_MINOR: 6356752.3142,
        R_MAJOR: 6378137,
        project: function (e) {
            var t = n.LatLng.DEG_TO_RAD,
                r = this.MAX_LATITUDE,
                i = Math.max(Math.min(r, e.lat), -r),
                s = this.R_MAJOR,
                o = this.R_MINOR,
                u = e.lng * t * s,
                a = i * t,
                f = o / s,
                l = Math.sqrt(1 - f * f),
                c = l * Math.sin(a);
            c = Math.pow((1 - c) / (1 + c), l * .5);
            var h = Math.tan(.5 * (Math.PI * .5 - a)) / c;
            return a = -o * Math.log(h), new n.Point(u, a)
        },
        unproject: function (e) {
            var t = n.LatLng.RAD_TO_DEG,
                r = this.R_MAJOR,
                i = this.R_MINOR,
                s = e.x * t / r,
                o = i / r,
                u = Math.sqrt(1 - o * o),
                a = Math.exp(-e.y / i),
                f = Math.PI / 2 - 2 * Math.atan(a),
                l = 15,
                c = 1e-7,
                h = l,
                p = .1,
                d;
            while (Math.abs(p) > c && --h > 0) d = u * Math.sin(f), p = Math.PI / 2 - 2 * Math.atan(a * Math.pow((1 - d) / (1 + d), .5 * u)) - f, f += p;
            return new n.LatLng(f * t, s, !0)
        }
    }, n.CRS.EPSG3395 = n.Util.extend({}, n.CRS, {
        code: "EPSG:3395",
        projection: n.Projection.Mercator,
        transformation: function () {
            var e = n.Projection.Mercator,
                t = e.R_MAJOR,
                r = e.R_MINOR;
            return new n.Transformation(.5 / (Math.PI * t), .5, -0.5 / (Math.PI * r), .5)
        }()
    }), n.TileLayer = n.Class.extend({
        includes: n.Mixin.Events,
        options: {
            minZoom: 0,
            maxZoom: 18,
            tileSize: 256,
            subdomains: "abc",
            errorTileUrl: "",
            attribution: "",
            zoomOffset: 0,
            opacity: 1,
            unloadInvisibleTiles: n.Browser.mobile,
            updateWhenIdle: n.Browser.mobile
        },
        initialize: function (e, t) {
            t = n.Util.setOptions(this, t), t.detectRetina && n.Browser.retina && t.maxZoom > 0 && (t.tileSize = Math.floor(t.tileSize / 2), t.zoomOffset++, t.minZoom > 0 && t.minZoom--, this.options.maxZoom--), this._url = e;
            var r = this.options.subdomains;
            typeof r == "string" && (this.options.subdomains = r.split(""))
        },
        onAdd: function (e) {
            this._map = e, this._initContainer(), this._createTileProto(), e.on({
                viewreset: this._resetCallback,
                moveend: this._update
            }, this), this.options.updateWhenIdle || (this._limitedUpdate = n.Util.limitExecByInterval(this._update, 150, this), e.on("move", this._limitedUpdate, this)), this._reset(), this._update()
        },
        addTo: function (e) {
            return e.addLayer(this), this
        },
        onRemove: function (e) {
            e._panes.tilePane.removeChild(this._container), e.off({
                viewreset: this._resetCallback,
                moveend: this._update
            }, this), this.options.updateWhenIdle || e.off("move", this._limitedUpdate, this), this._container = null, this._map = null
        },
        bringToFront: function () {
            var e = this._map._panes.tilePane;
            return this._container && (e.appendChild(this._container), this._setAutoZIndex(e, Math.max)), this
        },
        bringToBack: function () {
            var e = this._map._panes.tilePane;
            return this._container && (e.insertBefore(this._container, e.firstChild), this._setAutoZIndex(e, Math.min)), this
        },
        getAttribution: function () {
            return this.options.attribution
        },
        setOpacity: function (e) {
            return this.options.opacity = e, this._map && this._updateOpacity(), this
        },
        setZIndex: function (e) {
            return this.options.zIndex = e, this._updateZIndex(), this
        },
        setUrl: function (e, t) {
            return this._url = e, t || this.redraw(), this
        },
        redraw: function () {
            return this._map && (this._map._panes.tilePane.empty = !1, this._reset(!0), this._update()), this
        },
        _updateZIndex: function () {
            this._container && this.options.zIndex !== t && (this._container.style.zIndex = this.options.zIndex)
        },
        _setAutoZIndex: function (e, t) {
            var n = e.getElementsByClassName("leaflet-layer"),
                r = -t(Infinity, -Infinity),
                i;
            for (var s = 0, o = n.length; s < o; s++) n[s] !== this._container && (i = parseInt(n[s].style.zIndex, 10), isNaN(i) || (r = t(r, i)));
            this._container.style.zIndex = isFinite(r) ? r + t(1, -1) : ""
        },
        _updateOpacity: function () {
            n.DomUtil.setOpacity(this._container, this.options.opacity);
            var e, t = this._tiles;
            if (n.Browser.webkit) for (e in t) t.hasOwnProperty(e) && (t[e].style.webkitTransform += " translate(0,0)")
        },
        _initContainer: function () {
            var e = this._map._panes.tilePane;
            if (!this._container || e.empty) this._container = n.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), e.appendChild(this._container), this.options.opacity < 1 && this._updateOpacity()
        },
        _resetCallback: function (e) {
            this._reset(e.hard)
        },
        _reset: function (e) {
            var t, n = this._tiles;
            for (t in n) n.hasOwnProperty(t) && this.fire("tileunload", {
                tile: n[t]
            });
            this._tiles = {}, this._tilesToLoad = 0, this.options.reuseTiles && (this._unusedTiles = []), e && this._container && (this._container.innerHTML = ""), this._initContainer()
        },
        _update: function (e) {
            if (this._map._panTransition && this._map._panTransition._inProgress) return;
            var t = this._map.getPixelBounds(),
                r = this._map.getZoom(),
                i = this.options.tileSize;
            if (r > this.options.maxZoom || r < this.options.minZoom) return;
            var s = new n.Point(Math.floor(t.min.x / i), Math.floor(t.min.y / i)),
                o = new n.Point(Math.floor(t.max.x / i), Math.floor(t.max.y / i)),
                u = new n.Bounds(s, o);
            this._addTilesFromCenterOut(u), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(u)
        },
        _addTilesFromCenterOut: function (e) {
            var t = [],
                r = e.getCenter(),
                i, s, o;
            for (i = e.min.y; i <= e.max.y; i++) for (s = e.min.x; s <= e.max.x; s++) o = new n.Point(s, i), this._tileShouldBeLoaded(o) && t.push(o);
            var u = t.length;
            if (u === 0) return;
            t.sort(function (e, t) {
                return e.distanceTo(r) - t.distanceTo(r)
            });
            var a = document.createDocumentFragment();
            this._tilesToLoad || this.fire("loading"), this._tilesToLoad += u;
            for (s = 0; s < u; s++) this._addTile(t[s], a);
            this._container.appendChild(a)
        },
        _tileShouldBeLoaded: function (e) {
            if (e.x + ":" + e.y in this._tiles) return !1;
            if (!this.options.continuousWorld) {
                var t = this._getWrapTileNum();
                if (this.options.noWrap && (e.x < 0 || e.x >= t) || e.y < 0 || e.y >= t) return !1
            }
            return !0
        },
        _removeOtherTiles: function (e) {
            var t, n, r, i;
            for (i in this._tiles) this._tiles.hasOwnProperty(i) && (t = i.split(":"), n = parseInt(t[0], 10), r = parseInt(t[1], 10), (n < e.min.x || n > e.max.x || r < e.min.y || r > e.max.y) && this._removeTile(i))
        },
        _removeTile: function (e) {
            var t = this._tiles[e];
            this.fire("tileunload", {
                tile: t,
                url: t.src
            }), this.options.reuseTiles ? (n.DomUtil.removeClass(t, "leaflet-tile-loaded"), this._unusedTiles.push(t)) : t.parentNode === this._container && this._container.removeChild(t), n.Browser.android || (t.src = n.Util.emptyImageUrl), delete this._tiles[e]
        },
        _addTile: function (e, t) {
            var r = this._getTilePos(e),
                i = this._getTile();
            n.DomUtil.setPosition(i, r, n.Browser.chrome || n.Browser.android23), this._tiles[e.x + ":" + e.y] = i, this._loadTile(i, e), i.parentNode !== this._container && t.appendChild(i)
        },
        _getZoomForUrl: function () {
            var e = this.options,
                t = this._map.getZoom();
            return e.zoomReverse && (t = e.maxZoom - t), t + e.zoomOffset
        },
        _getTilePos: function (e) {
            var t = this._map.getPixelOrigin(),
                n = this.options.tileSize;
            return e.multiplyBy(n).subtract(t)
        },
        getTileUrl: function (e) {
            return this._adjustTilePoint(e), n.Util.template(this._url, n.Util.extend({
                s: this._getSubdomain(e),
                z: this._getZoomForUrl(),
                x: e.x,
                y: e.y
            }, this.options))
        },
        _getWrapTileNum: function () {
            return Math.pow(2, this._getZoomForUrl())
        },
        _adjustTilePoint: function (e) {
            var t = this._getWrapTileNum();
            !this.options.continuousWorld && !this.options.noWrap && (e.x = (e.x % t + t) % t), this.options.tms && (e.y = t - e.y - 1)
        },
        _getSubdomain: function (e) {
            var t = (e.x + e.y) % this.options.subdomains.length;
            return this.options.subdomains[t]
        },
        _createTileProto: function () {
            var e = this._tileImg = n.DomUtil.create("img", "leaflet-tile");
            e.galleryimg = "no";
            var t = this.options.tileSize;
            e.style.width = t + "px", e.style.height = t + "px"
        },
        _getTile: function () {
            if (this.options.reuseTiles && this._unusedTiles.length > 0) {
                var e = this._unusedTiles.pop();
                return this._resetTile(e), e
            }
            return this._createTile()
        },
        _resetTile: function (e) {},
        _createTile: function () {
            var e = this._tileImg.cloneNode(!1);
            return e.onselectstart = e.onmousemove = n.Util.falseFn, e
        },
        _loadTile: function (e, t) {
            e._layer = this, e.onload = this._tileOnLoad, e.onerror = this._tileOnError, e.src = this.getTileUrl(t)
        },
        _tileLoaded: function () {
            this._tilesToLoad--, this._tilesToLoad || this.fire("load")
        },
        _tileOnLoad: function (e) {
            var t = this._layer;
            this.src !== n.Util.emptyImageUrl && (n.DomUtil.addClass(this, "leaflet-tile-loaded"), t.fire("tileload", {
                tile: this,
                url: this.src
            })), t._tileLoaded()
        },
        _tileOnError: function (e) {
            var t = this._layer;
            t.fire("tileerror", {
                tile: this,
                url: this.src
            });
            var n = t.options.errorTileUrl;
            n && (this.src = n), t._tileLoaded()
        }
    }), n.tileLayer = function (e, t) {
        return new n.TileLayer(e, t)
    }, n.TileLayer.WMS = n.TileLayer.extend({
        defaultWmsParams: {
            service: "WMS",
            request: "GetMap",
            version: "1.1.1",
            layers: "",
            styles: "",
            format: "image/jpeg",
            transparent: !1
        },
        initialize: function (e, t) {
            this._url = e;
            var r = n.Util.extend({}, this.defaultWmsParams);
            t.detectRetina && n.Browser.retina ? r.width = r.height = this.options.tileSize * 2 : r.width = r.height = this.options.tileSize;
            for (var i in t) this.options.hasOwnProperty(i) || (r[i] = t[i]);
            this.wmsParams = r, n.Util.setOptions(this, t)
        },
        onAdd: function (e) {
            var t = parseFloat(this.wmsParams.version) >= 1.3 ? "crs" : "srs";
            this.wmsParams[t] = e.options.crs.code, n.TileLayer.prototype.onAdd.call(this, e)
        },
        getTileUrl: function (e, t) {
            var r = this._map,
                i = r.options.crs,
                s = this.options.tileSize,
                o = e.multiplyBy(s),
                u = o.add(new n.Point(s, s)),
                a = i.project(r.unproject(o, t)),
                f = i.project(r.unproject(u, t)),
                l = [a.x, f.y, f.x, a.y].join(","),
                c = n.Util.template(this._url, {
                    s: this._getSubdomain(e)
                });
            return c + n.Util.getParamString(this.wmsParams) + "&bbox=" + l
        },
        setParams: function (e, t) {
            return n.Util.extend(this.wmsParams, e), t || this.redraw(), this
        }
    }), n.tileLayer.wms = function (e, t) {
        return new n.TileLayer.WMS(e, t)
    }, n.TileLayer.Canvas = n.TileLayer.extend({
        options: {
            async: !1
        },
        initialize: function (e) {
            n.Util.setOptions(this, e)
        },
        redraw: function () {
            var e, t = this._tiles;
            for (e in t) t.hasOwnProperty(e) && this._redrawTile(t[e])
        },
        _redrawTile: function (e) {
            this.drawTile(e, e._tilePoint, e._zoom)
        },
        _createTileProto: function () {
            var e = this._canvasProto = n.DomUtil.create("canvas", "leaflet-tile"),
                t = this.options.tileSize;
            e.width = t, e.height = t
        },
        _createTile: function () {
            var e = this._canvasProto.cloneNode(!1);
            return e.onselectstart = e.onmousemove = n.Util.falseFn, e
        },
        _loadTile: function (e, t, n) {
            e._layer = this, e._tilePoint = t, e._zoom = n, this.drawTile(e, t, n), this.options.async || this.tileDrawn(e)
        },
        drawTile: function (e, t, n) {},
        tileDrawn: function (e) {
            this._tileOnLoad.call(e)
        }
    }), n.tileLayer.canvas = function (e) {
        return new n.TileLayer.Canvas(e)
    }, n.ImageOverlay = n.Class.extend({
        includes: n.Mixin.Events,
        options: {
            opacity: 1
        },
        initialize: function (e, t, r) {
            this._url = e, this._bounds = n.latLngBounds(t), n.Util.setOptions(this, r)
        },
        onAdd: function (e) {
            this._map = e, this._image || this._initImage(), e._panes.overlayPane.appendChild(this._image), e.on("viewreset", this._reset, this), e.options.zoomAnimation && n.Browser.any3d && e.on("zoomanim", this._animateZoom, this), this._reset()
        },
        onRemove: function (e) {
            e.getPanes().overlayPane.removeChild(this._image), e.off("viewreset", this._reset, this), e.options.zoomAnimation && e.off("zoomanim", this._animateZoom, this)
        },
        addTo: function (e) {
            return e.addLayer(this), this
        },
        setOpacity: function (e) {
            return this.options.opacity = e, this._updateOpacity(), this
        },
        bringToFront: function () {
            return this._image && this._map._panes.overlayPane.appendChild(this._image), this
        },
        bringToBack: function () {
            var e = this._map._panes.overlayPane;
            return this._image && e.insertBefore(this._image, e.firstChild), this
        },
        _initImage: function () {
            this._image = n.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && n.Browser.any3d ? n.DomUtil.addClass(this._image, "leaflet-zoom-animated") : n.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), n.Util.extend(this._image, {
                galleryimg: "no",
                onselectstart: n.Util.falseFn,
                onmousemove: n.Util.falseFn,
                onload: n.Util.bind(this._onImageLoad, this),
                src: this._url
            })
        },
        _animateZoom: function (e) {
            var t = this._map,
                r = this._image,
                i = t.getZoomScale(e.zoom),
                s = this._bounds.getNorthWest(),
                o = this._bounds.getSouthEast(),
                u = t._latLngToNewLayerPoint(s, e.zoom, e.center),
                a = t._latLngToNewLayerPoint(o, e.zoom, e.center).subtract(u),
                f = t.latLngToLayerPoint(o).subtract(t.latLngToLayerPoint(s)),
                l = u.add(a.subtract(f).divideBy(2));
            r.style[n.DomUtil.TRANSFORM] = n.DomUtil.getTranslateString(l) + " scale(" + i + ") "
        },
        _reset: function () {
            var e = this._image,
                t = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
                r = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(t);
            n.DomUtil.setPosition(e, t), e.style.width = r.x + "px", e.style.height = r.y + "px"
        },
        _onImageLoad: function () {
            this.fire("load")
        },
        _updateOpacity: function () {
            n.DomUtil.setOpacity(this._image, this.options.opacity)
        }
    }), n.imageOverlay = function (e, t, r) {
        return new n.ImageOverlay(e, t, r)
    }, n.Icon = n.Class.extend({
        options: {
            className: ""
        },
        initialize: function (e) {
            n.Util.setOptions(this, e)
        },
        createIcon: function () {
            return this._createIcon("icon")
        },
        createShadow: function () {
            return this._createIcon("shadow")
        },
        _createIcon: function (e) {
            var t = this._getIconUrl(e);
            if (!t) {
                if (e === "icon") throw Error("iconUrl not set in Icon options (see the docs).");
                return null
            }
            var n = this._createImg(t);
            return this._setIconStyles(n, e), n
        },
        _setIconStyles: function (e, t) {
            var r = this.options,
                i = n.point(r[t + "Size"]),
                s;
            t === "shadow" ? s = n.point(r.shadowAnchor || r.iconAnchor) : s = n.point(r.iconAnchor), !s && i && (s = i.divideBy(2, !0)), e.className = "leaflet-marker-" + t + " " + r.className, s && (e.style.marginLeft = -s.x + "px", e.style.marginTop = -s.y + "px"), i && (e.style.width = i.x + "px", e.style.height = i.y + "px")
        },
        _createImg: function (e) {
            var t;
            return n.Browser.ie6 ? (t = document.createElement("div"), t.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + e + '")') : (t = document.createElement("img"), t.src = e), t
        },
        _getIconUrl: function (e) {
            return this.options[e + "Url"]
        }
    }), n.icon = function (e) {
        return new n.Icon(e)
    }, n.Icon.Default = n.Icon.extend({
        options: {
            iconSize: new n.Point(25, 41),
            iconAnchor: new n.Point(13, 41),
            popupAnchor: new n.Point(1, -34),
            shadowSize: new n.Point(41, 41)
        },
        _getIconUrl: function (e) {
            var t = e + "Url";
            if (this.options[t]) return this.options[t];
            var r = n.Icon.Default.imagePath;
            if (!r) throw Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
            return r + "/marker-" + e + ".png"
        }
    }), n.Icon.Default.imagePath = function () {
        var e = document.getElementsByTagName("script"),
            t = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/,
            n, r, i, s;
        for (n = 0, r = e.length; n < r; n++) {
            i = e[n].src, s = i.match(t);
            if (s) return i.split(t)[0] + "/images"
        }
    }(), n.Marker = n.Class.extend({
        includes: n.Mixin.Events,
        options: {
            icon: new n.Icon.Default,
            title: "",
            clickable: !0,
            draggable: !1,
            zIndexOffset: 0,
            opacity: 1
        },
        initialize: function (e, t) {
            n.Util.setOptions(this, t), this._latlng = n.latLng(e)
        },
        onAdd: function (e) {
            this._map = e, e.on("viewreset", this.update, this), this._initIcon(), this.update(), e.options.zoomAnimation && e.options.markerZoomAnimation && e.on("zoomanim", this._animateZoom, this)
        },
        addTo: function (e) {
            return e.addLayer(this), this
        },
        onRemove: function (e) {
            this._removeIcon(), this.closePopup && this.closePopup(), e.off({
                viewreset: this.update,
                zoomanim: this._animateZoom
            }, this), this._map = null
        },
        getLatLng: function () {
            return this._latlng
        },
        setLatLng: function (e) {
            this._latlng = n.latLng(e), this.update(), this._popup && this._popup.setLatLng(e)
        },
        setZIndexOffset: function (e) {
            this.options.zIndexOffset = e, this.update()
        },
        setIcon: function (e) {
            this._map && this._removeIcon(), this.options.icon = e, this._map && (this._initIcon(), this.update())
        },
        update: function () {
            if (!this._icon) return;
            var e = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(e)
        },
        _initIcon: function () {
            var e = this.options,
                t = this._map,
                r = t.options.zoomAnimation && t.options.markerZoomAnimation,
                i = r ? "leaflet-zoom-animated" : "leaflet-zoom-hide",
                s = !1;
            this._icon || (this._icon = e.icon.createIcon(), e.title && (this._icon.title = e.title), this._initInteraction(), s = this.options.opacity < 1, n.DomUtil.addClass(this._icon, i)), this._shadow || (this._shadow = e.icon.createShadow(), this._shadow && (n.DomUtil.addClass(this._shadow, i), s = this.options.opacity < 1)), s && this._updateOpacity();
            var o = this._map._panes;
            o.markerPane.appendChild(this._icon), this._shadow && o.shadowPane.appendChild(this._shadow)
        },
        _removeIcon: function () {
            var e = this._map._panes;
            e.markerPane.removeChild(this._icon), this._shadow && e.shadowPane.removeChild(this._shadow), this._icon = this._shadow = null
        },
        _setPos: function (e) {
            n.DomUtil.setPosition(this._icon, e), this._shadow && n.DomUtil.setPosition(this._shadow, e), this._icon.style.zIndex = e.y + this.options.zIndexOffset
        },
        _animateZoom: function (e) {
            var t = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
            this._setPos(t)
        },
        _initInteraction: function () {
            if (!this.options.clickable) return;
            var e = this._icon,
                t = ["dblclick", "mousedown", "mouseover", "mouseout"];
            n.DomUtil.addClass(e, "leaflet-clickable"), n.DomEvent.on(e, "click", this._onMouseClick, this);
            for (var r = 0; r < t.length; r++) n.DomEvent.on(e, t[r], this._fireMouseEvent, this);
            n.Handler.MarkerDrag && (this.dragging = new n.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable())
        },
        _onMouseClick: function (e) {
            n.DomEvent.stopPropagation(e);
            if (this.dragging && this.dragging.moved()) return;
            if (this._map.dragging && this._map.dragging.moved()) return;
            this.fire(e.type, {
                originalEvent: e
            })
        },
        _fireMouseEvent: function (e) {
            this.fire(e.type, {
                originalEven