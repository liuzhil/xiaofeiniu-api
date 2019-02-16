const express=require("express");
const pool=require("../../pool");
var router=express.Router();
module.exports=router;

/**
 * API get/admin/dish
 * 列出所有菜品(按类别进行分类)
 * 返回值：[
 * {cname:"肉类",dishList:[{},{},{}]},
 * {cname:"蔬菜",dishList:[{},{},{}]}]
 */

 router.get("/",(req,res)=>{
     //查询所有菜品类别(肉类，蔬菜...)
     var sql="select cid,cname from xfn_category";
     pool.query(sql,(err,result)=>{
         if(err) throw err;
        var categoryList=result;
        var count=0;
        for(let category of categoryList){
            var sql="select * from xfn_dish where categoryId=?";
            pool.query(sql,category.cid,(err,result)=>{
                if(err) throw err;
                category.dishList=result;
                count++;
                if(count==categoryList.length)
                res.send(categoryList)
            })
        }
     })
 })

 /**
  * API post/admin/dish/image 
  * 接收客户端上传的图片保存在服务器上，返回图片在服务器上随机文件名
  * 返回值：{code:200,msg:"上传成功"}
  * {code:400,msg:""}
  */
 const multer=require("multer")
 const fs=require("fs")
 var upload=multer({dest:'tmp/'})
 router.post("/image",upload.single('dishImg'),(req,res)=>{
    console.log(req.file);//客户端上传的图片
    console.log(req.body);//客户端随同图片提交的字符数据
    var tmpFile=req.file.path;
    var suffix=req.file.originalname.substring//后缀名(req.file.originalname.lastIndexOf("."));
    var newFileName='img/dish/'+randFileName(suffix);
    fs.rename(tmpFile,newFileName,()=>{
        res.send({code:200,msg:"上传成功",newFile:suffix})
    })
 })

 //生成随机文件名
 function randFileName(suffix){
    var time=new Date().getTime()
    var num=Math.random()*9000+1000;
    num=Math.floor(num);
    return time+'-'+num+suffix;
 }

 /**
  * API post/admin/dish
  * 请求参数：{title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',categoryId:xx}
  * 添加一个新的菜品
  * 返回值
  * {code:200,msg:'dish added succ',dishId:46}
  */
router.post("/",(req,res)=>{
    var data=req.body;
    var sql="insert into xfn_dish set ?"
    pool.query(sql,data,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:'dish added succ',dishId:result.insertId})//将insert语句产生的自增编号输出给客户端
    })
})

  /**
   * DELETE /admin/dish/:did
   * 根据指定的菜品编号删除该菜品
   * 返回值
   * {code:200,msg:'dish deleted succ'}
   * {code:400,msg:'dish not exists'}
   */
router.delete("/:did",(req,res)=>{
    var did=req.params.did;
    var sql="delete from xfn_dish where did=?"
    pool.query(sql,did,(err,result)=>{
        if(err)throw err;
        if(did){
            res.send({code:200,msg:'dish deleted succ'})
        }else{
            res.send({code:400,msg:'dish not exists'})
        }
    })
})



   /**
    * PUT /admin/dish
    * 请求参数：{did:xx,title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',categoryId:xx}
    * 根据指定的菜品编号修改菜品
    * 返回值:{code:200,msg:'dish updated succ'}
    * {code:400,msg:'dish not exists'}
    */
   router.put('/',(req,res)=>{
       var data=req.body;
       var sql="update xfn_dish set ? where did=?"
       pool.query(sql,[data,data.did],(err,result)=>{
           if(err)throw err;
           if(data.did){
               res.send({code:200,msg:'dis updated succ'})
           }else{
               res.send({code:400,msg:'dish not exists'})
           }
       })
   })