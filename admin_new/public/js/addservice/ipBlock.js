const ipBlock = (() => {

    let currentPage = 1;
    const storeBlockIp = async (startIp, endIp, blockContent, blockStatus) => {
        try {
            let res = await fetch("/api/ip/store", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    startIp: startIp,
                    endIp: endIp,
                    blockContent: blockContent,
                    blockStatus: blockStatus
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    const updateBlockIp = async (startIp, endIp, blockContent, blockStatus) => {
        try {
            let res = await fetch("/api/ip/update", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    startIp: startIp,
                    endIp: endIp,
                    blockContent: blockContent,
                    blockStatus: blockStatus
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    const removeBlockIp = async (startIp, endIp) => {
        try {
            let res = await fetch("/api/ip/delete", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    startIp: startIp,
                    endIp: endIp
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    const isIp = async (ip) => {
        let ipReg = new RegExp(
            "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
            "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
            "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
            "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$"
        );
        return ipReg.test(ip);
    }

    const getBlockIpList = async (ip, blockStatus, currentPage) => {
        try {
            let res = await fetch("/api/ip/list", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    ip: ip,
                    blockStatus: blockStatus,
                    page: currentPage
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    const setCurrentPage = (page) => {
        currentPage = page;
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const pageNation = async (selector, ip, blockStatus) => {

        $("#tbody-history").empty();
        let getBlockIpList = await ipBlock.getBlockIpList(ip, blockStatus, currentPage);

        // 초기화 후 생성
        selector.empty();
        selector.removeData("twbs-pagination");
        selector.unbind("page");

        selector.twbsPagination({
            startPage: getBlockIpList.data.current_page,
            totalPages: getBlockIpList.data.last_page,
            visiblePages: 5,
            next: '>',
            prev: '<',

            initiateStartPageClick: false,
            onPageClick: function (event, page) {

                if (currentPage !== page) {
                    currentPage = page;
                    pageNation(selector, ip, blockStatus);
                }
            }
        });

        let template = document.getElementById("template-history-row").innerHTML;
        if (getBlockIpList.data.data.length === 0) {
            $("#tbody-history").append("<tr><td colspan='7' class='text-center'>데이터가 없습니다.</td></tr>");
        } else {
            $.each(getBlockIpList.data.data, function (index, item) {
                if (item.use_yn === 'N') {
                    // item.use_yn 요소 빼기
                    delete item.use_yn;
                }
                item.created_at = formatDate(item.created_at);
                item.updated_at = formatDate(item.updated_at);

                let rendered = Mustache.render(template, item);
                $("#tbody-history").append(rendered);
            });
        }
    }
    return {
        removeBlockIp,
        pageNation,
        storeBlockIp,
        updateBlockIp,
        isIp,
        getBlockIpList,
        setCurrentPage
    }
})();
