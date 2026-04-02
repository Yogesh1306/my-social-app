"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

interface Props {
  routeType: string;
}

const SearchBar = ({ routeType }: Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=${search}`);
      } else {
        router.push(`/${routeType}`);
      }
      return () => clearTimeout(delaySearch);
    }, 300);
  }, [routeType, search, router]);
  return <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "search" ? "Search communities" : "Search creators"
        }`}
        className='no-focus searchbar_input'
      />
    </div>;
};

export default SearchBar;
