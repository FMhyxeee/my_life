import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserPage = repositoryName?.endsWith(".github.io") ?? false;
const base =
  process.env.GITHUB_ACTIONS && repositoryName && !isUserPage
    ? `/${repositoryName}/`
    : "/";

export default defineConfig({
  base,
  plugins: [react()],
});
