/**
 * AppContext.js
 * Global state management using React Context API.
 * Manages: user progress, completed topics, quiz results, and chat history.
 */
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ─── Progress State ───────────────────────────────────────────────────────
  const [completedTopics, setCompletedTopics] = useState({});
  const [skillProgress, setSkillProgress] = useState({});
  const [studyPlans, setStudyPlans] = useState([]);
  const [aiConfig, setAiConfig] = useState({ apiKey: "", model: "gemini-1.5-flash" });
  
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.completedTopics) setCompletedTopics(data.completedTopics);
            if (data.skillProgress) setSkillProgress(data.skillProgress);
            if (data.studyPlans) setStudyPlans(data.studyPlans);
          } else {
            // First time login - seed with local data if available
            await setDoc(docRef, {
              email: currentUser.email,
              completedTopics,
              skillProgress,
              studyPlans
            }, { merge: true });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []); // Run once on mount

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompleted = localStorage.getItem("learnify_completed");
      if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted));

      const savedProgress = localStorage.getItem("learnify_progress");
      if (savedProgress) setSkillProgress(JSON.parse(savedProgress));

      const savedPlans = localStorage.getItem("learnify_study_plans");
      if (savedPlans) setStudyPlans(JSON.parse(savedPlans));

      const savedAi = localStorage.getItem("learnify_ai_config");
      if (savedAi) setAiConfig(JSON.parse(savedAi));

      setIsReady(true);
    }
  }, []);

  // ─── Chat / Study Plan State ──────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "👋 Hi! I'm your **Study Planning AI**.\n\nI can help you:\n- 📅 **Create a study plan** — just tell me what you want to learn and how many days\n- 📋 **Convert your plan into a schedule** — paste your existing plan and I'll organize it\n- ✅ **Track your progress** — mark topics complete to earn quiz challenges!\n\nTry typing: *\"Create a 30-day Python learning plan\"*",
      timestamp: new Date().toISOString(),
    },
  ]);

  // ─── Persist to localStorage & Cloud ──────────────────────────────────────
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("learnify_completed", JSON.stringify(completedTopics));
      if (user) setDoc(doc(db, "users", user.uid), { completedTopics }, { merge: true }).catch(console.error);
    }
  }, [completedTopics, isReady, user]);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("learnify_progress", JSON.stringify(skillProgress));
      if (user) setDoc(doc(db, "users", user.uid), { skillProgress }, { merge: true }).catch(console.error);
    }
  }, [skillProgress, isReady, user]);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("learnify_study_plans", JSON.stringify(studyPlans));
      if (user) setDoc(doc(db, "users", user.uid), { studyPlans }, { merge: true }).catch(console.error);
    }
  }, [studyPlans, isReady, user]);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem("learnify_ai_config", JSON.stringify(aiConfig));
    }
  }, [aiConfig, isReady]);

  // ─── Progress Actions ─────────────────────────────────────────────────────
  const markTopicComplete = (domainId, topicIndex) => {
    const key = `${domainId}_${topicIndex}`;
    setCompletedTopics((prev) => ({ ...prev, [key]: true }));

    // Update skill progress percentage
    setSkillProgress((prev) => {
      const current = prev[domainId] || 0;
      return { ...prev, [domainId]: Math.min(100, current + 10) };
    });
  };

  const isTopicCompleted = (domainId, topicIndex) =>
    completedTopics[`${domainId}_${topicIndex}`] || false;

  const getCompletedCount = (domainId) =>
    Object.keys(completedTopics).filter((k) => k.startsWith(domainId + "_")).length;

  const getTotalCompleted = () => Object.keys(completedTopics).length;

  const getSkillProgress = (domainId) => skillProgress[domainId] || 0;

  const resetProgress = () => {
    setCompletedTopics({});
    setSkillProgress({});
    setStudyPlans([]);
  };

  const addStudyPlan = (planData) => {
    // planData has: { subject, days: [{day, topic, description, ...}] }
    const subject = planData.subject || "Study Plan";
    const dayList = planData.days || [];

    // Prevent duplicate subjects
    if (studyPlans.some(p => p.subject === subject)) {
      // Update existing plan instead of ignoring
      setStudyPlans(prev => prev.map(p =>
        p.subject === subject
          ? { ...p, days: dayList, tasks: dayList.map((d, idx) => ({
              id: `${p.id}_${idx}`,
              title: `Day ${d.day}: ${d.topic}`,
              completed: false,
              description: d.description || "",
              subTasks: [],
            })),
            updatedAt: new Date().toISOString(),
          }
          : p
      ));
      return;
    }

    const newPlan = {
      id: Date.now(),
      subject,
      days: dayList,
      totalDays: dayList.length,
      createdAt: new Date().toISOString(),
      tasks: dayList.map((d, idx) => ({
        id: `${Date.now()}_${idx}`,
        title: `Day ${d.day}: ${d.topic}`,
        completed: false,
        description: d.description || "",
        subTasks: [],
      })),
    };
    setStudyPlans(prev => [newPlan, ...prev]);
  };


  const deleteStudyPlan = (planId) => {
    setStudyPlans(prev => prev.filter(p => p.id !== planId));
  };

  const addManualTask = (planId, weekTitle, taskTitle) => {
    setStudyPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          tasks: [
            ...p.tasks,
            {
              id: Date.now(),
              title: taskTitle,
              completed: false,
              weekTitle: weekTitle,
              subTasks: []
            }
          ]
        };
      }
      return p;
    }));
  };

  const toggleTask = (planId, taskId) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return plan;
    }));
  };

  const addSubTask = (planId, taskId, subTaskTitle) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subTasks: [...task.subTasks, { id: Date.now(), title: subTaskTitle, completed: false }]
              };
            }
            return task;
          })
        };
      }
      return plan;
    }));
  };

  const toggleSubTask = (planId, taskId, subTaskId) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                subTasks: task.subTasks.map(st => 
                  st.id === subTaskId ? { ...st, completed: !st.completed } : st
                )
              };
            }
            return task;
          })
        };
      }
      return plan;
    }));
  };

  // ─── Chat Actions ─────────────────────────────────────────────────────────
  const addChatMessage = (message) => {
    setChatMessages((prev) => [
      ...prev,
      {
        ...message,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 1,
        role: "assistant",
        content: "Chat cleared! How can I help you plan your studies today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const logout = () => {
    signOut(auth);
    resetProgress();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        logout,
        // Progress
        completedTopics,
        skillProgress,
        markTopicComplete,
        isTopicCompleted,
        getCompletedCount,
        getTotalCompleted,
        getSkillProgress,
        resetProgress,
        studyPlans,
        addStudyPlan,
        deleteStudyPlan,
        addManualTask,
        toggleTask,
        addSubTask,
        toggleSubTask,
        // Chat
        chatMessages,
        addChatMessage,
        clearChat,
        aiConfig,
        setAiConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for easy access
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
