import { useAppSelector } from ".";

const useStore = () => {
  const handleStoreData = (
    name: string = null,
    url: string = null,
    newData: any
  ) => {
    if (!url && !name) return;

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
        (video.url && video.url === url) || (video.name && video.name === name)
    );

    if (existingVideoIndex !== -1) {
      data[existingVideoIndex] = {
        ...data[existingVideoIndex],
        url,
        name,
        ...newData,
      };
    } else {
      data.push({
        url,
        name,
        ...newData,
      });
    }

    localStorage.setItem("data", JSON.stringify(data));
  };

  const handleFetchData = (name: string = null, url: string = null) => {
    const storedData = JSON.parse(localStorage.getItem("data") || "[]");
    const filteredData = storedData.filter((video: any) => {
      return (
        (video.url && video.url === url) || (video.name && video.name === name)
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
