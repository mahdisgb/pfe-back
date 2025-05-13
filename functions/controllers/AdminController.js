const db = require('../models');
const { Op } = require('sequelize');
const transporter = require('../config/smtp');

const getProfessorRequests = async (req, res) => {
    try {
        const requestBody = req.query;
        if(Object.keys(requestBody).length === 0){
            const result = await db.ProfessorRequest.findAll({ 
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.json(result);
            return;
        }

        const filters = Object.keys(requestBody).filter(key => (
            key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
        ));
        const offset = Number(requestBody._start) || 0;
        const query = await db.sequelize.query(`show table status from inventory_management;`);
        const tableSize = Number(query[0].filter(item => item.name = "ProfessorRequests")[0].Rows)
        const limit = requestBody._end == 10 ? tableSize : Number(requestBody._end) - offset;

        let whereConditions = {};
        filters.forEach(key => {
            if (!key.includes("_like")) {
                whereConditions[key] = requestBody[key];
            } else {
                const likeKey = key.replace("_like", "");
                if(requestBody[key]){
                    whereConditions[likeKey] = { [Op.like]: `%${requestBody[key]}%` }
                }
            }
        });

        let queryOptions = { 
            offset, 
            limit,
            where: whereConditions,
            include: [{
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        };

        if (requestBody._order && requestBody._sort) {
            queryOptions.order = [[requestBody._sort, requestBody._order.toUpperCase()]];
        } else {
            queryOptions.order = [['createdAt', 'DESC']];
        }

        const result = await db.ProfessorRequest.findAll(queryOptions);
        res.json(result);

    } catch (error) {
        console.error('Error fetching professor requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handleProfessorRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, adminNotes } = req.body;

        const request = await db.ProfessorRequest.findByPk(requestId, {
            include: [{
                model: db.User,
                as: 'user'
            }]
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request already processed' });
        }

        await db.sequelize.transaction(async (t) => {
            // Update request status
            await request.update({
                status,
                adminNotes
            }, { transaction: t });

            if (status === 'approved') {
                // Update user status and add professor role
                const professorRole = await db.Role.findOne({
                    where: { name: 'professor' }
                });

                await request.user.update({
                    status: 'active'
                }, { transaction: t });

                await request.user.addRole(professorRole, { transaction: t });

                // Send approval email
                const approvalSubject = 'Professor Request Approved';
                const approvalText = `Dear ${request.user.firstName} ${request.user.lastName},\n\n` +
                    `Your professor request has been approved. You can now log in to your account and start creating courses.\n\n` +
                    `Admin Notes: ${adminNotes || 'No additional notes'}\n\n` +
                    `Best regards,\nThe Admin Team`;

                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: request.user.email,
                    subject: approvalSubject,
                    text: approvalText
                });
            } else if (status === 'rejected') {
                await request.user.update({
                    status: 'inactive'
                }, { transaction: t });

                // Send rejection email
                const rejectionSubject = 'Professor Request Status Update';
                const rejectionText = `Dear ${request.user.firstName} ${request.user.lastName},\n\n` +
                    `We regret to inform you that your professor request has been rejected.\n\n` +
                    `Admin Notes: ${adminNotes || 'No additional notes'}\n\n` +
                    `If you have any questions, please contact our support team.\n\n` +
                    `Best regards,\nThe Admin Team`;

                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: request.user.email,
                    subject: rejectionSubject,
                    text: rejectionText
                });
            }
        });

        res.json({ message: 'Request processed successfully' });
    } catch (error) {
        console.error('Error handling professor request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getProfessorRequests,
    handleProfessorRequest
}; 