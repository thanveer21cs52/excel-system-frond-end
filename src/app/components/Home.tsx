"use client";
import React, { useEffect, useState } from "react";
import Upload from "./upload";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Loadinggear from "./Loading";
import LoadingGear from "./Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward,faBackward } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [fetchdata, setfetch] = useState(true);
  const [edit, setedit] = useState(false);
  const [table, settable] = useState<any[]>([]);
  const [filename, setfilename] = useState<any>({ filename: "", description: "" });
  const [data, setdata] = useState<any[]>([]);
  const [show,setshow]=useState(false)
const [loading,setloading]=useState(false)
const [page,setpage]=useState(0)
const [currenttable,setcurrenttable]=useState<{tablename:null|string,
  tablelength:number,
  idname:null|string,
  currentid:null|string|number
}>({
  tablename:null,
  tablelength:0,
    idname:null,currentid:null
})
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<any>();
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const [currentid,setcurruentid]=useState<any>(null)
  const handleSubmit = async (table:any,idname:any,id:any) => {
    setShowPopup(false);
    setloading(true)
    console.log("Submitted Data:", formData,table,idname,id);
    const req = await fetch(`https://excel-system-backend.onrender.com/update/${table}/${idname}/${id}`,{
       method: 'PUT', 
  headers: {
    'Content-Type': 'application/json' 
  },
      body:JSON.stringify(formData)
    })
    const result=await req.json()
    setloading(false)
    if(result.message=='success'){
      tabledata(table,page)
    }
    else{
      alert('failed')
    }
    
  };
  function openedit(value: any) {
    setfilename(value);
    console.log(value);
  }

  useEffect(() => {
    fetchtables();
  }, [fetchdata]);

  async function fetchtables() {
    setloading(true)
 
    const req = await fetch("https://excel-system-backend.onrender.com/gettables");
    const data = await req.json();
    setloading(false)
    settable(data.table);

  }
  const handleFrontendExport = async (tablename:any) => {
    const res = await fetch(`https://excel-system-backend.onrender.com/tabledata/${tablename}`);
    const { data } = await res.json();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${tablename}.xlsx`);
  };

  function refetch() {
    setfetch(!fetchdata);
  }

  function open(value: any) {
    setedit(value);
    setfetch(!fetchdata);
  }

  async function tabledata(tablename: string,pages:number) {
    
    setshow(true)
       setloading(true)
    const req = await fetch(`https://excel-system-backend.onrender.com/tabledata/${tablename}/${pages}`);
    const data = await req.json();
       setloading(false)
      setcurrenttable(prev => ({
  ...prev,
  tablename: tablename,
  tablelength: data.length[0].count,
  idname: data.idname
}));

    setdata(data.data);
  }
  
  async function tabledelete(tablename: string) {
    const confirm=window.confirm("are you want to delete this table "+tablename)
    if(confirm){
       const req = await fetch(`https://excel-system-backend.onrender.com/delete/${tablename}`,{
      method:'delete'
    });
    const data = await req.json();
    if(data.message=='success'){
      alert('table deleted successfully')
      fetchtables()
    }
    else{
         alert('table not deleted')
    }

    }
    else{
      return null
    }
    


  }

  
  
  if(show){
    return loading?<LoadingGear/>:<div className=" p-4 w-8/9 text-white flex flex-col justify-between space-y-4 min-h-[80vh] relative ">
      {showPopup&&<div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black/60 rounded-lg shadow-lg p-12 w-3/8">
            <h2 className="text-xl font-bold mb-4">Edit</h2>
            {Object.keys(formData).map((key,index) => {
           
              return <div key={key} className="mb-3">
                <div className={`flex ${index==0 &&'text-gray-400'}`}>
                  <label className="block text-sm font-medium mb-1 w-2/6">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className={"w-full border border-gray-300 rounded px-2 py-1"}
                  disabled={index==0}
                />

                </div>
                
              </div>
            })}

            <div className="flex justify-end mt-4">
              <button
                onClick={(e:any)=>handleSubmit(currenttable.tablename,currenttable.idname,formData[Object.keys(formData)[0]])}
                className="bg-violet-600 text-white px-4 py-2 rounded mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>}
         <button onClick={()=>{setshow(false)
          setpage(0)
         }} className="px-2 py-1 border-2 text-white shadow-white text-sm font-mono p-2 rounded border-violet-500 border-dashed cursor-pointer w-fit ">back</button>
        {data.length === 0 ? (
          <h1 className="text-white text-center">No data available</h1>
        ) : (
          loading?<div className="text-4xl text-gray-400 animate-pulse font-medium text-center  ">loading...</div>:
          
          <div className="overflow-x-auto ">
          <table className="min-w-full border border-violet-400 text-white/80 rounded-lg shadow-sm text-sm my-3 ">
            <thead className="">
              <tr>
                {Object.keys(data[0]).map((col, index) => (
                  <th
                    key={col + index}
                    className="border-b border-violet-400 bg-violet-700 px-4 py-2 text-left font-semibold capitalize"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-800/15 cursor-pointer" onClick={() => {
                  setFormData(row)
                  setShowPopup(true)}}>
                  {Object.keys(data[0]).map((col, index1) => {
                   
                    
                    return <td key={col + index1} className="border-b border-violet-400 px-4 py-3">
                      {col.toLowerCase().includes("date")
                        ? new Date(row[col]).toLocaleDateString()
                        : row[col]}
                    </td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        <div className="mt-2 px-2 flex justify-between w-full">
        <button onClick={()=>{
        if(page > 0){
      
          setpage(page-1);
               tabledata(currenttable.tablename||'',page-1)
         
        }
      }} className={`${page > 0 ?'text-violet-600': 'text-gray-600'}`}>
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <div className="flex justify-center items-center">
         {(page*10)+1}-{(page+1)*10} of {currenttable.tablelength} 
      </div>
        <button onClick={()=>{
        if((page+1)*10 < currenttable.tablelength){
          
          setpage(page+1);
           tabledata(currenttable.tablename||'',page+1)
        
        }
        
      }} className={`${(page+1)*10 < currenttable.tablelength ?'text-violet-600': 'text-gray-600'}`}>
        <FontAwesomeIcon icon={faForward} />
      </button>
      
      


      </div>
      </div>
  }

  return (
    <div className="flex flex-col justify-center items-center min-w-full  text-white">
      <div className="flex-col justify-center items-center w-3/5 ">
        <Upload refetch={refetch} />
      </div>


      <div className="flex flex-col justify-center items-center  w-2/4 text-white">
       {loading?<LoadingGear/>:
        <div className="text-black p-4 rounded-lg w-full mt-5">
         
          <h2 className="text-gray-300 text-xl font-bold mb-3 font-mono text-center">Available Tables</h2>
          <div className="flex flex-col space-y-2 w-full">
            {table.length > 0 ? (
              table.map((tbl: any, index: number) => (
                <h1
                 
                  key={index}
                  className="border text-white shadow-white text-sm font-mono p-2 rounded border-gray-400 border-dashed cursor-pointer text-center transition flex  justify-between px-3"
                >
                 <span>{tbl.table_name}</span> 
                 <div className="flex  space-x-5">
                   <button  onClick={() => tabledata(tbl.table_name,page)} className="text-violet-400 hover:text-white  ">view</button>
                                    <a href={`https://excel-system-backend.onrender.com/download/${tbl.table_name}`}  className="text-green-400 hover:text-white  " download={true}>export</a>
                 <button  onClick={() => tabledelete(tbl.table_name)} className="text-red-400 hover:text-white  ">delete</button>

                 {/* <button  onClick={() => handleFrontendExport(tbl.table_name)} className="text-red-400 hover:text-white  ">export</button> */}
                 </div>
                
                </h1>
              ))
            ) : (
              <p className="text-gray-400  text-center text-sm font-mono py-3">No tables found</p>
            )}
          </div>
        </div>}
      </div>

   

    </div>
  );
}

export default Home;
