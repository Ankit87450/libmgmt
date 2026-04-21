import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { seedIssues, seedRequests } from "@/lib/seed";
import type { Issue, IssueRequest } from "@/lib/types";

type TxnState = { issues: Issue[]; requests: IssueRequest[] };
const initialState: TxnState = {
  issues: seedIssues,
  requests: seedRequests,
};

let nextIssueSeq = seedIssues.length + 1;

const txnSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    issueBook: {
      reducer(state, action: PayloadAction<Issue>) {
        state.issues.push(action.payload);
      },
      prepare(input: {
        itemId: string;
        serialNo: string;
        memberId: string;
        issueDate: string;
        returnDueDate: string;
        remarks?: string;
      }) {
        const id = `I${String(nextIssueSeq++).padStart(3, "0")}`;
        const issue: Issue = {
          id,
          itemId: input.itemId,
          serialNo: input.serialNo,
          memberId: input.memberId,
          issueDate: input.issueDate,
          returnDueDate: input.returnDueDate,
          remarks: input.remarks,
          fineCalculated: 0,
          finePaid: false,
          status: "Active",
        };
        return { payload: issue };
      },
    },
    updateIssueOnReturn(
      state,
      action: PayloadAction<{
        id: string;
        actualReturnDate: string;
        remarks?: string;
        fineCalculated: number;
      }>,
    ) {
      const idx = state.issues.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        state.issues[idx].actualReturnDate = action.payload.actualReturnDate;
        state.issues[idx].remarks = action.payload.remarks;
        state.issues[idx].fineCalculated = action.payload.fineCalculated;
      }
    },
    completeReturn(
      state,
      action: PayloadAction<{ id: string; finePaid: boolean }>,
    ) {
      const idx = state.issues.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        state.issues[idx].finePaid = action.payload.finePaid;
        state.issues[idx].status = "Returned";
      }
    },
  },
});

export const { issueBook, updateIssueOnReturn, completeReturn } =
  txnSlice.actions;
export default txnSlice.reducer;
