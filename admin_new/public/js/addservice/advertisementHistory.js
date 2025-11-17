const advertisementHistory = (() => {
    let currentPage = 1;
    const getAdvertisementHistoryList = async (uid, aid, agency, startDate, endDate, currentPage) => {
        try {
            let res = await fetch(`/api/addservice/advertise/history`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    uid: uid,
                    aid: aid,
                    agency: agency,
                    startDate: startDate,
                    endDate: endDate,
                    page: currentPage
                })
            })
            return await res.json();
        } catch (e) {
            console.log(e);
        }
    }

    const getAdvertisementList = async () => {
        try {
            let res = await fetch("/api/addservice/advertise/list", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
            })
            return await res.json();
        } catch (e) {
            console.log(e);
        }
    }
    const setCurrentPage = (page) => {
        currentPage = page;
    }
    const pageNation = async (selector, uid, aid, agency, startDate, endDate) => {

        $("#tbody-history").empty();
        let getAdvertisementHistory = await advertisementHistory.getAdvertisementHistoryList(uid, aid, agency, startDate, endDate, currentPage);

        // 초기화 후 생성
        selector.empty();
        selector.removeData("twbs-pagination");
        selector.unbind("page");

        selector.twbsPagination({
            startPage: getAdvertisementHistory.data.current_page,
            totalPages: getAdvertisementHistory.data.last_page,
            visiblePages: 5,
            next: '>',
            prev: '<',

            initiateStartPageClick: false,
            onPageClick: function (event, page) {

                if (currentPage !== page) {
                    currentPage = page;
                    pageNation(selector, uid, aid, agency, startDate, endDate);
                }
            }
        });

        let template = document.getElementById("template-history-row").innerHTML;
        if (getAdvertisementHistory.data.data.length === 0) {
            $("#tbody-history").append("<tr><td colspan='7' class='text-center'>데이터가 없습니다.</td></tr>");
        } else {
            $.each(getAdvertisementHistory.data.data, function (index, item) {
                let rendered = Mustache.render(template, item);
                $("#tbody-history").append(rendered);
            });
        }
    }

    return {
        setCurrentPage,
        getAdvertisementHistoryList,
        getAdvertisementList,
        pageNation
    }
})();
