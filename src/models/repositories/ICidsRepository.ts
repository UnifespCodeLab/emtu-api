import { CidsDto } from "../../dtos/cidsDto";

interface ICidsRepository {
  getAll() : Promise<CidsDto[]>
}

export {ICidsRepository}