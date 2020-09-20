import axios from "../axios";
import { createAuthProvider } from "./Auth";

export const {useAuth, authPost, authGet,authDelete,authPatch, login, logout} = createAuthProvider();

export const DlogService = {
  getDlogs: async () => {
    console.log("Getting logs")
    const res = await authGet("/dlogs");
    return res.data;
  },
  addDLog: async (task) => {
    const item = await authPost("/dlogs/addDlog", { task: task });
    return item.data;
  },

  removeDlog: async (id) => {
    await authDelete("/dlogs/" + id);
  },
  updateDlog: async (id, task) => {
    await authPatch("/dlogs/" + id, { task: task });
  },

  getLearnings: async () => {
    const res = await authPost("/learnings");
    return res.data;
  },
  addLearnings: async (learning, from, incident) => {
    const item = await authPost("/learnings/addLearning", {
      learning,
      from,
      incident,
    });
    return item.data;
  },

  removeLearnings: async (id) => {
    await authDelete("/learnings/" + id);
  },
  updateLearnings: async (id, learning, from, incident) => {
    await authPatch("/learnings/" + id, {
      learning,
      from,
      incident,
    });
  },
  getLearningsById: async (id)=>{
   const res = await authGet("/"+id)
   return res.data
  },
  confirmUser:async({email,password})=>
  {
    try {
      const res = await axios.post("/auth/login",{
        email,
        password
      })
      console.log("object:",res)
      if(res.status == 200){
        login(res.data)
        return res
      }
        
    } catch (error) {
      
    }
    
    
  },
  registerUser:async({name,email,password})=>
  {
    try {
      const res = await axios.post("/auth/register",{
        name,
        email,
        password
      })
      if(res.status == 200)
        login(res)
      return res
    } catch (error) {
      
    }
    
    
  },
  logOut:async()=>{
    logout()
  }
};
