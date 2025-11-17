const uidModule = (() => {

    let modalTypeIsAdd = true;

    let pathUpdate = "/api/uid/patch/";
    let pathStore = "/api/uid/store";
    let items = [];
    const getUidList = async () => {
        try {
            let res = await fetch("/api/uid/list", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content

                }
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }
    const getUidHistoryList = async (uid,startDate,endDate ,currentPage) => {
        try {
            let res = await fetch("/api/uid/history", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    uid: uid,
                    startDate: startDate,
                    endDate: endDate,
                    page: currentPage
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    const makeTable = (data) => {

        let tbody = $("#tbody");
        if (data.length == 0) {
            let template = $("#template-row-empty").html();
            let row = Mustache.render(template, null);
            tbody.append(row);
            return;

        }

        tbody.empty();
        let template = $("#template-row").html();
        items = data;

        $.each(data, function (index, item) {
            item.index = index;
            console.log(item);
            item.created_at = formatDate(item.created_at);
            item.updated_at = formatDate(item.updated_at);
            item.use_yn = (item.use_yn === "Y") ? true : false;
            let row = Mustache.render(template, item);
            tbody.append(row);
        });
    }

    const reloadTable = async () => {
        let getList = await uidModule.getUidList();
        console.log(getList);
        if (getList.code === 200) {
            await uidModule.makeTable(getList.data);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based
        const day = date.getDate();
        return `${year}년 ${month}월 ${day}일`;

    }


    const makeNullTable = (table) => {
        let tbody = table.querySelector('tbody');
        tbody.innerHTML = "";
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = "데이터가 없습니다.";
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    const save = () => {

        let uid = $("#input-uid").val();
        let naverAnalyticsCode = $("#input-naver-analytics-code").val();
        let desc = $("#input-desc").val();

        if (uid.length === 0 || naverAnalyticsCode === 0 || desc.length === 0) {
            alert("필수사항이 누락되었습니다.");
            return;
        }


        if (modalTypeIsAdd) {
            console.log("store");
            fetch(pathStore, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    naver_analytics_code: naverAnalyticsCode,
                    desc: desc

                }),
            }).then((response) => response.json())
                .then((data) => {

                    console.log("success!");
                    console.log(data);

                    if (data.result) {
                        reloadTable();
                        closeModal();
                    } else {
                        alert(data.message);
                    }


                })
                .catch(error => alert(error));

        } else {
            let url = `${pathUpdate}${uid}`;
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    naver_analytics_code: naverAnalyticsCode,
                    desc: desc
                }),
            }).then((response) => response.json())
                .then((data) => {


                    if (data.result) {
                        reloadTable();
                        closeModal();
                    } else {
                        alert(data.message);
                    }


                })
                .catch(error => alert(error));
        }


    }

    const updateState = async (uid, state) => {

        let url = `${pathUpdate}${uid}`;
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                use_yn: (state) ? 'Y' : 'N'
            }),
        }).then((response) => response.json())
            .then((data) => {


                if (data.result) {
                    reloadTable();
                } else {
                    alert(data.message);
                }


            })
            .catch(error => alert(error));


    }


    const openModal = (index) => {

        if (index === null) {
            modalTypeIsAdd = true;
            $("#input-uid").val("");
            $("#input-naver-analytics-code").val("");
            $("#input-desc").val("");
            $("#input-uid").attr("readonly", false);
        } else {
            modalTypeIsAdd = false;
            $("#input-uid").val(items[index].uid);
            $("#input-uid").attr("readonly", true);
            $("#input-naver-analytics-code").val(items[index].naver_analytics_code);
            $("#input-desc").val(items[index].desc);


        }

        $("#modal-uid").modal('show');

    }

    const closeModal = () => {
        $("#input-uid").val("");
        $("#input-naver-analytics-code").val("");
        $("#input-desc").val("");
        $("#input-uid").attr("readonly", false);
        $("#modal-uid").modal('hide');
    }


    const getAgencyList = async () => {
        try {
            let res = await fetch("/api/addservice/agency/list", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            })
            return await res.json();
        } catch (e) {
            console.log(e);
        }
    }


    return {
        getUidList,
        getUidHistoryList,
        makeTable,
        makeNullTable,
        updateState,
        save,
        openModal,
        closeModal,
        getAgencyList,
        formatDate
    }
})();
