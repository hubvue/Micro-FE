# Micro-FE
🍊走进Micro Frontends：一次Micro Frontends 的简单实践

## 前端如何不同团队间功能组合？
现代化的Web程序大多数都是又单个团队进行开发的，这样存在的问题在于A团队开发的项目只能由A团队完成，如果在A团队中想引入B团队中的功能就会很麻烦，虽然iframe可以解决，但是iframe也存在者诸多的问题。

## iframne现存的问题
iframe是html中的内联框架，其作用是可以在主页内嵌入另外一个网站，但是它存在者很多问题。

### 1.不可控制

iframe嵌入的显示区大小不容易控制，并且存在者一定的局限性。
### 2.bfcache
> bfcache就是浏览器会对页面回退进行缓存，如果用了iframe就不是浏览器的缓存了，是iframe与iframe之间的落地，缓存不了。

url的记录完全无效，页面刷新不能够被记忆，刷新会返回首页，iframe功能之间跳转也无效。
### 3.兼容性坑
iframe的样式显示，兼容性等都具有局限性。

### 4.性能开销
iframe加载的时候会阻塞主页面的onload，占用连接池，多层嵌套页面崩溃。onload都被阻止了，还谈什么性能

## 微理念
微理念的意义在于把一个整体分为若干个小部分，每一个小部分独立完成，并且小部分之间项目独立，最后组合成一个整体。

这样的好处在于：小部分只专注于做自己的事情，能够做到把功能做的更纯粹更突出，小而精悍。


## 什么是微前端？
微服务的盛行让服务端进行极大的解耦，更专注于做自己的事情，而微前端是将微服务的理念应用于前端技术后的相关实践，使得一个前段项目能够经由多个团队开发以及独立部署。

### 微前端背后的核心理念
#### 1.技术无关
各个开发团队都可以自行选择技术栈，不受同一项目中其他团队的影响。
#### 2.隔离团队代码
即使所有团队使用相同的框架，也不要共享运行时。构建自包含的独立应用程序。不要依赖共享的状态或全局变量。

#### 3.建立团队前缀
同意在无法实现隔离的命名约定。命名空间CSS，事件，本地存储和Cookie，以避免冲突并澄清所有权。

#### 4.消息通信机制
各功能间使用消息通信机制进行信息传输，尽量使用浏览器原生的API。例如messageChannel。

### 开发示意图
![](https://user-gold-cdn.xitu.io/2019/4/25/16a53373c1b9e6b1?w=793&h=644&f=png&s=231066)

## 微前端的实施方案
### 做微前端的架构方案必须要解决的问题
1. 一个前端需要对应多个后端。
2. 必须提供一套应用注册机制，完成应用的无缝整合。
3. 构建时集成应用和应用独立发布部署。
4. 在应用之间团队开发者要制定好使用CSR或SSR的技术方案。


### 做微前端的三种方式
1. 发布静态资源 + 后台路由和服务。
2. 发布组件，启动时机全由父级决定。
3. 发布局部应用，配置过程由自身决定。

由于能力原因，这里只展示第一种方式。
#### 三大框架切入微前端
![](https://user-gold-cdn.xitu.io/2019/4/25/16a537ae16d1e6c8?w=1474&h=478&f=png&s=278372)

第一种方式有很多种实现方式，如图上面5种方式都可以完成。

发布静态资源的方式主要在于每一个功能独立打包，独立运行，通过总线注册机制把相应的功能注册进来，并且总线还提供每一个独立包功能依赖的环境。

##### 如何注册？
熟悉Webpack的都知道，整个webpack编译后的项目是靠所有文件的chunkId串起来的，就像main.js文件中数组中存放者1、2、3、4、5等等，也就意味着，每一个文件不能单独的对外释放。因此由于Webpack的这个特性将决定Webpack与微前端无缘，但是Systemjs拯救了webpack。

> systemjs 是一一个最小小系统加载工工具,用用来创建插件来处理理可替代的场景加载过程,包括加载 CSS场景和图片片,主要运行行行在浏览器器和 NodeJS 中。它是 ES6浏览器器加载程序的的扩展,将应用用在本地浏览器器中。通常创建的插件名称是模块本身,要是没有特意指定用用途,则默认插件名是模块的扩展名称。

Webpack中有`webpack-system-register`这个插件，可以把webpack的模块打包成systemjs的模块化机制。中心总线使用systemjs引入包的方式把相对应的功能模块加载进来。

## 一次简单的微前端实践
我做的一次简单的微前端的实践是主要是React和Vue这两个框架的整合。

### 文件目录结构
![](https://user-gold-cdn.xitu.io/2019/4/25/16a538360cf0cc3c?w=332&h=301&f=png&s=18362)

我的整个主要的目录结构就那么多。
- bin 是我自己使用sheklljs+nodejs写的一个自动化打包的一个功能。
- bus-register 是总线注册机制，所有的功能模块都将在这里注册
- micro-app 中是每一个功能模块。

### run
#### 总线设计
![](https://user-gold-cdn.xitu.io/2019/4/25/16a53881b00d299f?w=328&h=106&f=png&s=7123)

- 总线就是一个很简单的html文件
- micro目录是存放所有的功能模块
- scripts目录存放总线所需要的js文件。

#### 总线
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```
一个很简单的html文件，没错这就是总线。下面我们来为总线添加一点色彩。

由于在项目中使用到了react，所以需要引入有关react的js包,这里使用的是[Staticfile CDN](http://staticfile.org/)上提供的包。
```html
<!--在head中添加-->
<script src="https://cdn.staticfile.org/react/16.8.6/umd/react.development.js"></script>
<script src="https://cdn.staticfile.org/react-dom/16.8.6/umd/react-dom.development.js"></script>
```
react中使用到了jsx语法，因此需要引入babel包，用来编译jsx语法。
```html
<!--在head中添加-->
<script src="https://cdn.staticfile.org/babel-standalone/7.0.0-beta.3/babel.min.js"></script>
```
项目中使用到了vue，因此需要引入vue.js文件
```html
<script src="https://cdn.staticfile.org/vue/2.6.10/vue.min.js"></script>
```
每个模块都通过`webpack-system-register`插件打包成了system模块化，因此还需要引入systemjs用来引入各个功能模块。
```html
<!--在head中添加-->
<script src="https://cdn.staticfile.org/systemjs/3.1.6/system.min.js"></script>
```
#### 开始构建
总线完成，开始把阵地转移到`micro-app`中，开始提到项目中使用react和vue两个框架，所以在`micro-app`中创建两个项目。

![](https://user-gold-cdn.xitu.io/2019/4/25/16a539c1cb293e95?w=322&h=70&f=png&s=5257)

项目可以通过cli构建也可以通过webpack自己搭建，这都不所谓，这里我是自己搭建的，更可控。

无论是上面两种方式的哪一种方式都需要在webpack配置文件中，将`webpack-system-register`插件引入进来。
```js
const WebpackSystemRegister = require("webpack-system-register");
module.exports = {
    plugins: [
        new WebpackSystemRegister({});
    ]
}
```
在前面`微前端背后的核心理念`中提到每个功能团队都应该约定自己功能的项目前缀，以防止与其他团队混淆，并且笔者这里还约束了webpack打包后的文件输出格式：如果使用哪一个框架进行打包，必须以所依赖框架为前缀，例如：`react-app.js`,`vue-app.js`,其webpack的入口entry为：
```js
//react项目
entry: {
    "react-app": "./src/App.jsx",
},
//vue项目
entry: {
    "vue-app": "./src/App.vue",
},
```
两个功能项目都是实现的一个计数器，提供两个按钮(一个增加按钮、一个减少按钮)。
```vue
//vue的代码
<template>
    <div>
        <h1>Vue:{{count}}</h1>
        <button @click="addCount">+</button>
        <button @click="redCount">-</button>
        <h2>React的点击次数：{{reactCount}}</h2>
    </div>
</template>
<script>
export default {
    data(){
        return {
            count: 0,
            reactCount: 0,
        }
    },
    methods: {
        addCount(){
            this.count++;
        },
        redCount(){
            this.count--;
        }
    },
}
</script>
```
```jsx
//react的代码
// import {useState} from "react";

const App = () => {

    const [count, setCount]  = React.useState(0);
    return (
        <>
            <h1>React:{count}</h1>
            <button onClick={()=>{setCount(count + 1)}}> + </button>
            <button onClick={()=>{setCount(count - 1)}}> - </button>
            <h2>Vue的点击次数：{vueCount}</h2>
        </>
    )
}
export default App;
```
![](https://user-gold-cdn.xitu.io/2019/4/25/16a53a6bc8a35cf7?w=478&h=358&f=png&s=17125)

这是最后的效果。两个功能项目构建的是一样的。

上面我们说了项目打包后的文件约定了文件输出格式，现在来看一下。

vue项目

![](https://user-gold-cdn.xitu.io/2019/4/25/16a53a89db36e4fd?w=335&h=54&f=png&s=4761)

react项目

![](https://user-gold-cdn.xitu.io/2019/4/25/16a53a9123138873?w=334&h=58&f=png&s=4594)

两个项目文件都构建成功，需要把项目打包出来的js文件手动放入到总线的micro文件夹下


![](https://user-gold-cdn.xitu.io/2019/4/25/16a53ac4af9505e3?w=340&h=78&f=png&s=7589)

然后还需要手动的html中把`micro`中的js使用system加载的方式引入进来。
```html
<!--这里需要注意使用babel的js话，必须要把type的值改成test/babel,才会生效-->
<script type="text/babel" data-type="react-app">
    //导入react项目
    System.import("./micro/react-app-7c100655.js").then(_ => {
    let App = _.default;
    ReactDOM.render(
        <App/>,
        document.querySelector("#react-app"))
    })
</script>
<script data-type="vue-app">
    //导入vue项目
    new Vue({
        el: "#vue-app",
        components: {
            "vue-app": () => System.import("./micro/vue-app-0b23dfd8.js")
        }
    })
</script>
```
在body中决定各个功能模块所渲染的位置。
```html
<div class="container">
    <header>nav</header>
    <hr>
    <div id="react-app"></div>
    <hr>
    <div id="vue-app">
        <vue-app></vue-app>
    </div>
</div>
```
到这里就可以运行了，由于systemjs运行在服务器上，所以这里使用`http-server`运行一个服务器环境。

安装http-server
> npm install http-server -g

在总线根目录使用http-server启动。

![](https://user-gold-cdn.xitu.io/2019/4/25/16a53b6f43446b19?w=694&h=660&f=gif&s=73423)

运行成功了，但是我所点击react，vue中的react的点击次数并没有改变，同样点击vue，react也并没有改变。为什么呢？

文章到现在相信已经知道，每一个功能模块都是独立的，项目不受干扰，没有联系。那么如何在模块间的消息通信呢？

#### 模块间消息通信

总线注册系统需要提供一个消息通信机制来让有联系的模块间做信息传输，这个消息通信机制由总线提供，因此每一个模块必须遵守总线注册系统所提出的通讯规则。

消息通讯机制就是一个简单版的订阅发布模式，代码如下：
```js
class Listener {
    constructor(){
        this.taps = [];
    }
    tap(type,fn){
        this.taps.push({
            type,
            fn,
        })
    }
    call(type,...args){
        this.taps.forEach((tap, index,arr)=> {
            if(tap.type === type){
                tap.fn.apply(null,args);
            }
        })
    }
}
window.listener = new Listener();
```
把listener实例挂在到window上，可以让每一个功能模块都可以访问到。

##### react中消息通讯

这里使用到了react的useEffect和useState Hook。
```js
const [vueCount, setVueCount] = React.useState(0);
React.useEffect(()=>{
        //发布vue所订阅的消息
        window.listener.call("reactCount",count);
},[count]);

React.useEffect(() => {
    //订阅vue的消息
    window.listener.tap('vueCount',(args)=>{
        setVueCount(args);
    })
},[vueCount])
```
##### vue中消息通信

```js
created(){
    let _self =this;
    //订阅react的消息
    window.listener.tap('reactCount',(arg)=> {
        _self.reactCount = arg;
    })
},
watch: {
    count(){
        //发布react所订阅的消息
        window.listener.call('vueCount',this.count);
    }
}
```
![](https://user-gold-cdn.xitu.io/2019/4/25/16a53bff18830913?w=694&h=660&f=gif&s=88816)

咦，貌似成功了。

成功了虽然成功了，但是突然想到一个问题，每一次生成的代码都需要把代码拷贝到相应的地方，并且还需要在总线html中引入，这么麻烦，我的天！怎么可能？要是这么搞，不就废了么？写一句代码都要修改一下，做完一个项目要累死？

> 我始终相信车到山前必有路，肯定有办法解决的。

### 自动化构建
首先我想到的是：我能不能做到自动化的方式，自动化打包每一个功能模块，自动化把所有功能模块下的dist添加到总线的`mocro`目录下，最后自动化遍历`micro`下面的所有的js文件并动态的插入到html中。

上面是我的思路，先来分析一下，思路中的关键词有：`打包`、`移动文件`、`遍历js插入html中`。

经过我的深思熟虑我发现：打包和移动文件可以通过shell命令来完成，遍历js插入到html中可以通过nodejs来完成，特别幸运的是社区中有shelljs包可以在node中写shell命令并抱起来。

```js
const fs = require("fs");
const shell = require("shelljs");
const cheerio = require("cheerio");
//读取micro各独立项目文件。
const readDir = () => {
}
//react项目写入
const writeReact = (file) => {
}
//vue项目写入
const writeVue = (file) => {
}
//写入总线
const writerBus = (files) => {
}
//写入启动
const runWrite = async () => {
}
//启动各项目编译，提交文件。
const buildApps = () => {
}
//执行部署。
const run = async () => {
} 
run();

```
代码总体思路如上所示。从思路开始说吧
#### shell启动各项目编译并转移文件

```js
//启动各项目编译，提交文件。
const buildApps = () => {
   return new Promise((resolve,reject) => {
        shell.cd("../micro-app/");
        shell.rm("../bus-register/micro/*")
        shell.ls().forEach((dir)=> {
            shell.cd(dir);
            if(shell.exec("npm run dev").code !== 0){
                shell.echo("自动化部署失败");
                shell.exit(1);
                reject();
            } else {
                
                shell.cp("./dist/*.js", "../../bus-register/micro")
                shell.cd("../");
                shell.echo("Success!");
                resolve();
            } 
        })   
   })
}
```
由于最终使用async启动，所以这里使用到了Promise。整体思路如下：首先把总线中的`micro`文件夹清空(缺乏增量提交，首次开发，先这样吧)，遍历`micro-app`下的所有的目录，启动各项目的`npm run dev`(串行编译)，判断是否编译成功，编译成功提示`Success`,否则报错。

#### 自动化写入总线
写入总线分为了两步，并且两步并行执行。
##### 1、读取`micro`目录，生成写入总线所需要的数据
上面说过，文件名是严格约定的，至于为什么约定，在这里用到。
```js
const readDir = () => {
    return new Promise((resolve,reject) => {
        shell.cd("../bus-register/")
        
        fs.readdir("micro/",(err,files) => {
            if(err){
                reject(err);
            }
            let fileMaps = files.map(file => {
                
                let frame = file.split("-")[0];
                let name = `${file.split("-")[0]}-${file.split("-")[1]}`
                //找出子项目是怎么框架构建的，并使用type标识，
                //分析子项目的名称，使用name标识，决定渲染到指定位置。
                //src为子项目的js文件路径。
                return {
                    type: frame,
                    name,
                    src: file,
                }
            })
            resolve(fileMaps);
        });
    })
}
```
##### 2、写入总线
写入总线使用node原生的fs模块的读取和写入的异步方法，并使用`cheerio`这个库获得写入的数据。`cheerio`是服务端的`jQuery`，可以在服务端操作html文件。
```js
const writerBus = (files) => {
    let jsStr = "";
    return new Promise((resolve,reject) => {
        fs.readFile("../bus-register/index.html",{encoding: 'utf8'},(err,data) => {
            if(err){
                reject(err);
                return;
            }
            $ = cheerio.load(data)
            files.forEach(file => {
                if(file.type === 'react'){
                    jsStr += writeReact(file)
                }
                if(file.type ==='vue'){
                    jsStr += writeVue(file)
                }
            });
            $("body script").remove();
            $("body").append(jsStr);
            fs.writeFile("../bus-register/index.html",$("html").html(),(err)=>{
                if(err){
                    reject(err);
                }
                resolve();
            })  
        })
    })
}
```
判断两种方式写入

react写入
```js
//react项目写入
const writeReact = (file) => {
    let jsStr  = `<script type="text/babel" data-type="${file.name}">
        System.import("./micro/${file.src}").then(_ => {
        let App = _.default;
        ReactDOM.render(
            <App/>,
            document.querySelector("#${file.name}"))
        })
    </script>`
    return jsStr;
}
```
vue项目写入
```js
//vue项目写入
const writeVue = (file) => {
    let jsStr = `<script data-type="${file.name}">
        new Vue({
            el: "#${file.name}",
            components: {
                "vue-app": () => System.import("./micro/${file.src}")
            }
        })
    </script>`
    return jsStr;
}
```
激动人心的时刻，启动自动化构建。

![](https://user-gold-cdn.xitu.io/2019/4/25/16a53e13814688d5?w=720&h=482&f=gif&s=1055408)


访问一下试试看。

![](https://user-gold-cdn.xitu.io/2019/4/25/16a53e252944c476?w=720&h=482&f=gif&s=50744)

成功了！！！

### 总结一下自动化构建
自动化构建虽然棒，但是存在着很多问题：一是目前的自动化构建只适用于符合我自己规则的项目，换一个人写可能就无法遵守我的规则；二是没有增量编译，没次都会重新编译所有的文件；三是没有热更新部署，每次修改代码都需要手动跑一次，并没有做到监听文件的变化自动的去构建。这才只是一个开始，希望后面完善这些。
