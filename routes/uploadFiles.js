const express = require("express");
const router = express.Router();
const path = express.Router()

router.get("/", (req,res) => {
  res.json({msg:"upload files work.js "})

})
router.post("/" , async (req, res) => {
    let fileInfo = req.files?.myFile
    console.log(fileInfo);
    if(!fileInfo){
        return res.status(400).json({msg:"you need to send a file"})
    }
    //check the file's size
    if(fileInfo.size> 1024*1024*5){
        return res.status(400).jsonp({err_msg:"file size too large"})
        
    }
    //check the file's extention
    let exta_ar = [".jpg", ".png", ".jpeg", ".gif", ".svg"]
    fileInfo.ext = path.extname(fileInfo.name)
    if(!exta_ar.includes(fileInfo.ext)){
        return res.status(400).json({err_msg: "file's type is not supported0"})
    } 
    //mv- upload files
    fileInfo.mv("public/images/" +fileInfo.name, (err)=>{
        if(err){
            console.log(err);
            return res.status(400).jsonp({err_msg:"error"})
        }
        res.json({msg:"start upload files"})
    })
  })
module.exports = router;