const { random } = require("lodash")
exports.genShortId = async(_model) => {

    let flag = true; // will become false if not found short_id = rnd
    // check if there no category with rnd = short_id;
    let rnd;
    while(flag){
      rnd = random(0,999999)
      try{
        let data = await _model.findOne({short_id:rnd})
        if(!data){
          flag = false;
        }
      }
      catch(err){
        console.log(err);
        flag = false;
        return res.status(500).json(err);
      }
    }
    return rnd;
  }