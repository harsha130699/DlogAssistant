import axios from '../axios';


export const DlogService = {

    getDlogs : async()=>{
        const res = await axios.get("/dlogs")
        return res.data
    },
    addDLog : async(task) => {
      const item =await axios.post("/dlogs/addDlog",{task:task})
      return item.data
    } ,

     removeDlog : async (id) => {
        await axios.delete("/dlogs/"+id)
      }
      ,
     updateDlog : async (id,task) => {
        await axios.patch("/dlogs/"+id,{task:task})
      }
}
