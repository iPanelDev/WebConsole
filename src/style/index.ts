import { defineStore } from "pinia";

export const containerMaxW = "xl:max-w-6xl xl:mx-auto";

export const useStyleStore = defineStore("style", {
    state: () => ({
        /* Styles */
        asideStyle: "bg-white",
        asideScrollbarsStyle: "aside-scrollbars-light",
        asideBrandStyle: "",
        asideMenuItemStyle:
            "text-gray hover:text-gray-500 dark:hover:text-gray-300 dark:text-white transition-colors",
        asideMenuItemActiveStyle: "font-bold text-black dark:text-white",
        asideMenuDropdownStyle: "bg-gray-100/75",
        navBarItemLabelStyle: "text-gray",
        navBarItemLabelHoverStyle: "hover:text-gray-500",
        navBarItemLabelActiveColorStyle: "text-black",
        overlayStyle: "from-white via-gray-100 to-white",

        /* Dark mode */
        darkMode: false,
    }),
    actions: {
        setDarkMode(payload = null) {
            this.darkMode = payload !== null ? payload : !this.darkMode;

            if (typeof localStorage !== "undefined") {
                localStorage.setItem("ipanel.darkMode", this.darkMode ? "1" : "0");
            }

            if (typeof document !== "undefined") {
                document.body.classList[this.darkMode ? "add" : "remove"](
                    "dark-scrollbars"
                );

                document.documentElement.classList[
                    this.darkMode ? "add" : "remove"
                ]("dark-scrollbars-compat");
                document.documentElement.classList[
                    this.darkMode ? "add" : "remove"
                ]("dark");
            }
        },
    },
});
