export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "🏠",
    path: "/",
  },
  {
    id: "products",
    title: "Products",
    icon: "👗",
    path: "/products",
  },
  {
    id: "catalogue",
    title: "Catalogue",
    icon: "📚",
    path: "/catalogue",
  },
  {
    id: "ai-studio",
    title: "AI Studio",
    icon: "🤖",
    path: "/ai-studio",
  },
  {
    id: "barcode",
    title: "Barcode Studio",
    icon: "🏷️",
    path: "/barcode",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: "📊",
    path: "/analytics",
  },
  {
    id: "settings",
    title: "Settings",
    icon: "⚙️",
    path: "/settings",
  },
];