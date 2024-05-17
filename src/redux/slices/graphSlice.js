import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  edges: [],
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addNode: (state, action) => {
      state.nodes.push(action.payload);
    },
    deleteNode: (state, action) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      state.edges = state.edges.filter(
        (edge) =>
          edge.source !== action.payload && edge.target !== action.payload
      );
    },
    addEdge: (state, action) => {
      state.edges.push(action.payload);
    },
    deleteEdge: (state, action) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
    },
    updateNode: (state, action) => {
      const index = state.nodes.findIndex(
        (node) => node.id === action.payload.id
      );
      if (index !== -1) {
        state.nodes[index] = { ...state.nodes[index], ...action.payload };
      }
    },
    pasteNode: (state, action) => {
      state.nodes.push(action.payload);
    },
  },
});

export const {
  addNode,
  deleteNode,
  addEdge,
  deleteEdge,
  updateNode,
  pasteNode,
} = graphSlice.actions;
export default graphSlice.reducer;
