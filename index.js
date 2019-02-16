/*
*小肥牛扫码点餐项目API子系统
*/
console.log("准备启动服务器")
console.log(new Date().toLocaleString())
const port=8090;
const express=require("express");
const cors=require("cors")
const bodyParser=require("body-parser")
const categoryRouter=require("./routes/admin/category_router")
const adminRouter=require("./routes/admin/admin_router")
const dishRouter=require("./routes/admin/dish_router")
const settingRouter=require("./routes/admin/settings_router")
const tableRouter=require("./routes/admin/table_router")


var app=express()
app.listen(port,()=>{
    console.log("服务器已启动，正在监听"+port+"端口...")
})
app.use(bodyParser.json());//把json格式的请求主体数据解析出来放在req.body中
app.use(cors())
app.use("/admin/category",categoryRouter);
app.use("/admin",adminRouter);
app.use("/admin/dish",dishRouter);
app.use("/admin/setting",settingRouter);
app.use("/admin/table",tableRouter);
