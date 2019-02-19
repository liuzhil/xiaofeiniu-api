const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**get 请求可以有主体吗
 * API get/admin/login
 * 完成用户登录
 * 请求数据：
 * 返回值：{code:200,msg:"login success"}
 *          {code:400,msg:"login fail"}
 */
router.get("/login/:aname/:apwd",(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    var sql="select aid from xfn_admin where aname=? and apwd=password(?)";
    pool.query(sql,[aname,apwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0)
        res.send({code:200,msg:"登录成功"})
        else{
            res.send({code:400,msg:"登录失败,账号或密码错误"})
        }
    })
})


 /**
  * API patch/admin/login
  * 请求数据：{aname:"xxx",oldpwd:"xxx",newpwd:"xxx"}
  * 返回数据
  * {code:200,msg:"修改成功"}
  * {code:400,msg:"用户名或密码错误"}
  * {code:401,msg:"密码未被修改"}
  */
 router.patch("/",(req,res)=>{
    var data=req.body;
    sql="select aid from xfn_admin where aname=? and apwd=password(?)";
    pool.query(sql,[data.aname,data.apwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            var aid=result[0].aid;
            var sql="update xfn_admin set apwd=password(?) where aid=?";
            pool.query(sql,[data.newpwd,aid],(err,result)=>{
                if(err) throw err;
                if(result.changedRows==1)
                res.send({code:200,msg:"修改成功",data:result});
                else{
                    res.send({code:401,msg:"密码未被修改",data:result});
                }
            })
        }else{
            res.send({code:400,msg:"用户名或密码错误",data:result});
        }
    })
 })