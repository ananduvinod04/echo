import { AudioLines } from "lucide-react";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
     
      items: [
        {
          title: "News feeds",
          url: "#",
        },
        {
          title: "Messages",
          url: "#",
        },
        {
          title: "Friends",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
        {
          title: "Logout",
          url: "#",
        }

      ],
    }
    
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar {...props}>
         <div className="icon flex items-center justify-center mt-2">
 <AudioLines className="h-8 w-8" />

</div>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
