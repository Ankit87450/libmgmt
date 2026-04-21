export type Category =
  | "Science"
  | "Economics"
  | "Fiction"
  | "Children"
  | "Personal Development";

export const CATEGORIES: Category[] = [
  "Science",
  "Economics",
  "Fiction",
  "Children",
  "Personal Development",
];

export const CATEGORY_PREFIX: Record<Category, string> = {
  Science: "SC",
  Economics: "EC",
  Fiction: "FC",
  Children: "CH",
  "Personal Development": "PD",
};

export type ItemKind = "book" | "movie";

export type ItemStatus =
  | "Available"
  | "Unavailable"
  | "Removed"
  | "On Repair"
  | "To Replace";

export const ITEM_STATUSES: ItemStatus[] = [
  "Available",
  "Unavailable",
  "Removed",
  "On Repair",
  "To Replace",
];

export type Item = {
  id: string;
  kind: ItemKind;
  name: string;
  author: string;
  category: Category;
  serialNo: string;
  status: ItemStatus;
  cost: number;
  procurementDate: string;
  quantity: number;
};

export type MembershipDuration = "6m" | "1y" | "2y";

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  contactAddress: string;
  aadhaar: string;
  startDate: string;
  endDate: string;
  duration: MembershipDuration;
  status: "Active" | "Inactive";
  finePending: number;
};

export type AppUser = {
  id: string;
  name: string;
  active: boolean;
  isAdmin: boolean;
  username: string;
  password: string;
};

export type Issue = {
  id: string;
  itemId: string;
  serialNo: string;
  memberId: string;
  issueDate: string;
  returnDueDate: string;
  actualReturnDate?: string;
  remarks?: string;
  fineCalculated: number;
  finePaid: boolean;
  status: "Active" | "Returned";
};

export type IssueRequest = {
  id: string;
  memberId: string;
  itemName: string;
  requestedDate: string;
  fulfilledDate?: string;
};
