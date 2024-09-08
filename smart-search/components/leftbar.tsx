"use client"

import React, { useContext } from 'react';
import { AVAIL_ROUTES, BLOCKLESS_ROUTES, NILLION_ROUTES, ROUTES } from "@/lib/routes-config";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo, NavMenu } from "./navbar";
import { Button } from "./ui/button";
import { AlignLeftIcon } from "lucide-react";
import { DialogTitle } from "./ui/dialog";
import SubLink from "./sublink";
import { GlobalContext } from "@/context/globalContext";

export function Leftbar() {
  return (
    <aside className="sticky top-16 hidden h-[92.75vh] min-w-[230px] flex-[1] flex-col overflow-y-auto md:flex">
      <ScrollArea className="py-4">
        <Menu />
      </ScrollArea>
    </aside>
  );
}

export function SheetLeftbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex lg:hidden">
          <AlignLeftIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose className="px-5" asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-4">
          <div className="mx-2 mt-3 flex flex-col gap-2 px-5">
            <NavMenu isSheet />
          </div>
          <div className="mx-2 px-5">
            <Menu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function Menu({ isSheet = false }) {
  const globalContext = useContext(GlobalContext);
  const selectedDemo = globalContext ? globalContext.selectedDemo : 'docs'; // Default to 'nillion' if context is not available
  let routes = ROUTES
  if (selectedDemo === 'docs') {
    routes = ROUTES
  } else if (selectedDemo === 'nillion') {
    routes = NILLION_ROUTES
  } else if (selectedDemo === 'blockless') {
    routes = BLOCKLESS_ROUTES
  } else if (selectedDemo === 'avail') {
    routes = AVAIL_ROUTES
  }
  
  return (
    <div className="mt-5 flex flex-col gap-3.5">
      {routes.map((item, index) => {
        const modifiedItems = {
          ...item,
          href: `/${selectedDemo}${item.href}`,
          level: 0,
          isSheet,
        };
        return <SubLink key={item.title + index} {...modifiedItems} />;
      })}
    </div>
  );
}
