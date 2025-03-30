const images = import.meta.glob<{ default: string }>("../assets/Hand/*.png", {eager: true});

export const handArray = Object.keys(images).map((path) => {
    const fileName = path.split("/").pop()?.split(".")[0]; // Extract letter from filename
    return {letter: fileName, image: images[path]?.default}; // Ensure correct typing
});