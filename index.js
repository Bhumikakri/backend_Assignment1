const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

const pathLine = path.join(__dirname, "Task.txt");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getInput = (ques) => {
  return new Promise((resolve) => {
    rl.question(ques, resolve);
  });
};

const addTask = async () => {
  const task = await getInput("Provide your task to add-> ");
  const finalTask = `${task.trim()}\n`; // Trim the task to remove extra whitespaces
  await fs.appendFile(pathLine, finalTask);
  console.log("Task added successfully.");
};

const viewTask = async () => {
  try {
    const data = await fs.readFile(pathLine, "utf-8");
    if (data.trim() === '') {
      console.log("No tasks available.");
    } else {
      console.log("List of Tasks:\n", data);
    }
  } catch (error) {
    console.error("Error reading tasks:", error.message);
  }
};

const markComplete = async () => {
  try {
    const data = await fs.readFile(pathLine, "utf-8");
    if (data.trim() === '') {
      console.log("No tasks available to mark as complete.");
      return;
    }

    const tasks = data.split("\n").filter(task => task.trim() !== '');

    console.log("Current tasks:\n", tasks.join('\n'));

    const taskIndexToComplete = await getInput("Enter the index of the task to mark as complete: ");

    if (taskIndexToComplete >= 0 && taskIndexToComplete < tasks.length) {
      const taskToComplete = tasks[taskIndexToComplete].trim();

      if (!taskToComplete.endsWith(" (Completed)")) {
        tasks[taskIndexToComplete] = taskToComplete + " (Completed)";
        console.log(`Marked task as complete: ${taskToComplete}`);
      } else {
        console.log("Task is already marked as complete.");
      }

      const updatedTasks = tasks.join('\n');
      await fs.writeFile(pathLine, updatedTasks);

      console.log("Tasks updated successfully.");
    } else {
      console.log("Invalid index. No task marked as complete.");
    }
  } catch (error) {
    console.error("Error marking task as complete:", error.message);
  }
};

const removeTask = async () => {
  try {
    const data = await fs.readFile(pathLine, "utf-8");
    const tasks = data.split("\n").filter(task => task.trim() !== '');

    console.log("Current tasks:\n", tasks.join('\n'));

    const taskIndexToRemove = await getInput("Enter the index of the task to remove: ");

    if (taskIndexToRemove >= 0 && taskIndexToRemove < tasks.length) {
      const removedTask = tasks.splice(taskIndexToRemove, 1)[0];
      console.log(`Removed task: ${removedTask}`);

      const updatedTasks = tasks.join('\n');
      await fs.writeFile(pathLine, updatedTasks);

      console.log("Tasks updated successfully.");
    } else {
      console.log("Invalid index. No task removed.");
    }
  } catch (error) {
    console.error("Error removing task:", error.message);
  }
};

async function Reload() {
  while (true) {
    console.log("1. Add a new task.");
    console.log("2. View a list of tasks.");
    console.log("3. Mark a task as complete.");
    console.log("4. Remove a task.");
    console.log("5. End");

    const choose = await getInput("Enter option number ");
    switch (choose) {
      case "1":
        await addTask();
        break;
      case "2":
        await viewTask();
        break;
      case "3":
        await markComplete();
        break;
      case "4":
        await removeTask();
        break;
      case "5":
        console.log("End");
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("Enter a valid number.");
        break;
    }
  }
}

Reload();
