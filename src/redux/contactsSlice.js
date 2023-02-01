import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { fetchContacts, addContact, deleteContact } from './operations';

const extraActions = [fetchContacts, addContact, deleteContact];

const getActionWithType = type => extraActions.map(action => action[type]);

const fetchContactsSuccessReducer = (state, action) => {
  state.items = action.payload;
};

const addContactSuccessReducer = (state, action) => {
  state.items.push(action.payload);
};

const deleteContactSuccessReducer = (state, action) => {
  const index = state.items.findIndex(contact => contact.id === action.payload);
  state.items.splice(index, 1);
};

const anySuccessReducer = state => {
  state.isLoading = false;
  state.error = null;
};

const anyPendingReducer = state => {
  state.isLoading = true;
};

const anyRejectedReducer = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  extraReducers: builder =>
    builder
      .addCase(fetchContacts.fulfilled, fetchContactsSuccessReducer)
      .addCase(addContact.fulfilled, addContactSuccessReducer)
      .addCase(deleteContact.fulfilled, deleteContactSuccessReducer)
      .addMatcher(isAnyOf(...getActionWithType('fulfilled')), anySuccessReducer)
      .addMatcher(isAnyOf(...getActionWithType('pending')), anyPendingReducer)
      .addMatcher(
        isAnyOf(...getActionWithType('rejected')),
        anyRejectedReducer
      ),
});

export const contactsReducer = contactsSlice.reducer;

// // Before buider

// const handlePending = state => {
//   state.isLoading = true;
// };

// const handleRejected = (state, action) => {
//   state.isLoading = false;
//   state.error = action.payload;
// };

// const contactsSlice = createSlice({
//   name: 'contacts',
//   initialState: {
//     items: [],
//     isLoading: false,
//     error: null,
//   },
//   extraReducers: {
//     [fetchContacts.pending]: handlePending,
//     [fetchContacts.fulfilled](state, action) {
//       state.isLoading = false;
//       state.error = null;
//       state.items = action.payload;
//     },
//     [fetchContacts.rejected]: handleRejected,

//     [addContact.pending]: handlePending,
//     [addContact.fulfilled](state, action) {
//       state.isLoading = false;
//       state.error = null;
//       // return [action.payload, ...state.items];
//       state.items.push(action.payload);
//     },
//     [addContact.rejected]: handleRejected,

//     [deleteContact.rejected]: handleRejected,
//     [deleteContact.pending]: handlePending,
//     [deleteContact.fulfilled](state, action) {
//       state.isLoading = false;
//       state.error = null;
//       const index = state.items.findIndex(
//         contact => contact.id === action.payload
//       );
//       state.items.splice(index, 1);
//       // return state.items.filter(contact => contact.id !== action.payload);
//     },
//   },
// });

// export const contactsReducer = contactsSlice.reducer;

// // // // // ////

// const contactsReducer = createReducer(contactsInitialState, {
//   [addContact]: (state, action) => [action.payload, ...state],
//   [deleteContact]: (state, action) => {
//     return state.filter(contact => contact.id !== action.payload);
//   },
// });

// const contactsSlice = createSlice({
//   name: 'contacts',
//   initialState: {
//     items: [],
//     isLoading: false,
//     error: null,
//   },
//   reducers: {
//     addContact: {
//       reducer(state, action) {
//         return [action.payload, ...state];
//       },
//       prepare(name, number) {
//         return {
//           payload: {
//             id: nanoid(),
//             name,
//             number,
//           },
//         };
//       },
//     },
//     deleteContact(state, action) {
//       return state.filter(contact => contact.id !== action.payload);
//     },
//   },
// });
