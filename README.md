### 这一个基于原生js写的插件库我们叫他zquery吧

**$.getPar: 获取url对应的传参**
```
// 调用方法
alert(GetQueryString("参数名1"));
alert(GetQueryString("参数名2"));
alert(GetQueryString("参数名3"));

//如果url没有传参需加判断防止报错
var myurl=GetQueryString("url");
if(myurl !=null && myurl.toString().length>1)
{
   alert(GetQueryString("url"));
}
```
**scrollTop (num, cb1, cb2)：滚动**
> num是滚动值得判断界点，成立调用cb1，不成立调用cb2

**animate (attrJson, fn, num)： 动画**
> attrJson属性用 json格式书写，fn为回调，num为速度越大越慢


**完档加载完毕**
```
$(function(){})

//等价于，可以多次调用

window.addEventListener('load', function () {},fasle)
```
**dom加载完毕**
```
 $.ready(function () {}
 
//等价于，可以多次调用,并且操作dom比onload早

document.addEventListener('DOMContentLoaded', function () {},fasle)
```

**$.bindMyEvent自定义事件绑定， $.fireMyEvent：自定义事件触发**
```
   $.ready(function () {
            var txs = $('.txxxs');
            $.bindMyEvent(txs, 'hello', function () {
                console.log('你好')
            });
            $.bindMyEvent(txs, 'world', function () {
                console.log('世界')
            });

            $.fireMyEvent(txs, 'hello');
            $.fireMyEvent(txs, 'world');

        });

```
**$.lazyLoad(delay, time): 图片懒加载**
```
//html约定
<img src="default.jpg" data-src="theTrueImgXXX.jpg" alt="">
```
常用逻辑（待考核是否真的入库）
```
$.DateType获取各种时间格式
$.rule常用正则
$.safeXSS防止xss攻击
$.createLink 动态创建css
$.createScript动态创建js
```

