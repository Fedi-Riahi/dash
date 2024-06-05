import Link from "next/link";
import { UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const Navbar = () => {

  return (
    <nav className="bg-black pb-2 dark:bg-gray-900">
      <div className="flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="flex  flex-grow gap-4 items-end ">
          <Link
            href="/"
            className='text-xl ml-7 font-bold text-gray-800 dark:text-white"'
          >
            <Image src="/log.png" alt="Mercedes" width={200} height={200} />
          </Link>
        </div>

        {/* Search input */}
        <div className="flex justify-center items-center gap-10">
          <div className="flex justify-center mr-7 relative">
            <UserIcon className="text-white cursor-pointer h-6 w-6" />
              <CheckCircleIcon className="text-blue-500 h-5 w-5 absolute -top-3 -right-3" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
