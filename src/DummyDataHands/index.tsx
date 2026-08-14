const images = import.meta.glob<{ default: string }>("../assets/HandClean/*.png", {eager: true});

export const handArray = Object.keys(images).map((path) => {
    const fileName = path.split("/").pop()?.split(".")[0]; // Extract letter from filename
    return {letter: fileName, image: images[path]?.default}; // Ensure correct typing
});

let handSignsPreloaded = false;

// Warms the browser's cache with every hand-sign image so pages that flash
// through them (Watch It, Sign It, Read It, the Manual) don't stall on the
// network the first time each letter appears. Safe to call repeatedly.
export function preloadHandSigns() {
    if (handSignsPreloaded) return;
    handSignsPreloaded = true;
    handArray.forEach(({image}) => {
        if (!image) return;
        const img = new Image();
        img.src = image;
    });
}
