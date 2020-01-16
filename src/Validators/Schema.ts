export const userSchema = {
	properties: {
		username: { type: "string" },
		email: { type: "string", format: "email" },
		password: { type: "string", minLength: 8 }
	},
	required: ["username", "email", "password"]
	// additionalProperties: false
};
