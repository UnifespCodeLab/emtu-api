import { ReportsDto } from '../../dtos/reportsDto';

export default interface IReportsDataSource {
  exists(params: ReportsDto): Promise<boolean>;
}
