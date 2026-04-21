import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { seedItems } from "@/lib/seed";
import { makeSerial, nextSeq } from "@/lib/code";
import type { Item, ItemKind, ItemStatus, Category } from "@/lib/types";

type CatalogState = { items: Item[] };
const initialState: CatalogState = { items: seedItems };

export type AddItemInput = {
  kind: ItemKind;
  name: string;
  author: string;
  category: Category;
  procurementDate: string;
  quantity: number;
  cost?: number;
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemInput>) {
      const input = action.payload;
      const serials = state.items
        .filter(
          (i) => i.category === input.category && i.kind === input.kind,
        )
        .map((i) => i.serialNo);
      const seq = nextSeq(serials);
      const serial = makeSerial(input.category, input.kind, seq);
      state.items.push({
        id: serial,
        kind: input.kind,
        name: input.name,
        author: input.author,
        category: input.category,
        serialNo: serial,
        status: "Available",
        cost: input.cost ?? 0,
        procurementDate: input.procurementDate,
        quantity: input.quantity,
      });
    },
    updateItemStatus(
      state,
      action: PayloadAction<{ serialNo: string; status: ItemStatus }>,
    ) {
      const idx = state.items.findIndex(
        (i) => i.serialNo === action.payload.serialNo,
      );
      if (idx !== -1) {
        state.items[idx].status = action.payload.status;
      }
    },
    updateItem(state, action: PayloadAction<Item>) {
      const idx = state.items.findIndex(
        (i) => i.serialNo === action.payload.serialNo,
      );
      if (idx !== -1) state.items[idx] = action.payload;
    },
  },
});

export const { addItem, updateItemStatus, updateItem } = catalogSlice.actions;
export default catalogSlice.reducer;
