/**
 * Created by lzq on 2017/7/12.
 *  这是一个自创轻量级js库
 */

(function () {

    var _zquery = zquery;
    var _$ = $;

    function $(ZARG) {
        return new zquery(ZARG);
    }

    /**
     *事件绑定
     * @param obj 监听对象
     * @param events 事件对象
     * @param fn  cb
     */
    function binEvent(obj, events, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(events, function (ev) {
                if (fn() === false) {
                    ev.preventDefault();
                    ev.cancelBubble = true;
                }
            }, false);
        } else {  //ie8
            obj.attachEvent('on' + events, function () {
                if (fn() === false) {
                    window.event.cancelBubble = true;
                    return false;
                }
            }, false);
        }
    }

    function getByClass(oParent, sClass) {
        var arr = [];
        var elems = oParent.getElementsByTagName('*');
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].className === sClass) {
                arr.push(elems[i]);
            }
        }

        return arr;
    }

    function getStyle(obj, attr) {
        if (obj.currentStyle) { //ie
            return obj.currentStyle[attr]
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    }

    function toArray(elems) {
        var arr = [];
        for (var i = 0; i < elems.length; i++) {
            arr.push(elems[i]);
        }

        return arr;

    }


    /**
     * zquery
     */
    function zquery(zARG) {

        this.elements = [];

        switch (typeof zARG) {
            case 'function':
                binEvent(window, 'load', zARG);
                break;
            case 'string':
                switch (zARG.charAt(0)) {
                    case'#':
                        this.elements.push(document.getElementById(zARG.substring(1)));
                        break;
                    case'.':
                        this.elements = getByClass(document, zARG.substring(1));
                        break;
                    default:
                        this.elements = toArray(document.getElementsByTagName(zARG));
                        break;
                }
                break;
            case 'object':
                if (zARG.constructor === Array) {
                    this.elements = zARG;
                } else {
                    this.elements.push(zARG);
                }
                break;

        }
    }

    zquery.prototype.html = function (str) {
        if (str) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].innerHTML = str;
            }
        } else {
            return this.elements[0].innerHTML;
        }
        return this;
    };
    zquery.prototype.click = function (fn) {
        for (var i = 0; i < this.elements.length; i++) {
            binEvent(this.elements[i], 'click', fn);
        }
        return this;
    };
    zquery.prototype.mouseover = function (fn) {
        this.on('mouseover', fn);
        return this;

    };
    zquery.prototype.mouseout = function (fn) {
        this.on('mouseout', fn);
        return this;

    };
    zquery.prototype.hover = function (fnOver, fnOut) {
        this.on('mouseover', fnOver);
        this.on('mouseout', fnOut);
        return this;
    };
    zquery.prototype.hide = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = 'none';
        }
        return this;
    };
    zquery.prototype.show = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = '';
        }
        return this;
    };
    zquery.prototype.css = function (attr, value) {
        if (arguments.length === 2) {//设置
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style[attr] = value;
            }
        } else if (arguments.length === 1) {//获取
            if (typeof attr === 'object') {
                for (var j in attr) {
                    for (var i = 0; i < this.elements.length; i++) {
                        this.elements[i].style[j] = attr[j];
                    }

                }
            } else {
                return getStyle(this.elements[0], attr);
            }

        }
        return this;

    };
    zquery.prototype.scrollTop = function (num, cb1, bc2) {
        if (arguments.length > 2) {
            window.onscroll = function () {
                var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrolltop > num) {
                    cb1();
                } else {
                    bc2();
                }
            };
        } else if (arguments.length === 0) {
            return document.documentElement.scrollTop || document.body.scrollTop;
        }
    };
    zquery.prototype.attr = function (attr, value) {
        if (arguments.length === 2) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(attr, value);
            }
        } else if (arguments.length === 1) {
            return this.elements[0].getAttribute(attr);

        }
        return this;
    };
    zquery.prototype.eq = function (num) {
        return $(this.elements[num]);
    };
    zquery.prototype.index = function () {
        var elems = this.elements[0].parentNode.children;
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] === this.elements[0]) {
                return i;
            }

        }
    };
    zquery.prototype.len = function () {
        var elems = this.elements[0].parentNode.children;
        return elems.length
    };
    zquery.prototype.find = function (sel) {
        var arr = [];
        if (sel.charAt(0) === '.') {//class
            for (var i = 0; i < this.elements.length; i++) {
                arr = arr.concat(getByClass(this.elements[i], sel.substring(1)));
            }

        } else if (sel.charAt(0) === '#') {
            console.info('find() id不弄了直接获取就好了,性能更优化');
        } else {//tag
            for (var i = 0; i < this.elements.length; i++) {
                arr = arr.concat(toArray(this.elements[i].getElementsByTagName(sel)));
            }
        }

        return $(arr);
    };

    /**
     *
     * animate  动画
     * @param obj zquery对象 $()
     * @param attrJson  json写法{}
     * @param fn cb
     * @param num  速度
     */
    zquery.prototype.animate = function (attrJson, cb, num) {
        var that = this;


        for (var i = 0; i < that.elements.length; i++) {
            clearInterval(that.elements[i].timer);
            (function (i) {
                that.elements[i].timer = setInterval(function () {
                    var flag = true;//回调开关
                    var attr = '';
                    for (attr in attrJson) {
                        var current = '';

                        if (attr === 'opacity') {
                            // ie不支持默认名返回0
                            current = Math.round(parseInt(getByClass(that.elements[i].attr) * 100)) || 0;
                        } else {
                            current = parseInt(getStyle(that.elements[i], attr));
                        }

                        //步长
                        var step = (attrJson[attr] - current) / 10;
                        step = step > 0 ? Math.ceil(step) : Math.floor(step);

                        if (attr === 'opacity') {
                            if ('opacity' in that.elements[i].style) {//如果游览器支持
                                that.elements[i].style.opacity = (current + step) / 100;
                            } else {//ie8
                                that.elements[i].style.filter = "alpha(opacity = " + (current + step) * 10 + ")";
                            }
                        } else if (attr === 'zIndex') {
                            that.elements[i].style.zIndex = current + step;

                        } else {
                            console.log();
                            that.elements[i].style[attr] = (current + step) + 'px';

                        }

                        if (current !== attrJson[attr]) {//对比两值，看是否到终点了
                            flag = false;
                        }

                        if (flag) {
                            clearInterval(this.timer);
                            if (cb) {
                                cb();
                            }
                            clearInterval(that.elements[i].timer);
                        }

                    }
                }, num);

            })(i);

        }


        return that;

    };


    /**
     *
     * @param events  自定义绑定事件
     * @param fn cb
     * @returns {zquery}
     */
    zquery.prototype.on = function (events, fn) {
        for (var i = 0; i < this.elements.length; i++) {
            binEvent(this.elements[i], events, fn);
        }
        return this;
    };

    /**
     *zquery的实例方法
     */
    $.fn = {};
    $.fn.extend = function (json) {
        for (var attr in json) {
            zquery.prototype[attr] = json[attr];
        }
    };


    /**
     * zquery的工具法
     * 无需实例化就能调用函数
     */
    $.extend = function (json) {
        for (var attr in json) {
            $[attr] = json[attr];
        }
    };

    /**
     * 获取ulr传参
     * @param name  对象传参名字？sb=123
     * @returns {null}
     */
    $.getPar = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2])
        } else {
            return null;
        }

    };

    /**
     * 去掉字符串首尾空格
     * @param str
     * @returns {XML|string|void}
     */
    $.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };


    /**
     * 阿贾克斯
     * @param obj  json对象 {}
     * @returns {boolean}
     */
    $.ajax = function ajax(obj) {
        var xmlhttp, type, url, async, dataType, data;
        if (typeof(obj) != 'object')  return false;

        type = obj.type == undefined ? 'POST' : obj.type.toUpperCase();
        url = obj.url == undefined ? window.location.href : obj.url;
        async = obj.async == undefined ? true : obj.type;
        dataType = obj.dataType == undefined ? 'HTML' : obj.dataType.toUpperCase();
        data = obj.data == undefined ? {} : obj.data;


        var formatParams = function () {
            if (typeof(data) == "object") {
                var str = "";
                for (var pro in data) {
                    str += pro + "=" + data[pro] + "&";
                }
                data = str.substr(0, str.length - 1);
            }
            if (type == 'GET' || dataType == 'JSONP') {
                if (url.lastIndexOf('?') == -1) {
                    url += '?' + data;
                } else {
                    url += '&' + data;
                }
            }
        };
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }


        if (dataType == 'JSONP') {
            if (typeof(obj.beforeSend) == 'function') obj.beforeSend(xmlhttp);
            var callbackName = ('jsonp_' + Math.random()).replace(".", "");
            var oHead = document.getElementsByTagName('head')[0];
            data.callback = callbackName;
            var ele = document.createElement('script');
            ele.type = "text/javascript";
            ele.onerror = function () {
                console.log('请求失败');
                obj.error && obj.error("请求失败");
            };

            oHead.appendChild(ele);
            window[callbackName] = function (json) {
                oHead.removeChild(ele);
                window[callbackName] = null;
                obj.success && obj.success(json);
            };
            formatParams();
            ele.src = url;


        } else {
            formatParams();
            xmlhttp.open(type, url, async);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            if (typeof(obj.beforeSend) == 'function') obj.beforeSend(xmlhttp);
            xmlhttp.send(data);
            xmlhttp.onreadystatechange = function () {

                if (xmlhttp.status != 200) {
                    console.log(xmlhttp.status + '错误');
                    obj.error && obj.error(xmlhttp.status + '错误');
                    return;
                }

                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    if (dataType == 'JSON') {
                        try {
                            res = JSON.parse(xmlhttp.responseText);
                        } catch (e) {
                            console.log('返回的json格式不正确');
                            obj.error('返回的json格式不正确');
                        }

                    } else if (dataType == 'XML') {
                        res = xmlhttp.responseXML;
                    } else {
                        res = xmlhttp.responseText;
                    }

                    obj.success && obj.success(res);

                }
            }
        }
    };


    window.$ = $;

})(window);

