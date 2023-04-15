import { ReportDto } from '../../dtos/reportDto';

export default interface IReportsDataSource {
  exists(params: ReportDto): Promise<boolean>;
}
