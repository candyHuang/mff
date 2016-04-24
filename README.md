mff 
------
> framework base on fis3 + jsp

##规范

###开发规范

```bash
|---page   #后端页面jsp
|---static # 非模块的资源 如：lib
|---widget # 包含后端模板的组件 （js,css,jsp）
|---ui     # 通用组件 （js, css）
|---test   # 数据mock文件
```

## 部署规范

```bash
|---public # 静态资源
	|---ui
	|---widget
	|---static
	|---page html页面
|---views  # jsp模板
	|---page
	|---widget
```


## 使用方法

* 安装node环境
* 安转java环境
* npm install -g mff
* mff release 
* mff server start
* mff release -w


## jsp标签使用方法

* 使用``<fis:root>``包裹页面
* 使用``<fis:require>``替代传统``<link href>``,``<script src>``标签来加载静态资源
* 使用``<fis:styles/>``标签显示``<fis:require>``标签收集到的所有css资源
* 使用``<fis:scripts/>``标签显示``<fis:require>``标签收集到的所有js资源
* 使用``<fis:script>``标签代替传统``<script>``标签，它可以帮你收集页面上的js统一放到尾部

实例如下：

```jsp
<%@ page contentType="text/html;charset=utf-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/fis" prefix="fis"%>
<fis:root>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<title>index</title>
    <!-- __MOCK_PLACEHOLDER__ -->
	<%-- 使用<fis:require>替代传统<link href>、<script src>标签来加载静态资源 --%>
    <fis:require id="static/lib/mod/mod.js"/>
    <fis:require id="static/lib/jquery/1.11.3/jquery.min.js" />
    <fis:require id="static/lib/bootstrap/3.3.5/bootstrap.js" />
    <fis:require id="static/lib/bootstrap/3.3.5/bootstrap.scss" />
    <fis:require id="static/common/1.0.0/app.scss" />
    <fis:require id="static/common/1.0.0/app.js" />
    <%-- 使用<fis:styles/>标签显示<fis:require>标签收集到的所有css资源 --%>
    <fis:styles/>
</head>
<body>
    <div class="wrapper">
        <%@ include file="../widget/header/header.jsp"%>
        <%@ include file="../widget/aside/aside.jsp"%>

        <div class="main-content">
            <!-- 顶部标签页 -->
            <section class="main-content-tabs hide">
                <ul class="nav nav-tabs nav-blue draggable"></ul>
            </section>
            <!-- 内容区 -->
            <section class="content hide">
                <div class="tab-content"></div>
            </section>
            <!-- 首页内容 -->
            <section class="index-content"></section>
        </div>
    </div>
   <%-- 使用<fis:script>标签代替传统<script>标签，它可以帮你收集页面上的js统一放到尾部 --%>
    <fis:script>
       console.log('零散的脚本');
    </fis:script>
	<%-- 使用<fis:scripts/>标签显示<fis:require>标签收集到的所有js资源 --%>
    <fis:scripts/>
</body>
</html>
</fis:root>
```

## 数据模拟

> [随机数据占位符]（http://mockjs.com/examples.html#Random.datetime(%20format?%20))


### jsp页面 数据模拟

为了开发方便，我们提供给jsp注入模拟数据。只需要简单几步

* 在 test 下的 ``server.properties`` 建立映射条件 url=file
* 建立file文件，并在文件中写入需要模拟的数据

如： 

```
//server.properties

index.jsp=index.json
someurl=somefile
# 这是properties中的注释


//index.json
{
    "ctitle": "@ctitle",
    "csentence": "@csentence",
    "cparagraph": "@cparagraph",
    "cname": "@cname",
    "float": "@float",
    "list|2-5": [
        {
            "name": "@cname",
            "age": "@integer"
        }
    ]
}
```

### ajax 数据模拟

* 在ajax所在页面添加占位符 ``<!-- __MOCK_PLACEHOLDER__ -->``， 需要在jquery库前
* 只需要在 test 下的 ``ajax-conf.js`` 中设置url以及返回的数据


```json
{
    "url_1": {
        "ctitle": "@ctitle",
        "csentence": "@csentence",
        "cparagraph": "@cparagraph",
        "cparagraph": "@cparagraph",
        "cname": "@cname",
        "natrue": "@natural",
        "float": "@float"
    },
    "url_2": {
        "list|1-10": [{
            "id": "@id",
            "integer": "@integer(10000)",
            "date": "@date(yyyy-MM-dd)",
            "time": "@time",
            "datetime": "@datetime",
            "city": "@city"
        }]

    }
}
```


