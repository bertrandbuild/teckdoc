"use client";

import { CommandIcon, FileTextIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState, useContext } from "react";
import Anchor from "../anchor";
import { advanceSearch, cn } from "@/lib/utils";
import DialogIA from "./dialog-ia";
import { GlobalContext } from "@/context/globalContext";

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("");
  const { isSearchOpen, selectedDemo, updateContext } = useContext(GlobalContext);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        updateContext("isSearchOpen", true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateContext]);

  const filteredResults = advanceSearch(searchedInput.trim())

  return (
    <div>
      <Dialog
        open={isSearchOpen}
        onOpenChange={(open) => {
          if (!open) setSearchedInput("");
          updateContext("isSearchOpen", open);
        }}
      >
        <DialogTrigger asChild>
          <div className="relative max-w-md flex-1 cursor-pointer">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="bg-muted h-9 w-full rounded-md border pl-10 pr-4 text-sm shadow-sm "
              placeholder="Search the doc..."
              type="search"
            />
            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium sm:flex dark:bg-neutral-700">
              <CommandIcon className="size-3" />
              <span>k</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="top-[45%] max-w-[650px] p-0 sm:top-[38%]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogHeader>
            <input
              value={searchedInput}
              onChange={(e) => setSearchedInput(e.target.value)}
              placeholder="Type something to search..."
              autoFocus
              className="h-14 border-b bg-transparent px-4 text-[15px] outline-none"
            />
          </DialogHeader>
          <DialogIA searchedInput={searchedInput} />
          {filteredResults.length == 0 && searchedInput && (
            <p className="text-muted-foreground mx-auto mt-2 text-sm">
              No results found for{" "}
              <span className="text-primary">{`"${searchedInput}"`}</span>
            </p>
          )}
          <ScrollArea className="max-h-[350px]">
            <div className="flex flex-col items-start overflow-y-auto px-1 pb-4 sm:px-3">
              {filteredResults.map((item) => {
                const level = (item.href.split("/").slice(1).length -
                  1) as keyof typeof paddingMap;
                const paddingClass = paddingMap[level];

                return (
                  <DialogClose key={item.href} asChild>
                    <Anchor
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-sm px-3 text-[15px] hover:bg-neutral-100 dark:hover:bg-neutral-900",
                        paddingClass
                      )}
                      href={`/${selectedDemo}${item.href}`}
                    >
                      <div
                        className={cn(
                          "flex h-full w-fit items-center gap-1.5 py-3",
                          level > 1 && "border-l pl-4"
                        )}
                      >
                        <FileTextIcon className="size-[1.1rem]" />{" "}
                        {item.title}
                      </div>
                    </Anchor>
                  </DialogClose>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const paddingMap = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-10",
  // Add more levels if needed
} as const;
