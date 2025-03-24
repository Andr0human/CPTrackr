import { useContext, useEffect, useState } from "react";
import {
  FaBookmark,
  FaExternalLinkAlt,
  FaRegBookmark,
  FaYoutube,
} from "react-icons/fa";
import { ThemeContext } from "../contexts";
import "../styles/ContestCard.css";

const urlPrefix = {
  leetcode: "leetcode.com/contest",
  codeforces: "codeforces.com/contest",
  codechef: "codechef.com",
};

const ContestCard = ({ contest }) => {
  const { darkMode } = useContext(ThemeContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const contestUrl = `https://${urlPrefix[contest.platform.toLowerCase()]}/${
    contest.code
  }`;

  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );
    setIsBookmarked(bookmarks.some((elem) => elem.code === contest.code));
  }, [contest.code]);

  // Update time remaining for upcoming contests
  useEffect(() => {
    if (contest.status != "future") return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      // Convert Unix timestamp to milliseconds if it's a number
      const contestTime =
        typeof contest.startTime === "number"
          ? new Date(contest.startTime * 1000)
          : new Date(contest.startTime);

      const diff = contestTime - now;

      if (diff <= 0) {
        setTimeRemaining("Contest has started");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [contest.startTime, contest.status]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedContests") || "[]"
    );
    const isBookmarked = bookmarks.some((elem) => elem.code == contest.code);

    console.log("isbookmarked =", isBookmarked);

    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter(
        (elem) => elem.code != contest.code
      );
      localStorage.setItem(
        "bookmarkedContests",
        JSON.stringify(updatedBookmarks)
      );
    } else {
      bookmarks.push(contest);
      localStorage.setItem("bookmarkedContests", JSON.stringify(bookmarks));
    }

    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    // Convert Unix timestamp to milliseconds if it's a number
    const date =
      typeof dateString === "number"
        ? new Date(dateString * 1000)
        : new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const getPlatformClass = () => {
    return `platform-tag ${contest.platform.toLowerCase()}`;
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className={`contest-card ${darkMode ? "dark" : "light"}`}>
      <div className="card-header">
        <span className={getPlatformClass()}>{contest.platform}</span>
        <button
          className="bookmark-btn"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      <h3 className="contest-title">{contest.name}</h3>

      <div className="contest-details">
        <p className="contest-date">
          <strong>Date:</strong> {formatDate(contest.startTime)}
        </p>

        {contest.status == "future" && (
          <p className="time-remaining">
            <strong>Starts in:</strong> {timeRemaining}
          </p>
        )}

        <p className="contest-duration">
          <strong>Duration:</strong> {formatDuration(contest.duration)}
        </p>
      </div>

      <div className="card-actions">
        <a
          href={contestUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contest-link"
        >
          <FaExternalLinkAlt /> Visit Contest
        </a>

        {contest.status == "past" && contest.solutionLink && (
          <a
            href={contest.solutionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="solution-link"
          >
            <FaYoutube /> Watch Solution
          </a>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
