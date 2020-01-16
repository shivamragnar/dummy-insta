const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");
const expressSession = require("express-session");

const AuthRoutes = require("./Routes/AuthRoutes");
const AppRoutes = require("./Routes/AppRoutes");

import { isAuthenticated } from "./Middlewares/AuthMiddleware";

const app = express();

app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

app.use(
	expressSession({
		name: "Instagram",
		secret: "hey",
		cookie: { maxAge: 1000 * 60 * 15 }
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", AuthRoutes);
app.use("/api", isAuthenticated, AppRoutes);

app.listen(3000, () => {
	console.log("..............Now Listening on 3000...............");
});
