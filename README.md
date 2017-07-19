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
