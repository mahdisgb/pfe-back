const db = require("../models");
const { Op } = require("sequelize");

const globalSearch = async (req, res) => {
    try {
        const { query, type } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const searchConditions = {
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } }
            ]
        };

        let results = {
            courses: [],
            lessons: []
        };

        // Search courses if type is not specified or type is 'course'
        if (!type || type === 'course') {
            const courses = await db.Course.findAll({
                where: searchConditions,
                attributes: ["id", "title", "description", "categoryId", "lessonCount", "thumbnail", "isActive", "price"],
                include: [
                    { model: db.Category, as: 'category', attributes: ['name'] },
                    { model: db.User, as: 'professor', attributes: ['firstName', 'lastName'] }
                ]
            });
            results.courses = courses;
        }

        // Search lessons if type is not specified or type is 'lesson'
        if (!type || type === 'lesson') {
            const lessons = await db.Lesson.findAll({
                where: searchConditions,
                attributes: ["id", "title", "description", "videoUrl", "thumbnailUrl", "duration", "courseId", "professorId", "order", "status", "difficulty", "views", "averageRating", "totalRatings", "isActive"],
                include: [
                    { model: db.Course, as: 'course', attributes: ['title'] },
                    { model: db.User, as: 'professor', attributes: ['firstName', 'lastName'] }
                ]
            });
            results.lessons = lessons;
        }

        res.json(results);
    } catch (error) {
        console.error("Error performing global search:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    globalSearch
};