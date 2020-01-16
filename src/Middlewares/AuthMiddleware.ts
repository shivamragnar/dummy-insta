export const isAlreadyLoggedIn = (req: any, res: any, next: any) => {
	if (req.user) {
		return res.status(400).json({
			message: "Already logged in"
		});
	}
	return next();
};

export const isAuthenticated = (req: any, res: any, next: any) => {
	if (req.user) {
		return next();
	}
	return res.status(401).json({ message: "User unauthorised" });
};
