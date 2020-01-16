const AJV = require("ajv");

const ajv = new AJV({ allErrors: true });

module.exports = (schema: any, data: any) => {
	const validate = ajv.compile(schema);

	const validityStatus = validate(data);
	if (validityStatus) {
		return false;
	}

	return validate.errors;
};
