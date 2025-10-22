import Task from '../models/taskModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: 'Title, description, and due date are required' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error.message);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// @desc    Get all tasks for logged in user with pagination
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments({ createdBy: req.user._id });

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get Task Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching task' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error.message);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// @desc    Get tasks by priority
// @route   GET /api/tasks/priority/:priority
// @access  Private
export const getTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority level' });
    }

    const tasks = await Task.find({ 
      createdBy: req.user._id,
      priority: priority 
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get Tasks by Priority Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};