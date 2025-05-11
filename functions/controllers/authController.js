const db = require("../models");
const UserModel = require("../models/UserModel");
const RoleModel = require("../models/RoleModel");
const { Op, where } = require("sequelize");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// const registerUser = async (req, res) => {
//     try {
//         const requestBody = req.body
//         // const hashedPassword = await hashPassword(password)
//         const user = await UserModel(db.sequelize).create(requestBody)
//         res.status(200).json(user);
//         return
//     } catch (err) {
//         res.status(500).json({ message: "error", err });
//         console.log(err)
//     }
// }
// const loginUser = async (req, res) => {
//     try {
//         const requestBody = req.body

//         const user = await UserModel(db.sequelize).findAll({ attributes: ["id", "name", "email"], where: { ...requestBody } });
//         if (!user) {
//             res.status(500).json({ error: 'no user found' })
//             return;
//         }
//         /* const match = await comparePassword(password, user.password)
//          if (match) {
//              jwt.sign({ email: user.email, id: user._id, name: user.name },
//                  process.env.JWT_SECRET,
//                  {},
//                  (err, token) => {
//                      if (err) throw err;
//                      res.cookie('token', token).json(user)
//                  })
//          }
//          if (!match) {
//              res.json({ error: "didnt work" })
//          }*/
//         res.status(200).json(user);
//         return;
//     } catch (err) {
//         console.log(err)
//     }
// }
const getProfile = async (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    } else {
        res.json(null)
    }

}



// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
};

// Register Controller
const register = async (req, res) => {
    try {
        const { lastName, firstName, email, password, role } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const exist = await db.User
            .findAll({
                where: {
                    [Op.or]: [{ email: email }]
                }
            });
        if (exist.length > 0) {
            res.status(500).json({ error: "user already exist" })
            return;
        }
        const user = await db.User.create({
            lastName: lastName, firstName: firstName, email: email, hashedPassword: hashedPassword, password: password
        });
        const userRole = await db.Role.findOne({ where: { name: role } });
        await user.addRole(userRole);
        const token = generateToken(user.dataValues);
        res.status(200).json({
            message: "User registered successfully", data:
            {
                user:
                {
                    id: user.id,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    email: user.email,
                    role: user.role
                }
                , token
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, error: error.message });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.User
            .findOne({
                attributes: ["id", "firstName", "lastName", "email", "hashedPassword"],
                where: {
                    email: email,
                }
            });
        if (!user) {
            res.status(500).json({ error: "user not found" })
            return;
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const roles = await user.getRoles()
        const token = generateToken(user.dataValues);
        res
            .cookie("token", token, {
                httpOnly: true, // Prevents XSS attacks
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            })
            .json({
                message: "Login successful", data: {
                    user:
                    {
                        id: user.id,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        email: user.email,
                        role: roles.map(role => role.name)
                    }
                    , token
                }
            });
    } catch (error) {
        res.status(500).json({ message: error.message, error: error.message });
    }
};

// Logout Controller
const logout = (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
};

// Middleware to Protect Routes
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = decoded;
        next();
    });
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.User.findOne({
            where: { id },
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
                model: db.Role,
                attributes: ['name'],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.Roles.map(role => role.name)
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user details' });
    }
};

module.exports = {
    // registerUser,
    // loginUser,
    getProfile,
    register,
    login,
    logout,
    getUserById
}
