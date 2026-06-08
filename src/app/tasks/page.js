/**
 * app/tasks/page.js — Personal Task Manager
 * Manage AI-generated study plans and add custom sub-tasks.
 */
"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import styles from "./page.module.css";

function Task({ task, planId, onToggle, onAddSub, onToggleSub }) {
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSubTitle, setNewSubTitle] = useState("");

  const handleSubmitSub = (e) => {
    e.preventDefault();
    if (newSubTitle.trim()) {
      onAddSub(planId, task.id, newSubTitle.trim());
      setNewSubTitle("");
      setIsAddingSub(false);
    }
  };

  return (
    <div className={`${styles.taskItem} ${task.completed ? styles.taskCompleted : ""}`}>
      <div className={styles.taskMain}>
        <div 
          className={`${styles.checkbox} ${task.completed ? styles.checked : ""}`}
          onClick={() => onToggle(planId, task.id)}
        />
        <div className={styles.taskTitle} onClick={() => onToggle(planId, task.id)}>
          {task.title}
        </div>
        <button 
          className={styles.addSubBtn}
          onClick={() => setIsAddingSub(!isAddingSub)}
        >
          {isAddingSub ? "Cancel" : "+ Subtask"}
        </button>
      </div>

      {(task.subTasks.length > 0 || isAddingSub) && (
        <div className={styles.subtasks}>
          {task.subTasks.map((sub) => (
            <div key={sub.id} className={`${styles.subtaskItem} ${sub.completed ? styles.subtaskCompleted : ""}`}>
              <div 
                className={`${styles.checkbox} ${styles.subCheckbox} ${sub.completed ? styles.subChecked : ""}`}
                onClick={() => onToggleSub(planId, task.id, sub.id)}
              />
              <span>{sub.title}</span>
            </div>
          ))}
          
          {isAddingSub && (
            <form onSubmit={handleSubmitSub} className={styles.subtaskInput}>
              <input 
                autoFocus
                type="text" 
                placeholder="What needs to be done?"
                value={newSubTitle}
                onChange={(e) => setNewSubTitle(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn--sm">Add</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const { studyPlans, addStudyPlan, deleteStudyPlan, addManualTask, toggleTask, addSubTask, toggleSubTask } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlanSubject, setNewPlanSubject] = useState("");
  const [addingTaskTo, setAddingTaskTo] = useState(null); // { planId, weekTitle }
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (newPlanSubject.trim()) {
      addStudyPlan({
        subject: newPlanSubject.trim(),
        days: 0,
        curriculum: [{ title: "My Tasks", topics: [], practice: "No project defined yet" }]
      });
      setNewPlanSubject("");
      setShowCreateForm(false);
    }
  };

  const handleManualTaskSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() && addingTaskTo) {
      addManualTask(addingTaskTo.planId, addingTaskTo.weekTitle, newTaskTitle.trim());
      setNewTaskTitle("");
      setAddingTaskTo(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className="section-tag">🎯 Mastery Record</p>
            <h1 className={styles.title}>Personal Task Manager</h1>
            <p className={styles.subtitle}>
              Manage multiple custom schedules, add manual topics, and track your personalized learning journey.
            </p>
          </div>
          <button 
            className="btn btn-primary btn--lg" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "✕ Cancel" : "+ Create Manual Plan"}
          </button>
        </div>

        {showCreateForm && (
          <div className={styles.createCard}>
            <form onSubmit={handleCreatePlan} className={styles.createForm}>
              <div className={styles.inputGroup}>
                <label>Name your new Task Manager</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input 
                    type="text" 
                    placeholder="e.g., Daily Coding Routine, Work Portfolio..." 
                    className="input"
                    value={newPlanSubject}
                    onChange={(e) => setNewPlanSubject(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary">Create Fresh Manager</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {studyPlans.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h2 className={styles.emptyTitle}>No plans active yet</h2>
            <p className={styles.emptyText}>
              Go to the AI Study Planner to generate a roadmap, or use the "Create" button above to start a fresh schedule manually!
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/planner" className="btn btn-primary btn--lg">
                Generate with AI →
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.planGrid}>
            {studyPlans.map((plan) => {
              const totalCount = plan.tasks.length;
              const completedCount = plan.tasks.filter(t => t.completed).length;
              const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              // Group tasks by weekTitle
              const weeks = {};
              plan.tasks.forEach(task => {
                if (!weeks[task.weekTitle]) weeks[task.weekTitle] = [];
                weeks[task.weekTitle].push(task);
              });

              // Ensure we show at least the initial week for manual plans if empty
              if (Object.keys(weeks).length === 0 && plan.curriculum?.[0]) {
                weeks[plan.curriculum[0].title] = [];
              }

              return (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planHeader}>
                    <div className={styles.planInfo}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h2>{plan.subject}</h2>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => deleteStudyPlan(plan.id)}
                          title="Delete this schedule"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className={styles.planMeta}>
                        Active since {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={styles.planProgress}>
                      <div className={styles.progressLabel}>{progress}%</div>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.taskList}>
                    {Object.entries(weeks).map(([weekTitle, tasks]) => (
                      <div key={weekTitle} className={styles.weekSection}>
                        <div className={styles.weekHeader}>
                          <h3 className={styles.weekTitle}>{weekTitle}</h3>
                          <button 
                            className={styles.addTaskBtn}
                            onClick={() => setAddingTaskTo({ planId: plan.id, weekTitle })}
                          >
                            + Add Topic
                          </button>
                        </div>
                        
                        {addingTaskTo?.planId === plan.id && addingTaskTo?.weekTitle === weekTitle && (
                          <form onSubmit={handleManualTaskSubmit} className={styles.manualTaskForm}>
                            <input 
                              autoFocus
                              placeholder="New topic name..."
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary btn--sm">Add</button>
                            <button type="button" className="btn btn-ghost btn--sm" onClick={() => setAddingTaskTo(null)}>Cancel</button>
                          </form>
                        )}

                        {tasks.length === 0 && !addingTaskTo && (
                          <p className={styles.noTasks}>No topics yet. Add your first goal above!</p>
                        )}

                        {tasks.map(task => (
                          <Task 
                            key={task.id} 
                            task={task} 
                            planId={plan.id}
                            onToggle={toggleTask}
                            onAddSub={addSubTask}
                            onToggleSub={toggleSubTask}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
