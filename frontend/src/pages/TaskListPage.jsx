// src/pages/TaskListPage.jsx
import { useState } from 'react';
import TaskComponent from '../components/TaskComponent';
import AddTaskButton from '../components/AddTaskButton';

const HF_TOKEN = process.env.REACT_APP_HF_TOKEN;

function TaskListPage() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      text: 'Start my useless project', 
      description: 'Begin the endless cycle of productivity theater by creating something that solves no real problems',
      status: 'todo' 
    },
    { 
      id: 2, 
      text: 'Question my life choices', 
      description: 'Spend at least 30 minutes contemplating whether this project reflects deeper existential issues',
      status: 'todo' 
    },
  ]);

  const handleCompleteTask = async (taskId, taskText, taskDescription) => {
    try {
      // First, mark the task as completed (turns grey)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'completed' }
            : task
        )
      );

      // Generate 2 new tasks using Hugging Face API
      const fullTaskContext = taskDescription ? `${taskText}: ${taskDescription}` : taskText;
      const response = await fetch(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: `Generate 2 related tasks based on: "${fullTaskContext}". Return only the task titles, one per line.`,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const generatedText = result.generated_text || result[0]?.generated_text || '';
        
        // Parse the generated tasks (this is a simple approach)
        const newTaskTexts = generatedText
          .split('\n')
          .filter(text => text.trim())
          .slice(0, 2) // Take only first 2 tasks
          .map(text => text.trim());

        // If AI didn't generate good tasks, fall back to hardcoded ones
        const fallbackTasks = [
          {
            text: `Overthink the completion of "${taskText}"`,
            description: 'Spend unnecessary time analyzing whether you did it correctly and what the implications are'
          },
          {
            text: `Create 3 sub-tasks for what you just finished`,
            description: 'Break down the completed task into smaller, more manageable pieces of regret'
          }
        ];

        let tasksToAdd;
        if (newTaskTexts.length >= 2) {
          tasksToAdd = newTaskTexts.map(text => ({
            text: text,
            description: `AI-generated follow-up to: ${taskText}`
          }));
        } else {
          tasksToAdd = fallbackTasks;
        }

        // Add the 2 new tasks to the state
        const newTasks = tasksToAdd.map((taskData, index) => ({
          id: Date.now() + index, // Simple ID generation
          text: taskData.text,
          description: taskData.description,
          status: 'todo'
        }));

        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      } else {
        // Fallback if API fails
        const fallbackTasks = [
          {
            text: `Regret completing "${taskText}"`,
            description: 'Wonder if you could have done it better, faster, or not at all'
          },
          {
            text: `Wonder why you thought finishing "${taskText}" was a good idea`,
            description: 'Question the fundamental assumptions that led to this moment of completion'
          }
        ];

        const newTasks = fallbackTasks.map((taskData, index) => ({
          id: Date.now() + index,
          text: taskData.text,
          description: taskData.description,
          status: 'todo'
        }));

        setTasks(prevTasks => [...prevTasks, ...newTasks]);
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
      
      // Always provide fallback tasks for the Hydra effect
      const fallbackTasks = [
        {
          text: `Deal with the anxiety of completing "${taskText}"`,
          description: 'Process the overwhelming dread that comes with actually finishing something'
        },
        {
          text: `Question whether "${taskText}" was worth doing at all`,
          description: 'Engage in deep philosophical reflection about the meaning and value of your actions'
        }
      ];

      const newTasks = fallbackTasks.map((taskData, index) => ({
        id: Date.now() + index,
        text: taskData.text,
        description: taskData.description,
        status: 'todo'
      }));

      setTasks(prevTasks => [...prevTasks, ...newTasks]);
    }
  };

  const handleAddTask = (newTaskText, newTaskDescription) => {
    const newTask = {
      id: Date.now(),
      text: newTaskText || 'A mysteriously vague task that will haunt you',
      description: newTaskDescription || 'No description provided, which somehow makes it more ominous',
      status: 'todo'
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // The rendering part now includes Tailwind classes directly
  return (
    // Use Tailwind classes for the main page container
    <main className="bg-slate-900 text-slate-100 min-h-screen font-sans p-4 sm:p-8">
      
      {/* Centered content container */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-8">
          The Sisyphus Task-List
        </h1>
        
        {/* Container for the tasks with a grid layout and gap */}
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskComponent
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
            />
          ))}
        </div>
      </div>
      
      {/* The AddTaskButton is positioned fixed in the corner */}
      <div className="fixed bottom-8 right-8">
        <AddTaskButton onAddTask={handleAddTask} />
      </div>

    </main>
  );
}

export default TaskListPage;