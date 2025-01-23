import { Subtitle, SubtitleImage } from "../../../../types";
import { formatTime } from "../../../../utils";
import makeImage from "./sup-parser/ImageConverter";
import PGSReader from "./sup-parser/SupParser";

const pgsSubtitles = async (subtitle: Subtitle) => {
  const pgs = new PGSReader(subtitle.file);

  const images: SubtitleImage[] = [];

  let prevDisplaySet = null;

  for (const displaySet of pgs.iterDisplaysets()) {
    if (prevDisplaySet && prevDisplaySet.hasImage) {
      try {
        // Calculate start and end times
        const startTime = prevDisplaySet.pcs[0]?.pts / 1000;
        const endTime = displaySet.pcs[0]?.pts / 1000;

        if (startTime !== undefined && endTime !== undefined) {
          // Extract width and height from ods (make sure these are available in your data)
          const ods = prevDisplaySet.ods[0];
          const pcs = prevDisplaySet.pcs[0];

          const width = ods.width; // Assuming width is available in ods
          const height = ods.height; // Assuming height is available in ods
          const videoWidth = pcs.width;
          const videoHeight = pcs.height;

          // Process the image
          const pds = prevDisplaySet.pds[0];
          const img = await makeImage(ods, pds);

          // Push the data to images array
          images.push({
            start: startTime,
            end: endTime,
            image: URL.createObjectURL(new Blob([img], { type: "image/png" })),
            width: width,
            height: height,
            videoWidth: videoWidth,
            videoHeight: videoHeight,
          });
        } else {
          console.log(
            "Unable to calculate start or end time for displaySet:",
            prevDisplaySet
          );
        }
      } catch (error) {
        console.error("Error processing displaySet:", error);
      }
    }

    // Update previous display set to the current one
    prevDisplaySet = displaySet;
  }

  // Handle the last display set if needed
  if (prevDisplaySet && prevDisplaySet.hasImage) {
    try {
      const startTime = prevDisplaySet.pcs[0]?.pts / 1000;
      const endTime = startTime + 2; // Default duration for the last display set

      if (startTime !== undefined) {
        // Extract width and height from ods
        const ods = prevDisplaySet.ods[0];
        const pcs = prevDisplaySet.pcs[0];
        const width = ods.width;
        const height = ods.height;
        const videoWidth = pcs.width;
        const videoHeight = pcs.height;

        // Process the image
        const pds = prevDisplaySet.pds[0];
        const img = await makeImage(ods, pds);

        // Push the data to images array
        images.push({
          start: startTime,
          end: endTime,
          image: URL.createObjectURL(new Blob([img], { type: "image/png" })),
          width: width,
          height: height,
          videoWidth: videoWidth,
          videoHeight: videoHeight,
        });
      }
    } catch (error) {
      console.error("Error processing last displaySet:", error);
    }
  }

  return images;
};

export default function getSubtitleImages(
  subtitles: Subtitle[]
): Promise<SubtitleImage[]> {
  switch (subtitles[0].codec) {
    case "pgssub":
    case "hdmv_pgs_subtitle":
      return pgsSubtitles(subtitles[0]);
    default:
      return Promise.resolve([]);
  }
}
