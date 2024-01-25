import moment from "moment";

function formatTime(seconds: number) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedTime = [days, hours, minutes, remainingSeconds]
        .map((timeUnit) => (timeUnit < 10 ? `0${timeUnit}` : `${timeUnit}`))
        .filter((timeUnit, index) => index > 1 || timeUnit !== "00") // Remove leading zeros except for the last unit
        .join(":");

    return formattedTime;
}

const formatResolution = (resolution) => {
    const resolutions = [144, 240, 360, 480, 720, 1080, 1440, 2160];
    const types = ["SD", "HD", "FHD", "QHD", "UHD"];
    const closest = resolutions.reduce((prev, curr) => {
        return Math.abs(curr - resolution) < Math.abs(prev - resolution)
            ? curr
            : prev;
    });

    let resolutionType: string;
    switch (closest) {
        case 144:
        case 240:
        case 360:
            resolutionType = types[0]; // SD
            break;
        case 480:
        case 720:
            resolutionType = types[1]; // HD
            break;
        case 1080:
            resolutionType = types[2]; // FHD
            break;
        case 1440:
            resolutionType = types[3]; // QHD
            break;
        case 2160:
            resolutionType = types[4]; // UHD
            break;
        default:
            resolutionType = "SD";
    }

    return `${closest}p (${resolutionType})`;
};
const formatDate = (time) => {
    return moment(time).format("MMMM Do YYYY, h:mm:ss a");
};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 bytes";

    const k = 1024;
    const sizes = ["", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
}



const videoType = (type) => {
    switch (type) {
        case "video/mp4":
            return "MP4 Video";
        case "video/webm":
            return "WebM Video";
        case "video/ogg":
            return "Ogg Video";
        case "video/avi":
            return "AVI Video";
        case "video/mkv":
            return "MKV Video";
        case "video/flv":
            return "FLV Video";
        case "video/wmv":
            return "WMV Video";
        default:
            return "Unspecified Type";
    }
};

const separateText = (text: string, separator?: string, separateSymbols?: string[]) => {
    if (separator !== "") separator = separator || " ";

    separateSymbols = separateSymbols || ["-", "_", ".", ","];
    let newText = text;
    separateSymbols.forEach((symbol) => {
        newText = newText.split(symbol).join(separator);
    });
    return newText;
}


export { formatTime, formatResolution, formatBytes, videoType, formatDate, separateText };