"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";


export default function LoadingGear() {
  return (
    <div className="flex items-center gap-4 justify-center">

      <FontAwesomeIcon icon={faGear} spin size="1x" className="text-gray-100" />




      <span className="text-xl font-medium text-gray-300 animate-pulse">Loading</span>
    </div>
  );
}
