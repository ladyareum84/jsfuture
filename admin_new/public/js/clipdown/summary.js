const summaryModule = (() => {

    const getSummary = async (type, start_date, end_date, service, media, app) => {
        try {
            let res = await fetch("/api/clipdown/summary", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    "type": type,
                    "start_date": start_date,
                    "end_date": end_date,
                    "service": service,
                    "media": media,
                    "app": app
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    return {getSummary}

})();
