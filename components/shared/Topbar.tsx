import Image from "next/image";
import Link from "next/link";
import {
  OrganizationSwitcher,
  Show,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const Topbar = () => {
  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-3">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/assets/logo.svg"} alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <Show when={"signed-in"}>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src={"/assets/logout.svg"}
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </Show>
          <Show when={"signed-out"}>
            <SignInButton oauthFlow="redirect" />
          </Show>
        </div>
        <Show when={"signed-in"}>
          <OrganizationSwitcher
            appearance={{
              theme: dark,
              elements: {
                organizationSwitcherTrigger: "py-2 px-4",
              },
            }}
          />
        </Show>
      </div>
    </nav>
  );
};

export default Topbar;
