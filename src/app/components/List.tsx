'use client'

import { useEffect, useState } from "react";
import { BiFileBlank, BiRename } from "react-icons/bi";
import { BsDownload, BsTrashFill } from "react-icons/bs";
import { FaPenSquare } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { MdDescription } from "react-icons/md";



    



function List({fetchdata,filename,open}:{fetchdata:any,filename:any,open:any}) {
    const [file,setfile]=useState<any[]>([])
    async function fetchfiles(){
        const req=await fetch('http://localhost:3001/files',{
            cache:"no-cache"
        })
        const data=await req.json()
        setfile(data)
       

    }

    
    useEffect(()=>{
        fetchfiles()
    },[fetchdata])
      async function editfile(filename:any){
        const filenamewithext=filename.split('.')
       const name= window.prompt("file name",filenamewithext[0])
      
       if(name){
        const req=await fetch(`http://localhost:3001/rename/${filename}/${name+'.'+filenamewithext[1]}`,{
            method:"put"
        })
        const data=await req.json()
        if(data.message=='success'){
            fetchfiles()
            return
        }

        }
        return null
        
       }
    
    async function deletefile(filename:string){
        const confirm=window.confirm('Are want delete this file '+filename)
        if(confirm){
            const req=await fetch(`http://localhost:3001/delete/${filename}`,{
            method:"delete"
        })
        const data=await req.json()
        if(data.message=='success'){
            fetchfiles()
            return
        }

        }
        return
        
        


    }
  
async function downloadFile(filename: string) {
  try {
    const response = await fetch(`http://localhost:3001/download/${filename}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    
    const blob = await response.blob();

 
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; 
    document.body.appendChild(a);
    a.click();
    a.remove();

    
    window.URL.revokeObjectURL(url);

    console.log("Download started for:", filename);
  } catch (err) {
    console.error("Error downloading file:", err);
  }
}

    return (
        <div className="flex flex-col justify-center items-center w-full">
           <table className="w-3/5 border border-blue-300 text-xs mt-5 border-collapse bg-gray-800">
  <thead className="bg-black ">
    <tr>
      <th className="border border-blue-300 px-2 py-2 text-left w-5/12">File Name</th>
      <th className="border border-blue-300 px-2 py-2 text-left w-5/12">Description</th>
      <th className="border border-blue-300 px-2 py-2 text-center w-2/12">Actions</th>
    </tr>
  </thead>
  <tbody>
    {file.map((file: any) => (
      <tr key={file.id} className="">
     
        <td className="border border-blue-300 px-2 py-2 ">
            <span className="flex gap-0.5 items-center"> <FaFile className="text-amber-100" />{file.filename}</span>
         
        </td>


        <td className="border border-blue-300 px-2 py-2">
          {file.description}
        </td>


        <td className="border border-blue-300 px-2 py-2">
          <div className="flex justify-center items-center space-x-2">
            
                <a href={`http://localhost:3001/download/${file.filename}`} download={true}>
                <button
              type="button"
              className="bg-green-400 p-2 rounded-xs font-bold"
            //   onClick={() => downloadFile(file.filename)}
            >
                <BsDownload />
                
              
            </button>
                </a>
            
            <button
              type="button"
              className="bg-red-500 p-2 rounded-xs font-bold"
              onClick={() => deletefile(file.filename)}
            >
              <BsTrashFill />
            </button>
            <button
              type="button"
              className="bg-blue-500 p-2 rounded-xs font-bold"
              onClick={() =>{
                //  editfile(file.filename)
                filename({filename:file.filename,
                  description:file.description
                })
                open(true)}
              }
            >
              <FaPenSquare />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
       
    );
}

export default List;