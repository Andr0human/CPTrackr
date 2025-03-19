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
      const leetcodeResponse = await axios.post('https://leetcode.com/graphql', {
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
      });

      const contests = leetcodeResponse.data.data.allContests;
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const twoDaysInSeconds = 2 * 24 * 60 * 60; // 2 days in seconds

      // Filter past contests to only include those less than 2 days old
      const past = contests.filter(
        (contest: any) =>
          contest.startTime + contest.duration <= currentTime &&
          currentTime - (contest.startTime + contest.duration) <= twoDaysInSeconds
      );

      // Separate contests into present (ongoing) and future
      const present = contests.filter(
        (contest: any) =>
          contest.startTime <= currentTime && contest.startTime + contest.duration > currentTime
      );

      const future = contests.filter((contest: any) => contest.startTime > currentTime);
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
      const codechefResponse = await axios.get(
        'https://www.codechef.com/api/list/contests/all?sort_by=START&offset=0&mode=all'
      );

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const twoDaysInSeconds = 2 * 24 * 60 * 60; // 2 days in seconds

      // Filter past contests to only include those less than 2 days old
      const pastContests = codechefResponse.data.past_contests.filter((contest: any) => {
        const endTime =
          new Date(contest.contest_start_date_iso).getTime() / 1000 +
          parseInt(contest.contest_duration, 10) * 60;
        return currentTime - endTime <= twoDaysInSeconds;
      });

      return [
        ...this.formatCodechefData(pastContests, 'past'),
        ...this.formatCodechefData(codechefResponse.data.present_contests, 'present'),
        ...this.formatCodechefData(codechefResponse.data.future_contests, 'future'),
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
      startTime: new Date(contest.contest_start_date_iso).getTime() / 1000, // Convert to Unix timestamp (seconds)
      duration: parseInt(contest.contest_duration, 10) * 60, // Convert minutes to seconds
    }));
  };

  getCodeforcesData = async () => {
    try {
      const codeforcesResponse = await axios.get('https://codeforces.com/api/contest.list?');

      const contests = codeforcesResponse.data.result;
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const twoDaysInSeconds = 2 * 24 * 60 * 60; // 2 days in seconds

      // Filter past contests to only include those less than 2 days old
      const past = contests.filter(
        (contest: any) =>
          contest.phase === 'FINISHED' &&
          currentTime - (contest.startTimeSeconds + contest.durationSeconds) <= twoDaysInSeconds
      );

      const upcoming = contests.filter((contest: any) => contest.phase === 'BEFORE');

      const present = upcoming.filter(
        (contest: any) =>
          contest.startTimeSeconds <= currentTime &&
          contest.startTimeSeconds + contest.durationSeconds > currentTime
      );

      const future = upcoming.filter((contest: any) => contest.startTimeSeconds > currentTime);

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
}

export default ContestService;
