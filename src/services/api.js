import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401 (expired token) -> sign out and route to the right login page
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Don't auto-logout on login/register attempts (401 there = bad creds, handled by UI)
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        const wasLoggedIn = !!localStorage.getItem("token");
        if (wasLoggedIn) {
          // Figure out where to send them based on their previous role
          let savedUser = null;
          try {
            savedUser = JSON.parse(localStorage.getItem("user") || "null");
          } catch {
            savedUser = null;
          }
          const wasAdmin = savedUser?.role === "admin";

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          const path = window.location.pathname;
          // Don't redirect if already on a login page
          const onAuthPage =
            path.startsWith("/signin") ||
            path.startsWith("/signup") ||
            path.startsWith("/admin/login");
          if (!onAuthPage) {
            window.location.href = wasAdmin ? "/admin/login" : "/signin";
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

// Services
export const fetchServices = () => API.get("/services");
export const fetchServiceBySlug = (slug) => API.get(`/services/${slug}`);

// Portfolio
export const fetchPortfolio = (params = {}) =>
  API.get("/portfolio", { params });
export const fetchPortfolioBySlug = (slug) => API.get(`/portfolio/${slug}`);

// Blogs
export const fetchBlogs = (params = {}) => API.get("/blogs", { params });
export const fetchBlogBySlug = (slug) => API.get(`/blogs/${slug}`);

// Products
export const fetchProducts = (params = {}) => API.get("/products", { params });
export const fetchProductBySlug = (slug) => API.get(`/products/${slug}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Team
export const fetchTeam = (params = {}) => API.get("/team", { params });
export const fetchTeamMember = (id) => API.get(`/team/${id}`);
export const createTeamMember = (data) => API.post("/team", data);
export const updateTeamMember = (id, data) => API.put(`/team/${id}`, data);
export const deleteTeamMember = (id) => API.delete(`/team/${id}`);

// Partners
export const fetchPartners = (params = {}) => API.get("/partners", { params });
export const createPartner = (data) => API.post("/partners", data);
export const updatePartner = (id, data) => API.put(`/partners/${id}`, data);
export const deletePartner = (id) => API.delete(`/partners/${id}`);

// Image upload (Cloudinary)
export const uploadImage = (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const deleteUploadedImage = (publicId) =>
  API.delete("/upload", { params: { publicId } });

// Reviews
export const fetchReviews = (params = {}) => API.get("/reviews", { params });
export const submitReview = (data) => API.post("/reviews", data);

// Contact
export const submitContactForm = (data) => API.post("/contact", data);

// Auth
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (data) => API.put("/auth/profile", data);
export const changePassword = (data) => API.put("/auth/password", data);

export default API;
