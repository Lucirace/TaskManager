"use server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

// Get all tasks
export async function getTasks() {
  await connectDB();
  const tasks = await Task.find();
  return tasks.map(task => ({
    _id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "", 
    completed: task.completed,
  }));
}

export async function addTask(data) {
  await connectDB();
  const task = await Task.create(data);
  return {
    _id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
    completed: task.completed,
  };
}

export async function updateTask(id, data) {
  await connectDB();
  
  const task = await Task.findByIdAndUpdate(id, data, { new: true });

  if (!task) return { success: false, message: "Task not found" };

  return {
    success: true,
    _id: task._id.toString(),
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
    completed: task.completed,
  };
}

export async function toggleTaskCompletion(id) {
  await connectDB();
  const task = await Task.findById(id);
  if (!task) return { success: false, message: "Task not found" };

  task.completed = !task.completed;
  await task.save();

  return { success: true, completed: task.completed };
}

// Delete a task
export async function deleteTask(id) {
  await connectDB();
  const task = await Task.findByIdAndDelete(id);

  return task ? { success: true, message: "Task deleted" } : { success: false, message: "Task not found" };
}
