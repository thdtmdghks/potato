export const ROUTES = {
  home: "/",
  projects: "/projects",
  projectDetail: (id: string) => `/projects/${id}`,
  login: "/login",
  privacy: "/privacy",
  myReviews: "/reviews/my",
  writeReview: (id: string) => `/reviews/write?id=${id}`,
  admin: {
    root: "/admin",
    projects: "/admin/projects",
    projectsNew: "/admin/projects/new",
    projectEdit: (id: string) => `/admin/projects/${id}/edit`,
    reviews: "/admin/reviews",
  },
} as const;
