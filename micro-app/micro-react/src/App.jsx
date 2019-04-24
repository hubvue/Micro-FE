// import {useState} from "react";

const App = () => {

    const [count, setCount]  = React.useState(0);
    const [vueCount, setVueCount] = React.useState(0);
    React.useEffect(()=>{
            window.listener.call("reactCount",count);
    },[count]);

    React.useEffect(() => {
        window.listener.tap('vueCount',(args)=>{
            setVueCount(args);
        })
    },[vueCount])
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

