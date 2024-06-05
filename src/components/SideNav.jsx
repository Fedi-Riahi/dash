"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { PiEngineBold } from "react-icons/pi";
import { SiMercedes } from "react-icons/si";
import { FaList } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Image from "next/image";

const SideNav = () => {
  const { status, data: session } = useSession();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="bg-black/90 w-72  py-10 h-screen">
        <ul className="flex flex-col gap-5 px-10">
          <Link
            href="/dashboard"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/dashboard_icon.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 w-fit px-2 text-left hover:bg-black/90 text-white rounded-lg">
              Dashboard
            </li>
          </Link>
          <Link
            href="/brands"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/wheel.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Brands
            </li>
          </Link>
          <Link
            href="/listings"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/car.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Listing
            </li>
          </Link>
         
          <Link
            href="/carparts"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/settings.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Car Parts
            </li>
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/cart.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Orders
            </li>
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/service.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Services
            </li>
          </Link>
          <Link
            href="/appointment"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/calender.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Appointments
            </li>
          </Link>
          <Link
            href="/quote"
            className="flex items-center justify-start gap-1 w-full "
          >
            <Image
              src="/calender.png"
              alt=""
              className="object-cover"
              width={28}
              height={28}
            />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Quotes
            </li>
          </Link>
          <Link
            href="/admins"
            className="flex items-center justify-start gap-1 w-full "
          >
            <MdOutlineAdminPanelSettings className="h-7 w-7 text-white" />
            <li className="py-3 px-2 hover:bg-black/90 text-white rounded-lg">
              Admins
            </li>
          </Link>
          

          <div className="flex-1 mt-60">

          {session && (
            <div className="flex items-center justify-start gap-1 w-full ">
                <Image src="/log_out.png" alt="" className="object-cover" width={28} height={28}/>
              <li
                className="flex-1 py-3 px-2 hover:bg-black/90 text-white rounded-lg cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                >
                Sign Out
              </li>
            </div>
          )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SideNav;
