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

  const fetchBookmarkedContests = async () => {
    const bookmarkIds = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );

    if (bookmarkIds.length === 0) {
      setBookmarkedContests([]);
      setLoading(false);
      return;
    }

    try {
      const response = await apiInstance.post("/contest", {
        ids: bookmarkIds,
        showPast: true,
        showPresent: true,
        showUpcoming: true,
      });
      const contests = response?.data?.data;
      const bookmarkedContests = JSON.parse(
        localStorage.getItem("bookmarkedContests") || "[]"
      );

      const contestsWithBookmark = contests.map((contest) => ({
        ...contest,
        isBookmarked: bookmarkedContests.includes(contest.code),
      }));

      setBookmarkedContests(contestsWithBookmark);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contests:", err);
      setError(err.message || "Failed to fetch contests");
      setLoading(false);
    }
  };

  const toggleBookmark = (contestCode, isBookmarked) => {
    let bookmarkedContests = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );

    if (!isBookmarked) {
      bookmarkedContests.push(contestCode);
    } else {
      bookmarkedContests = bookmarkedContests.filter(
        (code) => code !== contestCode
      );
    }

    localStorage.setItem(
      "bookmarkedContests",
      JSON.stringify(bookmarkedContests)
    );

    setBookmarkedContests((prevContests) =>
      prevContests.filter((contest) => contest.code !== contestCode)
    );
  };

  useEffect(() => {
    fetchBookmarkedContests();
  }, []);

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
          <section className="contests-section">
            <h3>All Bookmarked Contests</h3>
            <div className="contest-grid">
              {bookmarkedContests.map((contest) => (
                <ContestCard
                  key={contest.code}
                  contest={contest}
                  onToggleBookMark={() =>
                    toggleBookmark(contest.code, contest.isBookmarked)
                  }
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default BookmarkedContests;
