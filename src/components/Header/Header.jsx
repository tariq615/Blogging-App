import React, {useState} from "react";
import { useSelector } from "react-redux";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate, NavLink } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to handle menu visibility

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/My-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle menu visibility
  };

  return (
    <header>
      <nav
        className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
          bg-white
        "
      >
        <Link to={"/"}>
          <Logo />
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="menu-button"
          class="h-8 w-8 cursor-pointer md:hidden block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleMenu} // Attach toggle function to the button
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <div className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto`}
          id="menu">
          <ul
            className="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0"
          >
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <NavLink
                    to={`${item.slug}`}
                    className={({ isActive }) =>
                      `md:p-4 py-2 block  ${
                        isActive ? "text-orange-700" : "text-gray-700"
                      } lg:hover:bg-transparent lg:border-0 hover:text-orange-700 font-bold`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            {/* // <li> */}
            {/* //{" "} */}
            {/* <a className="md:p-4 py-2 block hover:text-purple-400" href="#" */}
            {/* // Features </a> */}
            {/* // </li> */}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
// /*<header className="py-3 shadow bg-gray-500">
//   <Container>
//     <nav className="flex">
//       <div className="mr-4">
//         <Link to={"/"}>
//           <Logo width="70px" />
//         </Link>
//       </div>
//       <ul className="flex ml-auto">
//         {navItems.map((item) =>  */
//           item.active ? (
//             <li key={item.name}>
//               <button
//                 onClick={() => navigate(item.slug)}
//                 className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
//               >
//                 {item.name}
//               </button>
//             </li>
//           ) : null
//         )}
//         {authStatus && (
//           <li>
//             <LogoutBtn />
//           </li>
//         )}
//       </ul>
//     </nav>
//   </Container>
// </header>
