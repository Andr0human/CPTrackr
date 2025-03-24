import { useCallback, useContext, useEffect, useState } from "react";
import { ContestCard, FilterBar } from "../components";
import { ThemeContext } from "../contexts";
import apiInstance from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const [contests, setContests] = useState([]);
  const [presentContests, setPresentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    return {
      platforms: ["codeforces", "codechef", "leetcode"],
      showPresent: true,
      showUpcoming: true,
      showPast: true,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  });

  const fetchContests = useCallback(async () => {
    try {
      const response = await apiInstance.post("/contest", filters);
      const newContests = response?.data?.data;
      setContests(newContests);

      setPastContests(
        newContests.filter((contest) => contest.status === "past")
      );
      setPresentContests(
        newContests.filter((contest) => contest.status === "present")
      );
      setUpcomingContests(
        newContests.filter((contest) => contest.status === "future")
      );

      setLoading(false);
    } catch (err) {
      console.error("Error fetching contests:", err);
      setError(err.message || "Failed to fetch contests");
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <h2>Contest Dashboard</h2>

      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading-spinner">Loading contests...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <div className="contests-container">
          {filters.showPresent && presentContests.length > 0 && (
            <section className="contests-section">
              <h3>Ongoing Contests</h3>
              <div className="contest-grid">
                {presentContests.map((contest) => (
                  <ContestCard key={contest.code} contest={contest} />
                ))}
              </div>
            </section>
          )}

          {filters.showUpcoming && upcomingContests.length > 0 && (
            <section className="contests-section">
              <h3>Upcoming Contests</h3>
              <div className="contest-grid">
                {upcomingContests.map((contest) => (
                  <ContestCard key={contest.code} contest={contest} />
                ))}
              </div>
            </section>
          )}

          {filters.showPast && pastContests.length > 0 && (
            <section className="contests-section">
              <h3>Past Contests</h3>
              <div className="contest-grid">
                {pastContests.map((contest) => (
                  <ContestCard key={contest.code} contest={contest} />
                ))}
              </div>
            </section>
          )}

          {contests.length === 0 && (
            <div className="no-contests">
              No contests found with the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
