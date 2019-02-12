/*
*小肥牛扫码点餐项目API子系统
*/
const port=8090;
const express=require("express");


var app=express()
app.listen(port,()=>{
    console.log("服务器已启动，正在监听8090端口...")
})