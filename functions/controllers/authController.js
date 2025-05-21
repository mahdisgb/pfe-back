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

        await db.sequelize.transaction(async (t) => {
            const user = await db.User.create({
                lastName: lastName, 
                firstName: firstName, 
                email: email, 
                hashedPassword: hashedPassword, 
                password: password,
                status: role === 'professor' ? 'pending' : 'active'
            }, { transaction: t });

            const userRole = await db.Role.findOne({ where: { name: role } });
           const result = await user.addRole(userRole, { transaction: t });

            if (role === 'professor') {
                await db.ProfessorRequest.create({
                    userId: user.id,
                    status: 'pending',
                    reason: req.body.reason || null
                }, { transaction: t });
            }
            const token = generateToken(user.dataValues);
            res.status(200).json({
                message: "User registered successfully", 
                data: {
                    user: {
                        id: user.id,
                        lastName: user.lastName,
                        firstName: user.firstName,
                        email: user.email,
                        roles: [userRole.name],
                        status:user.status
                    },
                    token
                }
            });
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
                attributes: ["id", "firstName", "lastName", "email", "hashedPassword","status"],
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
                        roles: roles.map(role => role.name),
                        status:user.status

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

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, currentPassword, newPassword } = req.body;

        const user = await db.User.findOne({
            where: { id },
            attributes: ['id', 'firstName', 'lastName', 'email', 'hashedPassword']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If password update is requested
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
            if (!isMatch) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.hashedPassword = hashedPassword;
            user.password = newPassword;
        }

        // Update other fields if provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) {
            // Check if email is already taken by another user
            const existingUser = await db.User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken' });
            }
            user.email = email;
        }

        await user.save();

        // Get updated user with roles
        const updatedUser = await db.User.findOne({
            where: { id },
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [{
                model: db.Role,
                attributes: ['name'],
                through: { attributes: [] }
            }]
        });
        const token = generateToken(updatedUser.dataValues);

        res.json({
            message: 'User updated successfully',
            data: {
            user: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                roles: updatedUser.Roles.map(role => role.name)
            },
            token
        }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user details' });
    }
};

const getAllNonAdminUsers = async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
            include: [{
                model: db.Role,
                attributes: ['name'],
                through: { attributes: [] },
                where: {
                    name: {
                        [Op.ne]: 'admin'
                    }
                }
            }],
            where: {
                '$Roles.name$': {
                    [Op.ne]: 'admin'
                }
            }
        });

        const formattedUsers = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            status: user.status,
            roles: user.Roles.map(role => role.name)
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await db.User.findOne({
            where: { id },
            include: [{
                model: db.Role,
                attributes: ['name'],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is admin
        const isAdmin = user.Roles.some(role => role.name === 'admin');
        if (isAdmin) {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        // Check if user is professor and delete their courses
        const isProfessor = user.Roles.some(role => role.name === 'professor');
        if (isProfessor) {
            const hasCourses = await db.Course.findOne({ where: { professorId: id } });
            if (hasCourses) {
                // Delete all lessons for these courses first
                const courses = await db.Course.findAll({ where: { professorId: id } });
                for (const course of courses) {
                    await db.Lesson.destroy({ where: { courseId: course.id } });
                }
                // Then delete the courses
                await db.Course.destroy({ where: { professorId: id } });
            }
        }
        
        // Check and delete course subscriptions
        const hasSubscriptions = await db.CourseSubscription.findOne({ where: { userId: id } });
        if (hasSubscriptions) {
            await db.CourseSubscription.destroy({ where: { userId: id } });
        }

        // Check and delete professor requests
        const hasRequests = await db.ProfessorRequest.findOne({ where: { userId: id } });
        if (hasRequests) {
            await db.ProfessorRequest.destroy({ where: { userId: id } });
        }

        // Check and delete comments
        const hasComments = await db.Comment.findOne({ where: { userId: id } });
        if (hasComments) {
            await db.Comment.destroy({ where: { userId: id } });
        }

        // Check and delete messages
        const hasMessages = await db.Message.findOne({ where: { userId: id } });
        if (hasMessages) {
            await db.Message.destroy({ where: { userId: id } });
        }

        // Finally delete the user
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = {
    // registerUser,
    // loginUser,
    getProfile,
    register,
    login,
    logout,
    getUserById,
    updateUser,
    getAllNonAdminUsers,
    deleteUser
}
