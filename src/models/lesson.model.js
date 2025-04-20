const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  videoBlob: { type: Buffer },
  thumbnailUrl: { type: String },
  views: { type: Number, default: 0 },
  duration: { type: Number, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  professor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'link', 'code', 'other']
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  likes: { type: Number, default: 0 },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now },
      likes: { type: Number, default: 0 }
    }]
  }],
  completionRate: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ professor: 1 });
lessonSchema.index({ tags: 1 });
lessonSchema.index({ status: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);