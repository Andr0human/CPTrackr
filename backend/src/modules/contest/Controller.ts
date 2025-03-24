import { Request, Response } from 'express';
import { SystemResponse } from '../../lib/response-handler';
import ContestService from './Service';

class ContestController {
  private readonly contestService: ContestService;

  constructor() {
    this.contestService = new ContestService();
  }

  getContest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { body } = req;
      const {
        platforms = ['codeforces', 'codechef', 'leetcode'],
        ids,
        startDate,
        endDate,
      } = body;

      // Initialize array to store promises for selected platforms
      const platformPromises = [];
      const status: any = [];

      if (body.showPast) status.push('past');

      if (body.showPresent) status.push('present');

      if (body.showUpcoming) status.push('future');

      // Only fetch data from platforms specified in filters
      if (platforms.includes('codechef')) {
        platformPromises.push(this.contestService.getCodechefData());
      }

      if (platforms.includes('codeforces')) {
        platformPromises.push(this.contestService.getCodeforcesData());
      }

      if (platforms.includes('leetcode')) {
        platformPromises.push(this.contestService.getLeetCodeData());
      }

      // Execute all selected platform requests concurrently
      const results = await Promise.all(platformPromises);

      // Combine all results into a single array
      let contestData: any = [];
      results.forEach((data) => {
        contestData = [...contestData, ...data];
      });

      // Apply ID filter if IDs are provided
      if (Array.isArray(ids)) {
        contestData = this.contestService.filterByIds(contestData, ids);
      }

      // Apply date range filter if dates are provided
      contestData = this.contestService.filterByDateRange(
        contestData,
        startDate,
        endDate
      );

      const finalData = this.contestService
        .sortContestsByStartTime(contestData)
        .filter((contest) => status.includes(contest.status));

      // Return the combined data
      new SystemResponse(
        res,
        'Contest data fetched successfully',
        finalData
      ).ok();
    } catch (err: unknown) {
      console.error('Error fetching contest data', err);
      new SystemResponse(
        res,
        'Contest data fetched successfully',
        err
      ).internalServerError();
    }
  };
}

export default ContestController;
