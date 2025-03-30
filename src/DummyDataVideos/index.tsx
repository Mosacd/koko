const videos = import.meta.glob<{ default: string }>("../assets/videos/*.mp4", { eager: true });

export const videoArray = Object.keys(videos).map((path) => {
    // Extract the filename from the path and remove the `.mp4` extension
    const fileName = path.split("/").pop()?.replace(".mp4", "");
    return { name: fileName, video: videos[path]?.default };
  });