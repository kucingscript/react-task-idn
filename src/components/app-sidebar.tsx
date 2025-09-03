import * as React from "react";
import {
  IconBrandBluesky,
  IconBuildingWarehouse,
  IconDashboard,
  IconHomeCog,
  IconLicense,
  IconListDetails,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

import { useAuthStore } from "@/store/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Link } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Item Types",
      url: "/admin/item-types",
      icon: IconListDetails,
    },
    {
      title: "Rooms",
      url: "/admin/rooms",
      icon: IconHomeCog,
    },
    {
      title: "Items",
      url: "/admin/items",
      icon: IconLicense,
    },
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: IconSwitchHorizontal,
    },
  ],
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: IconBuildingWarehouse,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();
  const userData = {
    name: user?.name ?? "Admin",
    email: user?.email ?? "admin@localhost",
    avatar: "https://github.com/shadcn.png",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/admin/dashboard"}>
                <IconBrandBluesky className="!size-5" />
                <span className="text-base font-semibold">
                  Indo Digital Niaga
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
