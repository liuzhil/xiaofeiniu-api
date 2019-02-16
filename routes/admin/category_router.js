/*
*菜品类别相关路由
*/
const express = require("express");
const pool = require("../../pool");
var router = express.Router();
module.exports = router;

/**
 * API  GET/admin/category
 * 含义：客户端获取所有的菜品类别，按编号升序排列
 * 返回值：[{code:1,cname:"..."},{...}]
 */
router.get("/", (req, res) => {
    var sql = "select * from xfn_category order by cid";
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send({ code: 1, data: result });
    })
})

/**
 * API:DELETE/admin/category/:cid
 * 含义：根据表示菜单编号的路由参数,删除该菜品
 * 返回值：
 * {code:200,msg:"修改1条数据"}
 * {code:400,msg:"修改0条数据"}
 *
 */
router.delete("/:cid", (req, res) => {
    //注意：删除菜品类别前必须先把属于该类别的菜品的类别编号设为null
    var sql = "update xfn_dish set categoryId=null where categoryId=?";
    pool.query(sql, req.params.cid, (err, result) => {
        if (err) throw err;
        var sql = "delete from xfn_category where cid=?"
        pool.query(sql, req.params.cid, (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send({ code: 200, msg: "删除1条数据" })
            } else {
                res.send({ code: 400, msg: "没有数据被修改" })
            }
        })
    })
})

/**
 * API POST/admin/category
 * 请求参数:{cname:"xxx"}
 * 含义：添加新的菜品类型
 * 返回值
 * {code:200,msg:"添加成功",cid:x}
 */
router.post("/", (req, res) => {
    var data = req.body;
    var sql = "select cname from xfn_category "
    pool.query(sql, (err, result) => {
        if (err) throw err;
        if (data = result) {
            res.send({ code: 401, msg: "菜品已存在" })
            return
        }
        var sql = "insert into xfn_category set ?"
        pool.query(sql, data, (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0)
                res.send({ code: 200, msg: "添加数据成功", data: result })  
        })
    })
})

/**
 * API PUT/admin/category
 * 请求参数：{code:xx,cname:"xxx"}
 * 含义：根据菜品类别编号修改该类别
 * 返回值：{code:200,msg:"修改了1条数据"}
 *         {code:400,msg:"数据不存在"}
 *          {code:401,msg:"数据未被修改"}  
 */
router.put("/",(req,res)=>{
    var data=req.body;
    var sql="update xfn_category set ?  where cid=?"
    pool.query(sql,[data,data.cid],(err,result)=>{
        if(err) throw err;
        if(result.changedRows>0)
        res.send({code:200,msg:"修改成功",data:result})
        else if(result.affectedRows==0)
        res.send({code:400,msg:"数据不存在",data:result})
        else if(result.affectedRows==1&&result.changedRows==0)
        res.send({code:401,msg:"数据未被修改",data:result})
    })
})