import SortEnum from "./SortEnum";

export default class Sorting<T extends string> {
  constructor(
    public sortBy?: T,
    public sortDirection = SortEnum.NONE
  ) {}
}
