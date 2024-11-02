// import React, { useState } from "react";
// import appWriteService from "../appwrite/config";
// import { Link } from "react-router-dom";
// import parse from "html-react-parser";

// function PostCard({ $id, title, featuredimage, content }) {
//   return (
//     <Link to={`post/${$id}`}>
//       <div
//         key={$id}
//         className=" bg-white border border-gray-200 rounded-lg shadow dark:bg-neutral-100 w-[400px] h-[550px]"
//       >
//         <img
//           className="rounded-t-lg  w-full h-[350px] object-cover"
//           src={appWriteService.getFilePreview(featuredimage)}
//           alt={title}
//         />
//         <div className="p-5">
//           <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-900">
//             {title}
//           </h5>
//           <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
//             {parse(
//               content.split(" ").slice(0, 18).join(" ") +
//                 (content.split(" ").length > 18 ? "..." : "")
//             )}
//           </p>
//           <button className="mt-10 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-700 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
//             Read more
//             <svg
//               class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 14 10"
//             >
//               <path
//                 stroke="currentColor"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M1 5h12m0 0L9 1m4 4L9 9"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default PostCard;

import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredimage}) {
    
  return (
    <Link to={`/post/${$id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4">
  <div className="flex justify-center mb-4">
    <img 
      src={appwriteService.getFilePreview(featuredimage)} 
      alt={title}
      className="rounded-xl object-cover w-full h-64 sm:h-72 md:h-80 lg:h-96" 
    />
  </div>
  <h2 className="text-lg font-bold text-center md:text-xl">{title}</h2>
</div>

    </Link>
  )
}


export default PostCard
