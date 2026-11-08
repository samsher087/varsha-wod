import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: String,
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastPositionSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });

export default mongoose.model('LessonProgress', lessonProgressSchema);
