import Access from "../../models/access";

export default interface IAccessDataSource {
  create(access: Access): Promise<Access | null>;
  getByDate(date: string): Promise<Access[]>;
}