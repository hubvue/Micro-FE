const fs = require("fs");
const cheerio = require("cheerio");
const shell = require("shelljs");

//读取micro各独立项目文件。
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

//写入总线
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


//写入启动
const runWrite = async () => {
    const files = await readDir();
    await writerBus(files);
}

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


//执行部署。
const run = async () => {
    await buildApps();
    await runWrite();
    console.log("部署成功！");
} 

run();




