import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../contexts';
import apiInstance from '../services/api';
import '../styles/AdminForm.css';

const AdminForm = () => {
  const { darkMode } = useContext(ThemeContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContest, setSelectedContest] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });

  useEffect(() => {
    const fetchPastContests = async () => {
      try {
        setLoading(true);
        const response = await apiInstance.post('/contest', { showPast: true });

        if (response.data) {
          setContests(response.data.data);
        } else {
          throw new Error('Failed to fetch past contests');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching past contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastContests();
  }, []);

  // For demo purposes, let's simulate the API response
  const handleDemoSubmit = (e) => {
    e.preventDefault();

    if (!selectedContest || !youtubeLink) {
      setSubmitStatus({
        message: 'Please select a contest and provide a YouTube link',
        isError: true,
      });
      return;
    }

    setSubmitStatus({ message: 'Submitting...', isError: false });

    // Simulate API call delay
    // In a real app, we have to replace this with an API call to backend
    setTimeout(() => {
      setSubmitStatus({
        message: 'Solution link added successfully!',
        isError: false,
      });
      setSelectedContest('');
      setYoutubeLink('');
    }, 1000);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    // Convert Unix timestamp to milliseconds if it's a number
    const date =
      typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className={`admin-form ${darkMode ? 'dark' : 'light'}`}>
      <h2>Add Solution Links</h2>
      <p className='admin-description'>
        Use this form to add YouTube solution links to past contests.
      </p>

      {loading ? (
        <div className='loading-spinner'>Loading past contests...</div>
      ) : error ? (
        <div className='error-message'>Error: {error}</div>
      ) : (
        <form
          onSubmit={handleDemoSubmit}
          className={`solution-form ${darkMode ? 'dark' : 'light'}`}
        >
          <div className='form-group'>
            <label htmlFor='contest-select'>Select Contest:</label>
            <select
              id='contest-select'
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
              required
            >
              <option value=''>-- Select a contest --</option>
              {contests.map((contest) => (
                <option key={contest._id} value={contest._id}>
                  {contest.platform} - {contest.name} ({formatDate(contest.startTime)})
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='youtube-link'>YouTube Solution Link:</label>
            <input
              id='youtube-link'
              type='url'
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
              required
            />
          </div>

          <button type='submit' className='submit-btn'>
            Add Solution Link
          </button>

          {submitStatus.message && (
            <div className={`submit-status ${submitStatus.isError ? 'error' : 'success'}`}>
              {submitStatus.message}
            </div>
          )}
        </form>
      )}

      <div className='youtube-playlists'>
        <h3>YouTube Playlists</h3>
        <ul>
          <li>
            <a
              href='https://www.youtube.com/playlist?list=your-leetcode-playlist-id'
              target='_blank'
              rel='noopener noreferrer'
            >
              Leetcode PCDs
            </a>
          </li>
          <li>
            <a
              href='https://www.youtube.com/playlist?list=your-codeforces-playlist-id'
              target='_blank'
              rel='noopener noreferrer'
            >
              Codeforces PCDs
            </a>
          </li>
          <li>
            <a
              href='https://www.youtube.com/playlist?list=your-codechef-playlist-id'
              target='_blank'
              rel='noopener noreferrer'
            >
              Codechef PCDs
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminForm;
