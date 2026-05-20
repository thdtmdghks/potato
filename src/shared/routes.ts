export const ROUTES = {
  home: "/",
  projects: "/projects",
  projectDetail: (id: string) => `/projects/${id}`,
  inquiry: "/inquiry",
  login: "/login",
  admin: {
    root: "/admin",
    projects: "/admin/projects",
    projectsNew: "/admin/projects/new",
    projectEdit: (id: string) => `/admin/projects/${id}/edit`,
    products: "/admin/products",
    productsNew: "/admin/products/new",
    productEdit: (id: string) => `/admin/products/${id}/edit`,
    inquiries: "/admin/inquiries",
    inquiryDetail: (id: string) => `/admin/inquiries/${id}`,
  },
} as const;
