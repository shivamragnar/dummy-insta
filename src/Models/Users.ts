module.exports = (sequalize: any, type: any) => {
	return sequalize.define("users", {
		username: { type: type.STRING },
		email: { type: type.STRING },
		password: { type: type.STRING },
		acc_type: { type: type.STRING }
	});
};
