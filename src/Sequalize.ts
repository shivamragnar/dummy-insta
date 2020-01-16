const Sequelize = require("sequelize");
const UserModel = require("./Models/Users");
const FollowingModel = require("./Models/Following");
const RelationshipModel = require("./Models/Relationship");

const sequelize = new Sequelize("instagram", "root", "shivam123", {
	host: "localhost",
	port: 3306,
	dialect: "mysql"
});

export const Users = UserModel(sequelize, Sequelize);
export const Following = FollowingModel(sequelize, Sequelize);
export const Relationship = RelationshipModel(sequelize, Sequelize);

Users.hasMany(Relationship, { foreignKey: "to_id", as: "followers" });
Users.hasMany(Relationship, { foreignKey: "from_id", as: "following" });

Relationship.belongsTo(Users, {
	foreignKey: "to_id",
	as: "user_following_detail"
});
Relationship.belongsTo(Users, {
	foreignKey: "from_id",
	as: "user_followers_detail"
});

// Users.belongsToMany(Users, {
// 	through: Following,
// 	as: "followings",
// 	foreignKey: "user_id",
// 	otherKey: "followed_id"
// });

sequelize
	.sync()
	.then(() => console.log("Database and tables done"))
	.catch(() => console.log("Some error in database"));
