module.exports =function(sequelize,DataTypes){
	//create a new model
	return sequelize.define('user',{
		email: {
			type:DataTypes.STRING,
			allowNull: false,
			unique:true,
			validate:{
				isEmail:true
			}
		},
		password:{
			type:DataTypes.STRING,
			allowNull:false,
			validate:{				//check validate in regex on sequelize
				len:[7,100],
			}
		}
	},{
		hooks:{
			beforeValidate:function(user,options){
				//user.email
				if(typeof user.email ==='string')
					user.email=user.email.toLowerCase();
			}
		}
	});
}