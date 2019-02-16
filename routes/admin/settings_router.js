const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * get/admin/setting
 * 请求参数：无
 * 返回值：result
 */
router.get('/',(req,res)=>{
    var sql="select * from xfn_settings ";
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

/**
 * put/admin/setting
 * 请求参数：{sid:xx,appName:'xxx',apiUrl:"http://127.0.0.1:8090",admin:"xxx",appUrl:"xxx",icp:"xxx",copyright:"xxx"}
 * 返回值：{code:200,msg:'update succ'}
 * {code:400,msg:'update fail'}
 */
router.put("/",(req,res)=>{
    var data=req.body;
    var sql="update xfn_settings set ? ";
    pool.query(sql,data,(err,result)=>{
        if(err) throw err;
        if(data.sid){
            res.send({code:200,msg:"update succ"})
        }else{
            res.send({code:400,msg:"update fail"})
        }
    })
})