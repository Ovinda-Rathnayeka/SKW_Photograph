import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const isSpamComment = (text) => {
  if (!text || text.length < 3) return false;

  const cleanedText = text.toLowerCase().replace(/\s/g, "");

  // Detect gibberish: mostly non-alphabetic or symbol-heavy
  const symbolPattern = /[^a-zA-Z0-9\s]{3,}/.test(text); // symbols like ;o/o;
  const gibberishPattern = /^[bcdfghjklmnpqrstvwxyz]{6,}$/i.test(cleanedText); // consonant-heavy

  // Detect profanity
  const badWords = [
    "spam",
    "scam",
    "fake",
    "fraud",
    "stupid",
    "idiot",
    "nonsense",
    "damn",
    "crap",
    "hell",
    "shit",
    "fuck",
    "bitch",
    "bastard",
    "asshole",
    "retard",
    "dick",
    "piss",
    "slut",
    "moron",
    "suck",
    "nigger",
    "whore",
    "cunt",
  ];
  const containsBadWord = badWords.some((word) => cleanedText.includes(word));

  return symbolPattern || gibberishPattern || containsBadWord;
};

const COLORS = [
  "bg-purple-600",
  "bg-indigo-600",
  "bg-yellow-500",
  "bg-rose-500",
];
const CHART_COLORS = ["#8b5cf6", "#6366f1", "#f59e0b", "#f43f5e"];

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const approved = feedbacks.filter((fb) => fb.isApproved);

  const categories = ["Package", "Purchase", "Rental", "Service"];

  const categoryCount = (category) =>
    feedbacks.filter((fb) => fb.category === category).length;

  const averageRating = () => {
    if (!feedbacks.length) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return (total / feedbacks.length).toFixed(2);
  };

  const mostCommonCategory = () => {
    const counts = categories.map((cat) => ({
      name: cat,
      value: categoryCount(cat),
    }));
    return counts.reduce(
      (max, curr) => (curr.value > max.value ? curr : max),
      counts[0]
    );
  };

  const positiveFeedbackPercent = () => {
    const approved = feedbacks.filter((fb) => fb.isApproved);
    const positive = approved.filter((fb) => fb.rating >= 4);
    if (!approved.length) return 0;
    return ((positive.length / approved.length) * 100).toFixed(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackRes = await axios.get("http://localhost:5000/feedbacks");
        const customerRes = await axios.get("http://localhost:5000/customer");

        setFeedbacks(feedbackRes.data.feedbacks || feedbackRes.data || []);
        setCustomers(customerRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = categories.map((cat) => ({
    name: cat,
    value: categoryCount(cat),
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Feedbacks</h3>
          <p className="text-3xl font-bold">{feedbacks.length}</p>
          <span className="text-sm">Overall Count</span>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Approved</h3>
          <p className="text-3xl font-bold">
            {feedbacks.filter((fb) => fb.isApproved).length}
          </p>
          <span className="text-sm">Approved Feedbacks</span>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Pending Approval</h3>
          <p className="text-3xl font-bold">
            {feedbacks.filter((fb) => !fb.isApproved).length}
          </p>
          <span className="text-sm">Not Yet Approved</span>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Spam Detected</h3>
          <p className="text-3xl font-bold">
            {
              feedbacks.filter(
                (fb) => isSpamComment(fb.title) || isSpamComment(fb.comment)
              ).length
            }
          </p>
          <span className="text-sm">Potential Spam</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md mb-10">
        <h3 className="text-lg font-semibold mb-4">
          Positive Feedback by Users
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${positiveFeedbackPercent()}%`,
              background: `linear-gradient(to right, #fbbf24, #f59e0b)`,
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {positiveFeedbackPercent()}% of approved feedbacks rated 4★ or higher
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Feedbacks Per Category Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Feedbacks Per Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Rating Percentages Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Average Rating Percentages</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                {
                  category: "Overall",
                  percent:
                    approved.length > 0
                      ? (
                          (approved.reduce((a, b) => a + (b.rating || 0), 0) /
                            (approved.length * 5)) *
                          100
                        ).toFixed(1)
                      : 0,
                },
                {
                  category: "Quality",
                  percent:
                    approved.length > 0
                      ? (
                          (approved.reduce(
                            (a, b) => a + (b.serviceQuality || 0),
                            0
                          ) /
                            (approved.length * 5)) *
                          100
                        ).toFixed(1)
                      : 0,
                },
                {
                  category: "Response",
                  percent:
                    approved.length > 0
                      ? (
                          (approved.reduce(
                            (a, b) => a + (b.responseTime || 0),
                            0
                          ) /
                            (approved.length * 5)) *
                          100
                        ).toFixed(1)
                      : 0,
                },
                {
                  category: "Value",
                  percent:
                    approved.length > 0
                      ? (
                          (approved.reduce(
                            (a, b) => a + (b.valueForMoney || 0),
                            0
                          ) /
                            (approved.length * 5)) *
                          100
                        ).toFixed(1)
                      : 0,
                },
                {
                  category: "Experience",
                  percent:
                    approved.length > 0
                      ? (
                          (approved.reduce(
                            (a, b) => a + (b.overallExperience || 0),
                            0
                          ) /
                            (approved.length * 5)) *
                          100
                        ).toFixed(1)
                      : 0,
                },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="percent" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Feedback Insights</h3>
        <table className="w-full table-auto text-left text-sm text-gray-700">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Metric</th>
              <th className="py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Total Feedbacks</td>
              <td className="py-2">{feedbacks.length}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Average Rating</td>
              <td className="py-2">{averageRating()}</td>
            </tr>
            <tr>
              <td className="py-2">Most Common Category</td>
              <td className="py-2">{mostCommonCategory().name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
