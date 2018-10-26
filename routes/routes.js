var express = require('express');
var router = express.Router();
var url = require('../models/url')

/* GET home page. */
router.get('/', function(req, res, next) {
  var name;
  var success=false;
  var error;
  res.render('index', {name: name,success:success,Myerror:error});
});

router.get('/:name',async(req,res)=>{
	var found;
	await url.urlDetails.findOne({name:req.params.name},(err,findResult)=>{
		if(err){
				console.log("ERROR OCCURRED!!");
				console.log(err);
			}
			else{
				found = findResult;
			}
	});

	if(found != null){
		res.redirect(found.url);
	}
	else{
		res.render('404',{name:req.params.name});
	}
});

router.post('/api/shorten',async (req,res)=>{
	var Myerror;
	var name;
	var success=false;
	try{
		const newUrl = await url.create(req.body);
		success = true;
		name = newUrl.name;
	}catch(error){
		res.status(500);
		Myerror = error.details.map(detail=>detail.message).join('. ');
	}
	res.render('index',{name:name,success:success,Myerror:Myerror});
});


module.exports = router;