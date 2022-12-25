import { CidsDto } from "../../dtos/cidsDto";

export default interface ICidsDataSource {
  getAll(): Promise<CidsDto[]>;
}