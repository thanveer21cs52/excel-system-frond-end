import Image from "next/image";
import Home from "./components/Home";

export default function page() {
  return (
    <div className="min-w-full flex flex-col justify-center items-center inset-0 bg-black/30 backdrop-blur-sm min-h-screen">
       <Home/>

    </div>
   
    
  );
}
