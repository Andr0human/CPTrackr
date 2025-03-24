import { useContext, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { ThemeContext } from "../contexts";
import "../styles/FilterBar.css";
import DateRangePicker from "./DateRangePicker";

const FilterBar = ({ filters, onFilterChange }) => {
  const { darkMode } = useContext(ThemeContext);
  const [dateRange, setDateRange] = useState([
    filters.startDate,
    filters.endDate,
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePlatformChange = (platform) => {
    const updatedPlatforms = [...filters.platforms];

    if (updatedPlatforms.includes(platform)) {
      // Remove platform if already selected
      const index = updatedPlatforms.indexOf(platform);
      updatedPlatforms.splice(index, 1);
    } else {
      // Add platform if not selected
      updatedPlatforms.push(platform);
    }

    onFilterChange({
      ...filters,
      platforms: updatedPlatforms,
    });
  };

  const handleShowUpcomingChange = () => {
    onFilterChange({
      ...filters,
      showUpcoming: !filters.showUpcoming,
    });
  };

  const handleShowPresentChange = () => {
    onFilterChange({
      ...filters,
      showPresent: !filters.showPresent,
    });
  };

  const handleShowPastChange = () => {
    onFilterChange({
      ...filters,
      showPast: !filters.showPast,
    });
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    onFilterChange({
      ...filters,
      startDate: newDateRange[0],
      endDate: newDateRange[1],
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Platform options for the dropdown
  const platformOptions = [
    { id: "codeforces", name: "Codeforces", className: "codeforces" },
    { id: "codechef", name: "CodeChef", className: "codechef" },
    { id: "leetcode", name: "LeetCode", className: "leetcode" },
  ];

  return (
    <div className={`filter-bar ${darkMode ? "dark" : "light"}`}>
      <div className="filter-header">
        <FaFilter className="filter-icon" />
        <h3>Filters</h3>
      </div>

      <div className="filter-content">
        <DateRangePicker
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onDateChange={handleDateChange}
        />

        <div className="filter-section">
          <h4>Platforms</h4>
          <div className="platform-dropdown-container">
            <div className="platform-dropdown-header" onClick={toggleDropdown}>
              <span>
                {filters.platforms.length === 0
                  ? "Select Platforms"
                  : `Selected (${filters.platforms.length})`}
              </span>
              <FaChevronDown
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="platform-dropdown-menu">
                {platformOptions.map((platform) => (
                  <div
                    key={platform.id}
                    className="platform-dropdown-item"
                    onClick={() => handlePlatformChange(platform.id)}
                  >
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(platform.id)}
                      readOnly
                    />
                    <span className={`platform-name ${platform.className}`}>
                      {platform.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="filter-section">
          <h4>Contest Status</h4>
          <div className="status-filters">
            <label className="status-checkbox">
              <input
                type="checkbox"
                checked={filters.showPresent}
                onChange={handleShowPresentChange}
              />
              <span>Ongoing Contests</span>
            </label>

            <label className="status-checkbox">
              <input
                type="checkbox"
                checked={filters.showUpcoming}
                onChange={handleShowUpcomingChange}
              />
              <span>Upcoming Contests</span>
            </label>

            <label className="status-checkbox">
              <input
                type="checkbox"
                checked={filters.showPast}
                onChange={handleShowPastChange}
              />
              <span>Past Contests</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
