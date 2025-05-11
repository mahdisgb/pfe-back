/*module.exports = ({
    User,
    Student,
    MinorStudent,
    Professor,
    Training,
    LocalTraining,
    Course,
    Comment,
    Category,
    Payment,
    Invoice,
    Card
  }) => {
    // 👤 User has one Student or one Professor
    Student.belongsTo(User, { foreignKey: 'userId' });
    Professor.belongsTo(User, { foreignKey: 'userId' });
  
    // 👶 MinorStudent belongs to a Student
    MinorStudent.belongsTo(Student, { foreignKey: 'studentId' });
  
    // 📚 Professor creates many Trainings
    Training.belongsTo(Professor, { foreignKey: 'professorId' });
    Professor.hasMany(Training, { foreignKey: 'professorId' });
  
    // 📌 Training has many Courses
    Course.belongsTo(Training, { foreignKey: 'trainingId' });
    Training.hasMany(Course, { foreignKey: 'trainingId' });
  
    // 🧠 LocalTraining is a type of Training (1:1)
    LocalTraining.belongsTo(Training, { foreignKey: 'trainingId' });
    Training.hasOne(LocalTraining, { foreignKey: 'trainingId' });
  
    // 💬 Comment belongs to a Student and a Training
    Comment.belongsTo(Student, { foreignKey: 'authorId' });
    Comment.belongsTo(Training, { foreignKey: 'trainingId' });
    Training.hasMany(Comment, { foreignKey: 'trainingId' });
  
    // 🗂 Category has many Trainings
    Training.belongsTo(Category, { foreignKey: 'category' }); // Assuming category is a FK string
    Category.hasMany(Training, { foreignKey: 'category' });
  
    // 💳 Payment belongs to a Student
    Payment.belongsTo(Student, { foreignKey: 'studentId' });
    Student.hasMany(Payment, { foreignKey: 'studentId' });
  
    // 🧾 Invoice belongs to Payment
    Invoice.belongsTo(Payment, { foreignKey: 'paymentId' });
    Payment.hasOne(Invoice, { foreignKey: 'paymentId' });
  
    // 🪪 Card belongs to Student (assumed)
    Card.belongsTo(Student, { foreignKey: 'studentId' });
    Student.hasMany(Card, { foreignKey: 'studentId' });
  
    // 📘 Student <-> Training (many-to-many through StudentTraining)
    Student.belongsToMany(Training, {
      through: 'StudentTraining',
      foreignKey: 'studentId'
    });
    Training.belongsToMany(Student, {
      through: 'StudentTraining',
      foreignKey: 'trainingId'
    });
  };
*/  

module.exports = (db) => {
  const { User, Role, UserRole } = db;

  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId'
  });

  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId'
  });
};
