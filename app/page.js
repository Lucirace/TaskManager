"use client";
import { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, toggleTaskCompletion, deleteTask } from "./actions";
import { Calendar, CheckCircle2, Edit3, Trash2, Plus, X } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const tasks = await getTasks();
    setTasks(tasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }
    try {
      const task = await addTask(newTask);
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "", dueDate: "" });
      setError("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
  };

  const handleSaveEdit = async () => {
    if (!editTask?.title.trim()) {
      setError("Task title is required");
      return;
    }
    try {
      const response = await updateTask(editTask._id, editTask);
      if (response.success) {
        setTasks(tasks.map(task =>
          task._id === editTask._id ? { ...response } : task
        ));
        setEditTask(null);
        setError("");
      }
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      const response = await toggleTaskCompletion(id);
      if (response.success) {
        setTasks(tasks.map(task =>
          task._id === id ? { ...task, completed: response.completed } : task
        ));
      }
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteTask(id);
      if (response.success) {
        setTasks(tasks.filter(task => task._id !== id));
      }
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Task Manager</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              className="flex-1 text-gray-900 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              className="flex-1 text-gray-900 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none  min-h-[100px]"
              placeholder="Description"
              contentEditable
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="date"
              className="text-gray-900 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Add Task</span>
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <div 
              key={task._id} 
              className={`bg-white rounded-lg shadow-sm transition-all duration-200 ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-gray-600">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleToggleCompletion(task._id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        task.completed
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg m-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
                  <button
                    onClick={() => setEditTask(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none  "
                    placeholder="Task Title"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  />
                  <input
                    className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
                    placeholder="Description"
                    contentEditable
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  />
                  <input
                    type="date"
                    className="text-gray-900 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={editTask.dueDate}
                    onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                  />
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setEditTask(null)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 