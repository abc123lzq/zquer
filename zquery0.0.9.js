/**
 * Created by lzq on 2017/7/12.
 *  这是一个自创轻量级js库
 */

(function () {

    var _zquery = zquery;
    var _$ = $;
    var isIE = !!window.ActiveXObject || "ActiveXObject" in window;

    function $(ZARG) {
        return new zquery(ZARG);
    }

    /**
     *系统事件绑定
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
            //解决多类无法全选
            var arrClassName = elems[i].className.split(' ', 1)[0];
            if (arrClassName === sClass) {
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
     * zquery查询器
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

    /**
     *zquery方法api
     */
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
    zquery.prototype.val=function () {
        var val = [];
        if(this.elements.length===1){
            val = this.elements[0].value;
        }else{
            for(var i=0;i<this.elements.length;i++){
                var iVal = this.elements[i].value;
                val.push(iVal);
            }
        }

        return val;
    };
    zquery.prototype.text=function (str) {
        var text = [];
        if(str!==undefined){
            for(var i=0;i<this.elements.length;i++){
                this.elements[i].innerHTML = str;
            }
        }else{
            if(this.elements.length===1){
                var iText_1 = this.elements[0];
                if(isIE){
                    text = iText_1.innerText;
                }else {
                    text = iText_1.textContent;
                }
            }else {
                for(var i=0;i<this.elements.length;i++){
                    var iText=this.elements[i];
                    if(isIE){
                        text.push(iText.innerText)
                    }else {
                        text.push(iText.textContent);
                    }
                }
            }
        }
        return text;
    };
    zquery.prototype.isArray = Array.isArray || function (object) {
        return object instanceof Array
    };
    zquery.prototype.addClass = function (className) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].className === "") { //是否有设置属性
                this.elements[i].className = className;
            } else {
                var arrClassName = this.elements[i].className.split(" ");
                var index = arrClassName.indexOf(className);
                if (index === -1) { //是否已经存在这个名字
                    this.elements[i].className += ' ' + className;
                }
            }
        }
    };
    zquery.prototype.removeClass = function (className) {
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].className !== "") {
                var arrClassName = this.elements[i].className.split(" ");
                var index = arrClassName.indexOf(className);
                if (index !== -1) {  //如果存在要删除的class
                    arrClassName.splice(index, 1);
                }
                this.elements[i].className = arrClassName.join(' ');
            }
        }

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
            // this.elements[i].style.position = 'absolute';
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
                            console.log(123);
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
     * @param events  自定义绑定系统事件
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
     * 动态创建js
     * @param jsUrl
     */
    $.createScript=function (jsUrl){
        var script = document.createElement('script');
        script.src =jsUrl;
        document.body.appendChild(script);

    };

    /**
     * 动态创建css 这对于依赖css的js插件可以，直接在插件引入方法管理
     * @param cssUrl
     */
    $.createLink =function(cssUrl){
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
    };

    /**
     * 防止文本框xss攻击
     * @param str
     */
    $.safeXSS=function(str) {
        var s = "";
        if (str.length === 0) return "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    };

    /**
     * 获取时间格式
     * @returns  参数为空则获取时间戳
     * timer1:格式 yyyy-mm-dd
     * timer2:格式 hh:mm
     */
    $.DateType =function(typeTimer){
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        if(typeTimer===0||typeTimer==null||typeTimer==undefined){
            return Date.parse(new Date());
        }else if(typeof typeTimer==="number"&&typeTimer===1){
            var clock_1 = year + "-";
            if(month < 10)
                clock_1 += "0";
            clock_1 += month + "-";
            if(day < 10)
                clock_1 += "0";
            clock_1 += day;
            return(clock_1);
        }else if(typeof typeTimer==="number"&&typeTimer===2){
            var clock_2 = '';
            if(hh < 10)
                clock_2 += "0";
            clock_2 += hh + ":";
            if (mm < 10) clock_2 += '0';
            clock_2 += mm;
            return(clock_2);
        }else {
            console.error('不好意思暂时只有三种格式')
        }
    };

    // 常用正则校验 例： $.rule.phone
    $.rule={
        phone:/^1(3|4|5|7|8)\d{9}$/, //手机号
        //phone:/^1(3\d|5[0-35-9]|8[025-9]|47)\d{8}$/, //手机号
        company:/^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9\s-,-.]*$/,
        uname:/^[\u4E00-\u9FA5a-zA-Z][\u4E00-\u9FA5a-zA-Z0-9_]*$/,
        zh:/^[\u4e00-\u9fa5]+$/,//纯中文
        en:/^[a-zA-Z|\s]+$/, //纯英文
        card:/^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((((19|20)((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229)))|20000229)\d{3}(\d|X|x))|(((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229))\d{3}))$/, //身份证号
        int:/^[0-9]*$/, //整数
        s:'',
        NameEN:/^[a-zA-Z|\s]{2,20}$/, //英文姓名
        NameZH:/^[\u4e00-\u9fa5 ]{2,10}$/, //中文姓名
        Name:/^[\u4e00-\u9fa5 ]{2,10}$|^[a-zA-Z|\s]{2,20}$/, //中英姓名
        Nick:/^[\w|\d|\u4e00-\u9fa5]{3,15}$/, //昵称
        Num:/^\d+$/, //纯数字>0
        Num2:/^[+-]?\d+(\.\d+)?$/, //数字和小数点
        YZM:/^[0-9a-zA-Z]{4}$/, //图形验证码
        Postcode:/^[0-9]\d{5}$/,//邮政编码
        Mail:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, //邮箱
        PassWord:/^[0-9a-zA_Z]{6,128}$/, //密码
        // PassWord:/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*.]{6,20}$/, //密码
        HZ:/^[a-zA-Z0-9]{3,21}$/ //护照
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

    /**
     * 性能优化尽早触发dom操作
     */
    $.ready = function (fn) {
        // 目前Mozilla、Opera和webkit 525+内核支持DOMContentLoaded事件
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', function () {
                document.removeEventListener('DOMContentLoaded', arguments.callee, false);
                fn();
            }, false);
        }

        //IE
        else if (document.attachEvent) {
            // 确保当页面是在iframe中加载时，事件依旧会被安全触发
            document.attachEvent('onreadystatechange', function () {
                if (document.readyState === 'complete') {
                    document.detachEvent('onreadystatechange', arguments.callee);
                    fn();
                }
            });

            // IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
            if (document.documentElement.doScroll && typeof window.frameElement === "undefined") {
                try {
                    document.documentElement.doScroll('left');
                }
                catch (error) {
                    return setTimeout(arguments.callee, 20);
                }
                fn();
            }
        }
    };

    /**
     * 自定义事件绑定
     * @param obj 对象
     * @param events 事件名 'postMsg' 等自己随便取
     * @param fn 回调
     */
    $.bindMyEvent = function (obj, events, fn) {
        obj.listeners = obj.listeners || {};
        obj.listeners[events] = obj.listeners[events] || [];
        obj.listeners[events].push(fn);
        if (obj.nodeType) {
            if (obj.addEventListener()) {
                obj.addEventListener(events, fn, false)
            } else {
                obj.attachEvent('on' + events, fn);
            }
        }
    };
    /**
     *触发自定义事件
     * @param obj
     * @param events
     */
    $.fireMyEvent = function (obj, events) {
        if (obj.listeners && obj.listeners[events]) {
            for (var i = 0; i < obj.listeners[events].length; i++) {
                obj.listeners[events][i]();
            }
        }
    };

    /**
     * 优化性能图片懒加载+节流
     * @param delay 延迟
     * @param time 必须刷一次
     */
    $.lazyLoad = function (delay, time) {
        var lazyLoad_ = lazyLoad;

        var lazyLoad = function () {
            var seeHeight = document.documentElement.clientHeight,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                img = document.getElementsByTagName('img'),
                num = img.length,
                n = 0,//存储图片加载位置
                i;

            for (i = n; i < num; i++) {
                if (img[i].offsetTop < seeHeight + scrollTop) {
                    if (img[i].getAttribute('src') === 'default.jpg') {
                        img[i].src = img[i].getAttribute('data-src')
                    }
                    n = i + 1
                }
            }
        };

        //滚动会高频函数里dom操作，可用dom节流优化
        function thorttle(fn, delay, time) {
            var timer = null,
                startTime = new Date();

            return function () {
                var that = this,
                    curTime = new Date();

                if (timer) {
                    clearTimeout(timer);
                }
                if (curTime - startTime > time) {
                    fn.call(that, arguments);
                    startTime = curTime;
                } else {
                    timer = setTimeout(fn, delay);
                }
            }
        }
        //初渲染
        lazyLoad();
        //滚动渲染
        window.addEventListener('scroll', thorttle(lazyLoad, delay, time), false)
    };

    window.$ = $;

})(window);


