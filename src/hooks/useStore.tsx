import { useAppSelector } from ".";

const useStore = () => {
  const { mediaData } = useAppSelector((state) => state.player);
  const handleStoreData = (newData: any) => {
    const videoName = mediaData?.name || null;
    const videoUrl = mediaData?.url || null;

    if (!videoUrl && !videoName) return;

    let data = [];
    const storedData = localStorage.getItem("data");

    if (storedData) {
      try {
        data = JSON.parse(storedData);
      } catch (error) {
        return;
      }
    }

    const existingVideoIndex = data.findIndex(
      (video: any) =>
        (video.url && video.url === videoUrl) ||
        (video.name && video.name === videoName)
    );

    if (existingVideoIndex !== -1) {
      data[existingVideoIndex] = {
        ...data[existingVideoIndex],
        url: videoUrl,
        name: videoName,
        ...newData,
      };
    } else {
      data.push({
        url: videoUrl,
        name: videoName,
        ...newData,
      });
    }

    localStorage.setItem("data", JSON.stringify(data));
  };

  const handleFetchData = () => {
    const videoName = mediaData?.name || null;
    const videoUrl = mediaData?.url || null;
    const storedData = JSON.parse(localStorage.getItem("data") || "[]");
    const filteredData = storedData.filter((video: any) => {
      return (
        (video.url && video.url === videoUrl) ||
        (video.name && video.name === videoName)
      );
    });

    if (filteredData.length === 0) return [];
    return filteredData[0];
  };

  return {
    handleStoreData,
    handleFetchData,
  };
};

export default useStore;
