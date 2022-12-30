import express from "express";
const router = express.Router();

import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import db from "../models/index";

router.post(
    "/local",
    passport.authenticate("local", { session: false }),
    function (req, res, next) {
        const user: { id?: number } =
            typeof req.user === "undefined" ? {} : req.user;

        const secret: jwt.Secret | undefined = process.env.JWT_SECRET;
        const body = { id: user.id };
        const token = jwt.sign(
            body,
            typeof secret === "undefined" ? "" : secret,
            {
                expiresIn: "1d",
            }
        );
        res.json({ token });
    }
);

router.post(
    "/local/signup",
    body("username").exists().notEmpty().escape(),
    body("password")
        .exists()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("confirm-password")
        .exists()
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            throw new Error("Confirmed password and password must be the same");
        }),
    async function (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, password } = req.body;
            const [user, created] = await db.models.User.findOrCreate({
                where: {
                    username: username,
                },
                defaults: {
                    username: username,
                    password: await bcrypt.hash(password, 10),
                },
            });
            if (!created) {
                return res.json({
                    message: `Username: ${username} already exists`,
                });
            }
            return res.json({
                message: `You have successfully signed up as ${username}`,
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
