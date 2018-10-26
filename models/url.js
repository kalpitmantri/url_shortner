const mongoose = require('mongoose');
const Joi = require('joi');
const Joigoose = require('joigoose')(mongoose);

const schema = Joi.object().keys({
    name: Joi.string().token().min(5).max(100).required(),
   	url: Joi.string().uri({
   		scheme:[
   			/https?/
   		]
   	})
}).with('name', 'url')

var urlSchema = new mongoose.Schema(Joigoose.convert(schema));

const urlDetails = mongoose.model('urlDetails',urlSchema);

async function create(almostShort){
	var result = Joi.validate(almostShort,schema);
	if(result.error === null){
		// var foundName = await find(almostShort.name);
		await urlDetails.findOne({name:almostShort.name},(err,findResult)=>{
			if(err){
				console.log("ERROR OCCURRED!!");
				console.log(err);
			}
			else{
				foundName = findResult;
			}
		});

		if(foundName == null){
			var final = new urlDetails(almostShort);
			final.save();
			return final;
		}
		else{
			return Promise.reject({
				isJoi:true,
				details:[{
					message:'Name is already in Use!'
				}]
			});
		}
	}
	else{
		return result;
	}
}

module.exports = {
	create,
	urlDetails
}