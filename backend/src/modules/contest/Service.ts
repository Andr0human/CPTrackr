import axios from 'axios';
import { serverConfig } from '../../config';

class ContestService {
  leetCodeApi: string;

  codechefApi: string;

  codeforcesApi: string;

  constructor() {
    this.leetCodeApi = serverConfig.apis.leetcode;
    this.codechefApi = serverConfig.apis.codechef;
    this.codeforcesApi = serverConfig.apis.codeforces;
  }

  getLeetCodeData = async () => {
    try {
      const leetcodeResponse = await axios.post(
        this.leetCodeApi,
        {
          query: `
            query contestList {
              allContests {
                title
                titleSlug
                startTime
                duration
              }
            }
          `,
        }
      );

      const contests = leetcodeResponse.data.data.allContests;
      const currentTime = Math.floor(Date.now() / 1000);

      const past = contests.filter(
        (contest: any) => contest.startTime + contest.duration <= currentTime
      );

      const present = contests.filter(
        (contest: any) =>
          contest.startTime <= currentTime &&
          contest.startTime + contest.duration > currentTime
      );

      const future = contests.filter(
        (contest: any) => contest.startTime > currentTime
      );
      return [
        ...this.formatLeetCodeData(past, 'past'),
        ...this.formatLeetCodeData(present, 'present'),
        ...this.formatLeetCodeData(future, 'future'),
      ];
    } catch (error) {
      console.error('Error fetching LeetCode data:', error);
      return [];
    }
  };

  formatLeetCodeData = (contestArray: any, status: string) => {
    return contestArray.map((contest: any) => ({
      name: contest.title,
      code: contest.titleSlug,
      platform: 'leetcode',
      status,
      startTime: contest.startTime,
      duration: contest.duration,
    }));
  };

  getCodechefData = async () => {
    try {
      const codechefResponse = await axios.get(this.codechefApi);

      return [
        ...this.formatCodechefData(codechefResponse.data.past_contests, 'past'),
        ...this.formatCodechefData(
          codechefResponse.data.present_contests,
          'present'
        ),
        ...this.formatCodechefData(
          codechefResponse.data.future_contests,
          'future'
        ),
      ];
    } catch (error) {
      console.error('Error fetching Codechef data:', error);
      return [];
    }
  };

  formatCodechefData = (contestArray: any, status: string) => {
    return contestArray.map((contest: any) => ({
      name: contest.contest_name,
      code: contest.contest_code,
      platform: 'codechef',
      status,
      startTime: new Date(contest.contest_start_date_iso).getTime() / 1000,
      duration: parseInt(contest.contest_duration, 10) * 60,
    }));
  };

  getCodeforcesData = async () => {
    try {
      const codeforcesResponse = await axios.get(this.codeforcesApi);

      const contests = codeforcesResponse.data.result;
      const currentTime = Math.floor(Date.now() / 1000);

      const past = contests.filter(
        (contest: any) => contest.phase === 'FINISHED'
      );

      const upcoming = contests.filter(
        (contest: any) => contest.phase === 'BEFORE'
      );

      const present = upcoming.filter(
        (contest: any) =>
          contest.startTimeSeconds <= currentTime &&
          contest.startTimeSeconds + contest.durationSeconds > currentTime
      );

      const future = upcoming.filter(
        (contest: any) => contest.startTimeSeconds > currentTime
      );

      return [
        ...this.formatCodeforcesData(past, 'past'),
        ...this.formatCodeforcesData(present, 'present'),
        ...this.formatCodeforcesData(future, 'future'),
      ];
    } catch (error) {
      console.error('Error fetching Codeforces data:', error);
      return [];
    }
  };

  formatCodeforcesData = (contestArray: any, status: string) => {
    return contestArray.map((contest: any) => ({
      name: contest.name,
      code: contest.id.toString(),
      platform: 'codeforces',
      status,
      startTime: contest.startTimeSeconds,
      duration: contest.durationSeconds,
    }));
  };

  sortContestsByStartTime = (contests: any[]) => {
    return [...contests].sort((a, b) => a.startTime - b.startTime);
  };

  filterByIds = (contests: any[], ids: string[]) => {
    return contests.filter((contest) => ids.includes(contest.code));
  };

  filterByDateRange = (
    contests: any[],
    startDate?: string,
    endDate?: string
  ) => {
    // If no dates are provided, return all contests
    if (!startDate && !endDate) {
      return contests;
    }

    return contests.filter((contest) => {
      // Convert contest startTime (in seconds) to milliseconds
      const contestDate = new Date(contest.startTime * 1000);

      // Check if contest is after startDate (if provided)
      if (startDate) {
        const startDateObj = new Date(startDate);
        // Set start date to beginning of the day
        startDateObj.setHours(0, 0, 0, 0);
        if (contestDate < startDateObj) {
          return false;
        }
      }

      // Check if contest is before endDate (if provided)
      if (endDate) {
        const endDateObj = new Date(endDate);
        // Set end date to end of the day
        endDateObj.setHours(23, 59, 59, 999);
        if (contestDate > endDateObj) {
          return false;
        }
      }

      return true;
    });
  };
}

export default ContestService;
