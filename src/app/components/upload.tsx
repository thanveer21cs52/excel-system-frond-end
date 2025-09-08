'use client'
import { ChangeEvent, useState } from "react";
import { BiFileBlank, BiFileFind } from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { FaFileArrowUp } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";


function Upload({refetch}:{refetch:any}) {
   function handlefile(e: any) {
    const files = e.target.files?.[0];
    if (files) {
        setfile(files);
        console.log(files);
    }
}

    async function handlesubmit(e:any){
        e.preventDefault()
        setlooding(true)
    
     
         const formData = new FormData();
         if (!file) return;


    formData.append("excel", file);




      const res = await fetch("https://excel-system-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json(); 
      if(data.message=="success"){
    
        alert("upload successfully")
        setfile(null)
        setlooding(false)
        refetch()
        
      }
      else{
        setfile(null)
        alert("Upload failed");
        setlooding(false)

      }
    

    }
    const [file,setfile]=useState<File|null>(null)
    const [loading,setlooding]=useState<boolean>(false)
    
    return (
   <form
  className="flex flex-col justify-center items-center cursor-pointer text-sm min-w-full font-mono space-y-5"
  onSubmit={handlesubmit}
  encType="multipart/form-data"
  
>

  {file == null && (
    <div className="flex flex-col items-center justify-center min-w-full p-6">
      <input
        type="file"
        id="fileUpload"
        name="myfile"
        className="hidden"
        onChange={handlefile}
      />

      <label
        htmlFor="fileUpload"
        className=" flex p-6 flex-col justify-center items-center space-y-4 py-12 
        border-2 border-dashed border-white/35 rounded-2xl shadow-md border-l-violet-800  border-t-violet-800
       
        cursor-pointer w-[60%]"
      >
        <BsUpload className="text-violet-900 text-3xl " />
        <h2 className="text-white text-lg">
          <span className="font-bold text-violet-800">Click here</span> to upload your file
        </h2>
        <p className="text-gray-400 text-xs">Supported formats: xls,xlsx</p>
      </label>
    </div>
  )}

  {file != null && (
    <div className="flex flex-col  text-white p-6 min-w-[60%] justify-center 
    border border-gray-600 rounded-2xl mt-5 space-y-4  shadow-[5px_5px_15px_rgba(255,255,255,0.2),-5px_-5px_15px_rgba(0,0,0,0.3)]">
      <h2 className="text-start text-xl font-bold text-violet-600 ">File Details</h2>

      <p className="flex w-full justify-start items-center gap-2  p-2 rounded-md">
        <BiFileBlank className="text-yellow-400 text-lg" />
        <span className="font-bold text-sm">Filename:</span>
        <span className="truncate">{file.name}</span>
      </p>{
        loading?<h1 className="min-w-full text-center animate-bounce">Loading....</h1>:
      

      <div className="flex justify-between gap-3 text-white">

        <button
          type="button"
          className="bg-red-700 hover:bg-red-600 p-2 rounded-lg font-bold w-1/2 
          flex justify-center items-center gap-2"
          onClick={() => setfile(null)}
          hidden={loading}
        >
          <GiCancel className="text-white" /> Close
        </button>

  
        <button
          type="submit"
          className="bg-violet-700  hover:bg-violet-500 p-2 rounded-lg font-bold w-1/2 
          flex justify-center items-center gap-2 transition-all duration-200"
          hidden={loading}
        >
          <FiUpload className="text-white" /> Upload
        </button>
      </div>}
    </div>
  )}
</form>
    );
}

export default Upload;
