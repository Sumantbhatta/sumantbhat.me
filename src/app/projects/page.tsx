import { Metadata } from "next";
import ProjectsPage from "@/sections/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects — Sumanth Bhat",
  description:
    "11 projects spanning mobile, web, fullstack, and tooling. From React Native apps to full-stack platforms — this is the work.",
};

export default function Projects() {
  return <ProjectsPage />;
}
