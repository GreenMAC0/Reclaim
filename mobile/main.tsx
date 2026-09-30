import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "../src/router";
import "../src/styles.css";
import "./mobile.css";

createRoot(document.getElementById("root")!).render(<RouterProvider router={getRouter()} />);
