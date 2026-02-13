import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Analytics({ onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalPomo: 0,
    hours: 0,
    studyPomo: 0,
    standardPomo: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const storedStats = JSON.parse(localStorage.getItem("ontime_stats")) || {
      totalPomo: 0,
      hours: 0,
      studyPomo: 0,
      standardPomo: 0,
    };
    const storedSessions = JSON.parse(localStorage.getItem("ontime_sessions")) || [];
    const storedQuizzes = JSON.parse(localStorage.getItem("ontime_quiz_results")) || [];

    setStats(storedStats);
    setSessions(storedSessions);
    setQuizResults(storedQuizzes);
  }, []);

  // Process sessions for daily productivity chart
  const getDailyProductivity = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const daySessions = sessions.filter((s) => {
        const sessionDate = new Date(s.endTime);
        return sessionDate.toDateString() === date.toDateString();
      });

      last7Days.push({
        date: dateStr,
        pomodoros: daySessions.length,
        study: daySessions.filter((s) => s.mode === "study").length,
        standard: daySessions.filter((s) => s.mode === "standard").length,
      });
    }

    return last7Days;
  };

  // Process quiz results for subject performance
  const getSubjectPerformance = () => {
    const subjectMap = {};

    quizResults.forEach((quiz) => {
      const subject = quiz.subject || "General";
      if (!subjectMap[subject]) {
        subjectMap[subject] = { total: 0, correct: 0, count: 0 };
      }
      subjectMap[subject].total += quiz.questions;
      subjectMap[subject].correct += quiz.correct;
      subjectMap[subject].count += 1;
    });

    return Object.entries(subjectMap).map(([subject, data]) => ({
      subject,
      score: Math.round((data.correct / data.total) * 100),
      attempts: data.count,
    }));
  };

  // Get mode distribution for pie chart
  const getModeDistribution = () => {
    return [
      { name: "Study Mode", value: stats.studyPomo || 0, color: "#be3d2a" },
      { name: "Standard", value: stats.standardPomo || 0, color: "#d57d70" },
    ];
  };

  const dailyData = getDailyProductivity();
  const subjectPerformance = getSubjectPerformance();
  const modeDistribution = getModeDistribution();

  return (
    <div className="info-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="analytics-container"
      >
        <button onClick={onClose} className="close-analytics-button">
          <CloseRoundedIcon sx={{ color: "white", fontSize: 35 }} />
        </button>

        <h2 className="analytics-title">Analytics Dashboard</h2>

        {/* Tab Navigation */}
        <div className="analytics-tabs">
          <button
            className={`analytics-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`analytics-tab ${activeTab === "productivity" ? "active" : ""}`}
            onClick={() => setActiveTab("productivity")}
          >
            Productivity
          </button>
          <button
            className={`analytics-tab ${activeTab === "study" ? "active" : ""}`}
            onClick={() => setActiveTab("study")}
          >
            Study Performance
          </button>
        </div>

        {/* Tab Content */}
        <div className="analytics-content">
          {activeTab === "overview" && (
            <div className="analytics-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{stats.totalPomo}</div>
                  <div className="stat-label">Total Pomodoros</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.hours.toFixed(1)}h</div>
                  <div className="stat-label">Hours Focused</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.studyPomo || 0}</div>
                  <div className="stat-label">Study Sessions</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.standardPomo || 0}</div>
                  <div className="stat-label">Standard Sessions</div>
                </div>
              </div>

              <div className="chart-section">
                <h3 className="chart-title">Task Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={modeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "productivity" && (
            <div className="analytics-productivity">
              <h3 className="chart-title">Last 7 Days Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pomodoros"
                    stroke="#be3d2a"
                    strokeWidth={2}
                    name="Total Pomodoros"
                  />
                </LineChart>
              </ResponsiveContainer>

              <h3 className="chart-title" style={{ marginTop: "2rem" }}>
                Study vs Standard Sessions
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="study" fill="#be3d2a" name="Study Mode" />
                  <Bar dataKey="standard" fill="#d57d70" name="Standard" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "study" && (
            <div className="analytics-study">
              {quizResults.length === 0 ? (
                <div className="no-data-message">
                  <p>No quiz results yet.</p>
                  <p>Complete quizzes in Study Mode to see your performance analytics.</p>
                </div>
              ) : (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">{quizResults.length}</div>
                      <div className="stat-label">Quizzes Taken</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">
                        {quizResults.length > 0
                          ? Math.round(
                              quizResults.reduce((acc, q) => acc + q.score, 0) /
                                quizResults.length
                            )
                          : 0}
                        %
                      </div>
                      <div className="stat-label">Average Score</div>
                    </div>
                  </div>

                  <h3 className="chart-title">Performance by Subject</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#be3d2a" name="Average Score %" />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="quiz-history">
                    <h3 className="chart-title">Recent Quiz Results</h3>
                    {quizResults.slice(-5).reverse().map((quiz, idx) => (
                      <div key={idx} className="quiz-result-item">
                        <div className="quiz-info">
                          <div className="quiz-topic">{quiz.topic}</div>
                          <div className="quiz-subject">{quiz.subject}</div>
                        </div>
                        <div className="quiz-score-badge">{quiz.score}%</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
