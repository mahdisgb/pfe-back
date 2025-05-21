const db = require('../models');
const { Op } = require('sequelize');

exports.getAllFormations = async (req, res) => {
  try {
    const requestBody = req.query;
    if(Object.keys(requestBody).length === 0){
        const result = await db.Formation.findAll();
        res.json(result);
        return;
    }
    const filters = Object.keys(requestBody).filter(key => (
        key !== "_start" && key !== "_end" && key !== "_sort" && key !== "_order"
    ));
    const offset = Number(requestBody._start) || 0;
    const tableSize = await db.Formation.count();
    const limit = requestBody._end ? Number(requestBody._end) - offset : 10;
    // const limit = Number(requestBody._end)- offset;

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
    };

    if (requestBody._order && requestBody._sort) {
        queryOptions.order = [[requestBody._sort, requestBody._order.toUpperCase()]];
    }
    if (Object.keys(whereConditions).length > 0) {
        queryOptions.where = whereConditions;
    }

    const result = await db.Formation.findAll(queryOptions);
    return res.json(result);

} catch (error) {
    console.error("Error fetching formations:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
};

exports.createFormation = async (req, res) => {
  try {
    const formationData = { ...req.body };
    if (req.files && req.files.thumbnail) {
      formationData.thumbnail = req.files.thumbnail[0].path;
    }
    const formation = await db.Formation.create(formationData);
    res.status(201).json(formation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFormation = async (req, res) => {
  try {
    const formation = await db.Formation.findByPk(req.body.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }

    const updateData = { ...req.body };
    if (req.files && req.files.thumbnail) {
      updateData.thumbnail = req.files.thumbnail[0].path;
    }

    await formation.update(updateData);
    res.json(formation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFormation = async (req, res) => {
  try {
    const formation = await db.Formation.findByPk(req.body.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    await formation.destroy();
    res.json({ message: 'Formation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfessorFormations = async (req, res) => {
  try {
    const formations = await db.Formation.findAll({
      where: { professorId: req.params.professorId },
      // include: [
      //   // { model: db.Category, as: 'category' },
      //   { model: db.Lesson, as: 'lessons' }
      // ]
    });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFormation = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    const formation = await db.Formation.findByPk(id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    await formation.update({ isActive });
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchFormations = async (req, res) => {
  try {
    const { query, categoryId, location } = req.query;
    const where = {};

    if (query) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    const formations = await db.Formation.findAll({
      where,
      // include: [
      //   // { model: db.Category, as: 'category' },
      //   { model: db.User, as: 'professor' }
      // ]
    });

    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFormationById = async (req, res) => {
  try {
    const formation = await db.Formation.findByPk(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 