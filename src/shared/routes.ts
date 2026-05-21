export const ROUTES = {
  home: "/",
  projects: "/projects",
  projectDetail: (id: string) => `/projects/${id}`,
  login: "/login",
  admin: {
    root: "/admin",
    projects: "/admin/projects",
    projectsNew: "/admin/projects/new",
    projectEdit: (id: string) => `/admin/projects/${id}/edit`,
  },
} as const;
