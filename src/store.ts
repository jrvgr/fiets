import { writable } from "svelte/store";

  export const latestCode = writable(localStorage.getItem("latestCode") || "");