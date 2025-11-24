import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchItems, getItemById } from "../../services/itemsService";

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const res = await searchItems(query, page);
      return {
        list: res.docs,
        numFound: res.numFound
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getItemById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    selectedItem: null,

    loadingList: false,
    loadingItem: false,

    errorList: null,
    errorItem: null,

    totalPages: 1,
    query: "",
    page: 1
  },

  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchItems.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload.list;
        const num = action.payload.numFound || 0;
        state.totalPages = Math.ceil(num / 20);
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload;
      })

      // item
      .addCase(fetchItemById.pending, (state) => {
        state.loadingItem = true;
        state.errorItem = null;
        state.selectedItem = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loadingItem = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loadingItem = false;
        state.errorItem = action.payload;
      });
  }
});

export const { setQuery, setPage } = itemsSlice.actions;

export default itemsSlice.reducer;
