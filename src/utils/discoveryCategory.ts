const CATEGORY_KEY = "Discovery_Active_Category";

const isBrowser = (): boolean => typeof window !== "undefined";

export const saveActiveCategory = (category: "mesh" | "music"): void => {
    if (!isBrowser()) return;

    try {
        localStorage.setItem(CATEGORY_KEY, category);
    } catch (error) {
        console.error("Error saving active category:", error);
    }
};

export const getActiveCategory = (): "mesh" | "music" => {
    if (!isBrowser()) return "mesh";

    try {
        const storedCategory = localStorage.getItem(CATEGORY_KEY);
        return storedCategory === "mesh" || storedCategory === "music" ? storedCategory : "mesh";
    } catch (error) {
        console.error("Error retrieving active category:", error);
        return "mesh";
    }
};

export const clearActiveCategory = (): void => {
    if (!isBrowser()) return;

    try {
        localStorage.removeItem(CATEGORY_KEY);
    } catch (error) {
        console.error("Error clearing active category:", error);
    }
};
