/**
 * Created by lzq on 2017/7/12.
 *  这是一个自创轻量级js库
 */

(function () {

    var _zquery = zquery;
    var _$ = $;

    function $(ZARG) {
        return new zquery(ZARG);
    };

    function binEvent(obj, events, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(events, function (ev) {
                if (fn() === false) {
                    ev.preventDefault();
                    ev.cancelBubble = true;
                }
            }, false);
        } else {

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

    function toArray(elems) {
        var arr = [];
        for (var i = 0; i < elems.length; i++) {
            arr.push(elems[i]);
        }

        return arr;

    }


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


    function getStyle(obj, attr) {
        if (obj.currentStyle) { //ie
            return obj.currentStyle[attr]
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    }

    zquery.prototype.on = function (events, fn) {
        for (var i = 0; i < this.elements.length; i++) {
            binEvent(this.elements[i], events, fn);
        }
        return this;
    };

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


    $.trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    $.extend = function (json) {
        for (var attr in json) {
            $[attr] = json[attr];
        }
    };

    $.fn = {};
    $.fn.extend = function (json) {
        for (var attr in json) {
            zquery.prototype[attr] = json[attr];
        }
    };

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
        }
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


            return;
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


    $.getPar = function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    };

    window.$ = $;

})(window);

