var bcrypt =require('bcryptjs');
var _=require('underscore');
var cryptojs =require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports =function(sequelize,DataTypes){
	//create a new model
	var user= sequelize.define('user',{
		email: {
			type:DataTypes.STRING,
			allowNull: false,
			unique:true,
			validate:{
				isEmail:true
			}
		},
		salt:{
			type:DataTypes.STRING,
		},
		password_hash:{
			type:DataTypes.STRING,
		},
		password:{
			type:DataTypes.VIRTUAL,
			allowNull:false,
			validate:{				//check validate in regex on sequelize
				len:[7,100],
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value,salt);

				this.setDataValue('password',value);
				this.setDataValue('salt',salt);

				this.setDataValue('password_hash',hashedPassword);
			}
		}
	},{
		hooks:{
			beforeValidate:function(user,options){
				//user.email
				if(typeof user.email ==='string')
					user.email=user.email.toLowerCase();
			}
		},
		instanceMethods:{
			toPublicJSON: function(){
				var json=this.toJSON();
				return _.pick(json,'email','id','createdAt','updatedAt');
			},
			generateToken :function(type){		//type of token to generate
				if(!_.isString(type)){
					return undefined;
				}

				try{		//encrypt users information and create new JSON web token
					var stringData=JSON.stringify({id:this.get('id'),type:type});
					var encryptedData=cryptojs.AES.encrypt(stringData,'abc123!@#!').toString();


					var token = jwt.sign({				
						token:encryptedData					//body for token, token = encrypted date
					},'qwerty098');							//jwt password

					return token;
				}catch(e){
					console.error(e);
					return undefined;
				}
			}
		},
		classMethods:{
			authenticate:function(body){
				return new Promise(function(resolve,reject){
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}
						resolve(user);
					}, function(e) {
							return reject();
					});
				});
			},
			findByToken:function(token){
				return new Promise(function(resolve,reject){
					try{
						var decodedJWT =jwt.verify(token,'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token,'abc123!@#!');
						var tokenData =JSON.parse(bytes.toString(cryptojs.enc.Utf8));//takes string JOSN and converts into javascript object
					
						user.findById(tokenData.id).then(function(user){
							if(user){
								resolve(user);
							}else{
								reject();
							}
						},function(){
							reject();
						})
					}catch(e){
						reject();
					}
				});
			}
		}
	});
	return user;
};


