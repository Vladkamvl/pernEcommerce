require('dotenv').config()
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {Basket} = require("../models/models");
const {User} = require("../models/models");

const generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
            expiresIn: '24h',

        }
    );
}

class UserController{
    async registration(req, res, next){
        const {email, password, role} = req.body;
        if(!email || !password){
            return next(ApiError.badRequest('Email or password is invalid'));
        }
        const candidate = await User.findOne({
            where: {
                email,
            },
        });
        if(candidate){
            return next(ApiError.badRequest('Email is already in use'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email,
            role,
            password: hashPassword,
        });

        const basket = await Basket.create({
            userId: user.id,
        });

        const token = generateToken(
            {
            id: user.id,
            email: user.email,
            role: user.role,
            }
        );

        return res.json({token});

    }
    async login(req, res, next){
        const {email, password} = req.query;
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if(!user){
            return next(ApiError.badRequest('Email not found'));
        }
        if(!bcrypt.compareSync(password, user.password)){
            return next(ApiError.badRequest('Email or password is invalid'));
        }

        const token = generateToken(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        );

        return res.json({token});
    }
    async check(req, res){
        const token = generateToken(req.user);
        return res.json({token});
    }
}

module.exports = new UserController();