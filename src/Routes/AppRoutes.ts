const { Router } = require("express");
const router = Router();

import { Users, Following, Relationship } from "../Sequalize";

router.get("/", (req: any, res: any) => res.send("Welcome inside Application"));

router.route("/follow").post(async (req: any, res: any) => {
	try {
		let toFollowUser = await Users.findOne({ where: { id: req.body.id } });
		if (!toFollowUser) {
			return res.status(400).json({
				error: "Bad Request"
			});
		}
		const requestStatus = toFollowUser.acc_type === "private" ? 0 : 2;
		const data = {
			from_id: req.user.id,
			to_id: req.body.id,
			status: requestStatus
		};
		const followed = await Relationship.create(data);
		return res.status(200).json({
			message: "Request sent",
			followed
		});
	} catch {
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/unfollow").put(async (req: any, res: any) => {
	try {
		const deletedRelationship = await Relationship.delete({
			where: { from_id: req.user.id, to_id: req.body.to_id }
		});
		res.status(200).json({
			message: "Successfull Unfollow"
		});
	} catch {
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/my/:type").get(async (req: any, res: any) => {
	try {
		const { type } = req.params;
		const followings = await Relationship.findAll({
			where: {
				[type === "following" ? "from_id" : "to_id"]: req.user.id,
				status: 2
			},
			attributes: ["id", "status"],
			include: [
				{
					model: Users,
					as: `user_${type}_detail`,
					attributes: ["id", "username", "email", "acc_type"]
				}
			]
		});

		res.status(200).json(followings);
	} catch (err) {
		console.log(err);
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/pending-requests").get(async (req: any, res: any) => {
	try {
		const pendingRequests = await Relationship.findAll({
			where: { to_id: req.user.id, status: 0 }
		});
		res.status(200).json(pendingRequests);
	} catch {
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/update-request-status").put(async (req: any, res: any) => {
	try {
		const pendingRequests = await Relationship.update(
			{ status: req.body.status },
			{
				where: { id: req.body.id }
			}
		);
		res.status(200).json(pendingRequests);
	} catch {
		return res.status(500).send("Internal Server Error");
	}
});

router.route("/profile").get(async (req: any, res: any) => {
	try {
		const attributes = ["id", "username", "email", "acc_type"];

		const user_detail = await Users.findOne({
			where: { id: req.user.id },
			attributes,
			include: [
				{
					model: Relationship,
					as: "following",
					attributes: ["id", "createdAt", "updatedAt"],
					include: [
						{
							model: Users,
							as: "user_following_detail",
							attributes
						}
					]
				},
				{
					model: Relationship,
					as: "followers",
					include: [
						{
							model: Users,
							as: "user_followers_detail",
							attributes
						}
					]
				}
			]
		});
		return res.status(200).json(user_detail);
	} catch {
		return res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
