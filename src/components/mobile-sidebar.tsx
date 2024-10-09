import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet";
import SideNavbar from "./side-bar";
import { useEffect, useState } from "react";

const MobileSidebar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0">
        <SideNavbar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
