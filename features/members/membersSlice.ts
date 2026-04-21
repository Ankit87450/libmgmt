import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addMonths, format } from "date-fns";
import { seedMembers } from "@/lib/seed";
import type { Member, MembershipDuration } from "@/lib/types";

type MembersState = { members: Member[] };
const initialState: MembersState = { members: seedMembers };

function durationMonths(d: MembershipDuration): number {
  return d === "6m" ? 6 : d === "1y" ? 12 : 24;
}

export function computeEndDate(
  startISO: string,
  d: MembershipDuration,
): string {
  return format(addMonths(new Date(startISO), durationMonths(d)), "yyyy-MM-dd");
}

let nextMemberSeq = seedMembers.length + 1;

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: {
      reducer(state, action: PayloadAction<Member>) {
        state.members.push(action.payload);
      },
      prepare(input: {
        firstName: string;
        lastName: string;
        contactNumber: string;
        contactAddress: string;
        aadhaar: string;
        startDate: string;
        duration: MembershipDuration;
      }) {
        const id = `M${String(nextMemberSeq++).padStart(3, "0")}`;
        const endDate = computeEndDate(input.startDate, input.duration);
        const member: Member = {
          id,
          firstName: input.firstName,
          lastName: input.lastName,
          contactNumber: input.contactNumber,
          contactAddress: input.contactAddress,
          aadhaar: input.aadhaar,
          startDate: input.startDate,
          endDate,
          duration: input.duration,
          status: "Active",
          finePending: 0,
        };
        return { payload: member };
      },
    },
    extendMembership(
      state,
      action: PayloadAction<{ id: string; extension: MembershipDuration }>,
    ) {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) {
        const m = state.members[idx];
        m.endDate = computeEndDate(m.endDate, action.payload.extension);
        m.status = "Active";
      }
    },
    cancelMembership(state, action: PayloadAction<{ id: string }>) {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.members[idx].status = "Inactive";
    },
    setFinePending(
      state,
      action: PayloadAction<{ id: string; amount: number }>,
    ) {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.members[idx].finePending = action.payload.amount;
    },
  },
});

export const { addMember, extendMembership, cancelMembership, setFinePending } =
  membersSlice.actions;
export default membersSlice.reducer;
