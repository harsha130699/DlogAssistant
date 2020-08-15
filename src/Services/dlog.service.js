import axios from "../axios";

export const DlogService = {
  getDlogs: async () => {
    const res = await axios.get("/dlogs");
    return res.data;
  },
  addDLog: async (task) => {
    const item = await axios.post("/dlogs/addDlog", { task: task });
    return item.data;
  },

  removeDlog: async (id) => {
    await axios.delete("/dlogs/" + id);
  },
  updateDlog: async (id, task) => {
    await axios.patch("/dlogs/" + id, { task: task });
  },

  getLearnings: async () => {
    const res = await axios.get("/learnings");
    return res.data;
  },
  addLearnings: async (learning, from, incident) => {
    const item = await axios.post("/learnings/addLearning", {
      learning,
      from,
      incident,
    });
    return item.data;
  },

  removeLearnings: async (id) => {
    await axios.delete("/learnings/" + id);
  },
  updateLearnings: async (id, learning, from, incident) => {
    await axios.patch("/learnings/" + id, {
      learning,
      from,
      incident,
    });
  },
  getLearningsById: async (id)=>{
   const res = await axios.get("/"+id)
   return res.data
  }
};
