mff 
------
> framework base on fis3 + jsp

##规范

###开发规范

page   #后端页面jsp
static # 非模块的资源 如：lib
widget # 包含后端模板的组件 （js,css,jsp）
ui     # 通用组件 （js, css）
test   # 数据mock文件

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
