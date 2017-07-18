/**
 * Created by lzq on 2017/7/12.
 *
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
                if (fn() == false) {
                    ev.preventDefault();
                    ev.cancelBubble = true;
                }
            }, false);
        } else {

            obj.attachEvent('on' + events, function () {
                if (fn() == false) {
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
                if (zARG.constructor == Array) {
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
        this.on('mouseover', fn)
        return this;

    };
    zquery.prototype.mouseout = function (fn) {
        this.on('mouseout', fn)
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
            if (typeof attr == 'object') {
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
            if (elems[i] == this.elements[0]) {
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
    window.$ = $;
})(window);

