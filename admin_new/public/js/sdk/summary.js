const summaryModule = (() => {

    const getSummary = async (dayType, startDate, endDate, media) => {
        try {

            console.log(dayType);

            let res = await fetch("/api/sdk/summary", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    dayType: dayType,
                    startDate: startDate,
                    endDate: endDate,
                    media: media
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    return {
        getSummary,
    }
})();
