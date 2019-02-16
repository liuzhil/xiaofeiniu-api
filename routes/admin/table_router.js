const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * get/admin/table
 * 请求参数：无
 * 返回值：result
 * 
 */
router.get('/',(req,res)=>{
    var sql="select * from xfn_table ";
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

/**
 * get/admin/table/reservation/:tid
 * 获取预约桌台详情
 * 请求参数：tid
 * 返回值：{code:200,data:result}
 */
router.get("/reservation/:tid",(req,res)=>{
    var tid=req.params.tid;
    var sql="selete * from xfn_reservation where tableId=?"
    pool.query(sql,tid,(err,result)=>{
        if(err) throw err;
        res.send({code:200,data:result})
    })
})