const { Router } = require("express");
const bcrypt = require("bcrypt");

import { Users } from "../Sequalize";
import { userSchema } from "../Validators/Schema";
import { isAlreadyLoggedIn } from "../Middlewares/AuthMiddleware";

import passport from "../passport-config";

const validator = require("../Validators/Validators");
const router = Router();

router.get("/", (req: any, res: any) =>
	res.send("Welcome inside Authentication")
);

router
	.route("/register")
	.post(isAlreadyLoggedIn, async (req: any, res: any) => {
		const status = validator(userSchema, req.body);
		if (status) {
			return res.status(400).send(status);
		}
		try {
			let existingUser = await Users.findOne({
				where: {
					email: req.body.email
				}
			});
			if (existingUser) {
				return res.status(400).json({
					message: "Email already registered"
				});
			}
			existingUser = await Users.findOne({
				where: {
					username: req.body.username
				}
			});
			if (existingUser) {
				return res.status(400).json({
					message: "Username taken"
				});
			}
			const hashPassword = await generateHashForPassword(
				req.body.password
			);
			const data = {
				email: req.body.email,
				username: req.body.username,
				password: hashPassword
			};
			const user = await Users.create(data);
			return res.status(201).json({
				message: "User created",
				username: user.username,
				email: user.email
			});
		} catch {
			return res.status(500).json({ message: "Internal Server Error" });
		}
	});

router
	.route("/login")
	.post(
		[isAlreadyLoggedIn, passport.authenticate("local")],
		(req: any, res: any) => {
			if (req.user) {
				res.status(200).json({
					message: "Successfully Logged in."
				});
			}
		}
	);

module.exports = router;

const generateHashForPassword = async (password: any) => {
	return await bcrypt.hash(password, 10);
};
