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
    created(){
        let _self =this;
        window.listener.tap('reactCount',(arg)=> {
            _self.reactCount = arg;
        })
    },
    watch: {
        count(){
            window.listener.call('vueCount',this.count);
        }
    }
}
</script>

