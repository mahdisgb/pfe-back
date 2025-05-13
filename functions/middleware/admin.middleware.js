const db = require('../models');

const adminMiddleware = async (req, res, next) => {
    try {
        console.log(req.user)
        const userId = req.user.id;
        const user = await db.User.findByPk(userId, {
            include: [{
                model: db.Role,
                through: 'UserRoles',
                where: { name: 'admin' }
            }]
        });

        if (!user || user.Roles.length === 0) {
            return res.status(403).json({ 
                error: 'Unauthorized',
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = adminMiddleware; 