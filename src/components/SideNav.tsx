import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import IconHoverEffect from "./IconHoverEffect";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";

export default function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 px-2 py-4">
      <div className="mb-4">
        <Link href="/" className="text-base font-bold sm:text-sm lg:text-lg xl:text-xl">
          Posthread
        </Link>
      </div>
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <VscHome className="h-8 w-8" />
              <span className="gap-4 flex items-center">
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <VscAccount className="h-8 w-8" />
                <span className="gap-4 flex items-center">
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect>
                  <VscSignIn className="h-8 w-8 fill-green-500" />
                  <span className="flex items-center gap-4">
                      <span className="hidden text-lg md:inline">Log in</span>
                  </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect>
                <VscSignOut className="h-8 w-8 fill-red-500" />
                <span className="flex items-center gap-4">
                    <span className="hidden text-lg md:inline">Log out</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
