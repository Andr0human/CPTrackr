import { useContext, useEffect, useState } from "react";
import ContestCard from "../components/ContestCard";
import { ThemeContext } from "../contexts";
import "../styles/BookmarkedContests.css";
import apiInstance from "../services/api";

const BookmarkedContests = () => {
  const { darkMode } = useContext(ThemeContext);
  const [bookmarkedContests, setBookmarkedContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarkedContests = async () => {
      const bookmarkIds = JSON.parse(
        localStorage.getItem("bookmarkedContests") || "[]"
      );

      try {
        const response = await apiInstance.post("/contest", {
          ids: bookmarkIds,
        });
        const contests = response?.data?.data;
        setBookmarkedContests(contests);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError(err.message || "Failed to fetch contests");
        setLoading(false);
      }
    };

    fetchBookmarkedContests();

    // Add event listener for storage changes (in case bookmarks are updated in another tab)
    window.addEventListener("storage", fetchBookmarkedContests);

    return () => {
      window.removeEventListener("storage", fetchBookmarkedContests);
    };
  }, []);

  // Separate contests into upcoming and past
  const now = new Date();
  const upcomingContests = bookmarkedContests
    .filter((contest) => new Date(contest.startTime) > now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const pastContests = bookmarkedContests
    .filter((contest) => new Date(contest.startTime) <= now)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  return (
    <div className={`bookmarked-contests ${darkMode ? "dark" : "light"}`}>
      <h2>Bookmarked Contests</h2>

      {loading ? (
        <div className="loading-spinner">Loading bookmarked contests...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : bookmarkedContests.length === 0 ? (
        <div className="no-bookmarks">
          <p>You haven't bookmarked any contests yet.</p>
          <p>
            Go to the dashboard and click the bookmark icon on contests you're
            interested in.
          </p>
        </div>
      ) : (
        <div className="contests-container">
          {upcomingContests.length > 0 && (
            <section className="contests-section">
              <h3>Upcoming Bookmarked Contests</h3>
              <div className="contest-grid">
                {upcomingContests.map((contest) => (
                  <ContestCard key={contest.code} contest={contest} />
                ))}
              </div>
            </section>
          )}

          {pastContests.length > 0 && (
            <section className="contests-section">
              <h3>Past Bookmarked Contests</h3>
              <div className="contest-grid">
                {pastContests.map((contest) => (
                  <ContestCard key={contest.code} contest={contest} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarkedContests;
