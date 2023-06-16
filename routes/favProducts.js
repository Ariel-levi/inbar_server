const express = require("express");
const { auth } = require("../middlewares/auth");
const { ProductModel } = require("../models/productsModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();


router.get("/", auth, async(req, res) => {
    try {
        let user = await UserModel.findOne({_id:req.tokenData._id})
        res.json({favs_ar:user.favs_ar})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

router.get("/productsInfo", auth, async(req, res) => {
    try {
        let user = await UserModel.findOne({_id:req.tokenData._id})
        let favs_ar = user.favs_ar
        let data = await ProductModel.find({short_id:{$in:favs_ar}})
        res.json(data)
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

router.patch("/add_remove/:prodId", auth, async(req, res) => {
    try {
        let prodId = req.params.prodId
        //get current favs_ar from user
        let user = await UserModel.findOne({ _id:req.tokenData._id })
        let favs_ar = user.favs_ar
        let inFavs = false
        console.log(favs_ar);
        if (favs_ar.includes(prodId)) {
            //remove the product form favorites list
            favs_ar = favs_ar.filter(short_id => short_id != prodId)
        }
        else{
            //add to array's start
            favs_ar.unshift(prodId)
            //limit to 40 items
            favs_ar.splice(40, favs_ar.length)
            inFavs = true
            
        }
        let data = await UserModel.updateOne({_id:req.tokenData._id}, {favs_ar:favs_ar})
        data.inFavs = inFavs
        res.json(data)
    } catch (error) {
        res.status(500).json({msg:error})
        
    }
})

module.exports = router;