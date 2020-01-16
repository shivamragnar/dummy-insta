module.exports = (sequelize: any, type: any) => {
	return sequelize.define("following", {
		user_id: { type: type.INTEGER },
		followed_id: { type: type.INTEGER }
	});
};
