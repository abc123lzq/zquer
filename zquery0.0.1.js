/**
 * Created by lzq on 2017/7/12.
 *   $('').abc();
 *   对象下面的方法,那就用面向对象呗
 */



// ja中的所有事件操作，都是绑定形式，这样就不会覆盖原有的方法等
function binEvent(obj, events, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(events, function (ev) {
            if (fn() == false) {
                ev.preventDefault();
                ev.cancelBubble = true;
            }
        }, false);
    } else {
        //ie低版本兼容属性
        obj.attachEvent('on' + events, function () {
            if (fn() == false) {
                window.event.cancelBubble = true;
                return false;
            }
        }, false);
    }
}

// 要获取class必须自己封装
function getByClass(oParent, sClass) {
    var arr = [];
    var elems = oParent.getElementsByTagName('*');//父级下的所有
    for (var i = 0; i < elems.length; i++) {
        if (elems[i].className === sClass) {
            arr.push(elems[i]);
        }
    }

    return arr;
}

// 类数组转数组
function toArray(elems) {
    var arr = [];
    for (var i = 0; i < elems.length; i++) {
        arr.push(elems[i]);
    }

    return arr;

}

//判断传进来的类型
function zquery(zARG) {
    this.elements = [];//把选择元素push到集合数组里

    // 判断传进来的类型
    switch (typeof zARG) {
        case 'function':
            // window.onload = zARG;
            binEvent(window, 'load', zARG);
            break;
        case 'string':
            switch (zARG.charAt(0)) {
                case'#': //id
                    this.elements.push(document.getElementById(zARG.substring(1)));
                    break;
                case'.': //class
                    this.elements = getByClass(document, zARG.substring(1));
                    break;
                default: //tag标签
                    //因为这是类数组没有方法，所为了防止在变量类型被改变必须转成真正的数组
                    this.elements = toArray(document.getElementsByTagName(zARG));
                    break;
            }
            break;
        case 'object':
            if (zARG.constructor == Array) {//判断是否数组对象
                this.elements = zARG;
            } else {
                this.elements.push(zARG);
            }
            break;

    }
}

//获取最终样式
function getStyle(obj, attr) {
    if (obj.currentStyle) { //ie
        return obj.currentStyle[attr]
    } else { //通用
        return getComputedStyle(obj, false)[attr];
    }
}

//方法大全
// 优化共用方法
zquery.prototype.on = function (events, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        binEvent(this.elements[i], events, fn);
    }
    return this;
};

zquery.prototype.html = function (str) {
    if (str) {//设置
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = str;
        }
    } else {//获取
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
    if (arguments.length === 2) {//设置
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].setAttribute(attr, value);
        }
    } else if (arguments.length === 1) {//获取
        return this.elements[0].getAttribute(attr);

    }
    return this;
};
zquery.prototype.eq = function (num) {
    return $(this.elements[num]);
    //原生对象转zquery对象才能有方法,放进$()方法里来创建zquery对象

};
zquery.prototype.index = function () {
    var elems = this.elements[0].parentNode.children;
    for (var i = 0; i < elems.length; i++) {
        if (elems[i] == this.elements[0]) { //比对成功返回
            return i;
        }

    }
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


//格式约定
function $(ZARG) {
    return new zquery(ZARG);
}


//拓展工具方法
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























