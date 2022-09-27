export const timeAddZeroPadding = (time: number) => {
    return ('0' + time).slice(-2)
}

export const renderCounterText = (days, hours, minutes, seconds) => {
    if (days) {
        return `${timeAddZeroPadding(days)}d ${timeAddZeroPadding(hours)}h`
    }
    return `${timeAddZeroPadding(hours)}h ${timeAddZeroPadding(
        minutes
    )}m ${timeAddZeroPadding(seconds)}s`
}