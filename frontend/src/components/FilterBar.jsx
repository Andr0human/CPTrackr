import { useContext } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ThemeContext } from '../contexts';
import '../styles/FilterBar.css';

const FilterBar = ({ filters, onFilterChange }) => {
  const { darkMode } = useContext(ThemeContext);

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

  return (
    <div className={`filter-bar ${darkMode ? 'dark' : 'light'}`}>
      <div className='filter-header'>
        <FaFilter />
        <h3>Filters</h3>
      </div>

      <div className='filter-section'>
        <h4>Platforms</h4>
        <div className='platform-filters'>
          <label className='platform-checkbox'>
            <input
              type='checkbox'
              checked={filters.platforms.includes('codeforces')}
              onChange={() => handlePlatformChange('codeforces')}
            />
            <span className='platform-name codeforces'>Codeforces</span>
          </label>

          <label className='platform-checkbox'>
            <input
              type='checkbox'
              checked={filters.platforms.includes('codechef')}
              onChange={() => handlePlatformChange('codechef')}
            />
            <span className='platform-name codechef'>CodeChef</span>
          </label>

          <label className='platform-checkbox'>
            <input
              type='checkbox'
              checked={filters.platforms.includes('leetcode')}
              onChange={() => handlePlatformChange('leetcode')}
            />
            <span className='platform-name leetcode'>LeetCode</span>
          </label>
        </div>
      </div>

      <div className='filter-section'>
        <h4>Contest Status</h4>
        <div className='status-filters'>
          <label className='status-checkbox'>
            <input
              type='checkbox'
              checked={filters.showPresent}
              onChange={handleShowPresentChange}
            />
            <span>Ongoing Contests</span>
          </label>

          <label className='status-checkbox'>
            <input
              type='checkbox'
              checked={filters.showUpcoming}
              onChange={handleShowUpcomingChange}
            />
            <span>Upcoming Contests</span>
          </label>

          <label className='status-checkbox'>
            <input type='checkbox' checked={filters.showPast} onChange={handleShowPastChange} />
            <span>Past Contests</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
