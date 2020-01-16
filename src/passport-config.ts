const passport = require("passport");
const LocalStrategy = require("passport-local");

const bcrypt = require("bcrypt");

import { Users } from "./Sequalize";

passport.serializeUser((user: any, done: Function) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: number, done: Function) => {
	let user = await Users.findOne({ where: { id: id } });
	if (!user) {
		done(true, null);
	}
	done(null, { id: user.id, username: user.username });
});

passport.use(
	new LocalStrategy(
		async (username: string, password: string, done: Function) => {
			try {
				let user = await Users.findOne({
					where: {
						username
					}
				});
				if (!user) {
					return done(null, false, {
						message: "No such user exists. Incorrect username"
					});
				}
				let userPassword = user.password;
				if (!(await checkValidPassword(password, userPassword))) {
					return done(null, false, { message: "Wrong Password" });
				}
				return done(null, user);
			} catch {
				return done(true, null, {
					error: "Something wrong with Login"
				});
			}
		}
	)
);

const checkValidPassword = async (password: string, userPassword: string) => {
	return await bcrypt.compare(password, userPassword);
};

export default passport;
