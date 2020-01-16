module.exports = (sequelize: any, type: any) => {
	return sequelize.define("relationship", {
		from_id: { type: type.INTEGER },
		to_id: { type: type.INTEGER },
		status: { type: type.INTEGER }
	});
};
