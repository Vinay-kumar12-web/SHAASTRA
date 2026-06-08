/**
 * QuizModal.js
 * Shows a quiz when a user marks a topic complete.
 * 5-10 questions with instant feedback and score.
 */
"use client";

import { useState } from "react";
import styles from "./QuizModal.module.css";

export default function QuizModal({ quiz, onClose, domainName }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const question = quiz.questions[currentQ];
  const isLastQuestion = currentQ === quiz.questions.length - 1;
  const score = answers.filter((a) => a.correct).length;

  const handleSelect = (optionIdx) => {
    if (selected !== null) return; // Already answered
    setSelected(optionIdx);
  };

  const handleNext = () => {
    if (selected === null) return;

    const isCorrect = selected === question.answer;
    const newAnswers = [...answers, { questionId: question.id, correct: isCorrect }];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelected(null);
    }
  };

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const scoreLabel =
    percentage >= 80 ? "🏆 Excellent!" :
    percentage >= 60 ? "✅ Good Job!" :
    percentage >= 40 ? "📚 Keep Studying" : "💪 Keep Going!";

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.quizTag}>🎯 Topic Quiz</div>
            <h3 className={styles.quizTitle}>{quiz.title}</h3>
            <p className={styles.quizSubtitle}>{domainName}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close quiz">✕</button>
        </div>

        {!showResult ? (
          <>
            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressInfo}>
                <span>Question {currentQ + 1} of {quiz.questions.length}</span>
                <span>{Math.round(((currentQ) / quiz.questions.length) * 100)}%</span>
              </div>
              <div className="progress-bar" style={{ height: "4px" }}>
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQ) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className={styles.questionSection}>
              <p className={styles.question}>{question.question}</p>

              <div className={styles.options}>
                {question.options.map((option, idx) => {
                  let optClass = styles.option;
                  if (selected !== null) {
                    if (idx === question.answer) optClass = `${styles.option} ${styles.correct}`;
                    else if (idx === selected) optClass = `${styles.option} ${styles.incorrect}`;
                    else optClass = `${styles.option} ${styles.dimmed}`;
                  }
                  return (
                    <button
                      key={idx}
                      className={optClass}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                    >
                      <span className={styles.optionLetter}>
                        {["A", "B", "C", "D"][idx]}
                      </span>
                      <span>{option}</span>
                      {selected !== null && idx === question.answer && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                      {selected !== null && idx === selected && idx !== question.answer && (
                        <span className={styles.xmark}>✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== null && (
                <div className={`${styles.explanation} ${selected === question.answer ? styles.explanationCorrect : styles.explanationIncorrect}`}>
                  <strong>{selected === question.answer ? "✅ Correct!" : "❌ Incorrect"}</strong>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className={styles.actions}>
              <button
                className={`btn btn-primary ${selected === null ? styles.disabled : ""}`}
                onClick={handleNext}
                disabled={selected === null}
              >
                {isLastQuestion ? "See Results 🎉" : "Next Question →"}
              </button>
            </div>
          </>
        ) : (
          /* Results Screen */
          <div className={styles.results}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNumber}>{score}</span>
              <span className={styles.scoreTotal}>/ {quiz.questions.length}</span>
            </div>
            <div className={styles.scoreLabel}>{scoreLabel}</div>
            <div className={styles.scorePercent}>{percentage}% Score</div>

            <div className={styles.answerSummary}>
              {quiz.questions.map((q, idx) => {
                const answer = answers[idx];
                return (
                  <div key={q.id} className={`${styles.answerItem} ${answer?.correct ? styles.answerCorrect : styles.answerWrong}`}>
                    <span>{answer?.correct ? "✓" : "✗"}</span>
                    <span>{q.question.substring(0, 50)}{q.question.length > 50 ? "..." : ""}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.resultActions}>
              <button 
                className="btn btn-ghost btn--lg" 
                onClick={() => {
                  setCurrentQ(0);
                  setSelected(null);
                  setAnswers([]);
                  setShowResult(false);
                }}
                style={{ flex: 1 }}
              >
                ↺ Retake Quiz
              </button>
              <button 
                className="btn btn-primary btn--lg" 
                onClick={onClose} 
                style={{ flex: 2 }}
              >
                Continue Learning 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
