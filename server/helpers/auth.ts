import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import db from "../models/index";

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            session: false,
        },
        async function (username, password, done) {
            try {
                const user = await db.models.User.findOne({
                    where: {
                        username: username,
                    },
                });
                if (user === null) {
                    return done(null, false);
                }
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    return done(null, user.dataValues);
                }
                return done(null, false);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (payload, done) {
            try {
                const user = await db.models.User.findByPk(payload.id);
                if (!user) {
                    return done(null, false);
                }
                return done(null, payload);
            } catch (err) {
                done(err);
            }
        }
    )
);
