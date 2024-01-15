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

export { formatTime }