/**
 * 简单版消息通信观察者模式
 * 
 */

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
console.log(window.listener)