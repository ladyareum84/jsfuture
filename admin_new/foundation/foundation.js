const includeFoundation = (callback) => {
    fetch("/foundation/head-tag.html")
        .then((res) => res.text())
        .then((html) => {
            document.querySelector("head").innerHTML = html;
        });

    fetch("/foundation/header.html")
        .then((res) => res.text())
        .then((html) => {
            document.querySelector("div.page").insertAdjacentHTML("afterbegin", html);
        });

    fetch("/foundation/navbar.html")
        .then((res) => res.text())
        .then((html) => {
            document.querySelector("div.page").insertAdjacentHTML("afterbegin", html);
        });

    (() => {
        const loadScriptAsync = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = src;
                script.type = "text/javascript";
                script.async = true;

                script.onload = () => {
                    console.log(`✅ Script loaded: ${src}`);
                    resolve();
                };

                script.onerror = () => {
                    console.error(`❌ Failed to load script: ${src}`);
                    reject(new Error(`Script load error: ${src}`));
                };

                document.head.appendChild(script);
            });
        };

        const scriptSrcList = [
            "https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/js/tabler.min.js",
            "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js",
            "https://code.jquery.com/jquery-3.5.1.js",
            "https://cdn.datatables.net/2.3.2/js/dataTables.js",
            "/public/js/tabler-theme.js",
            "/public/dist/libs/apexcharts/dist/apexcharts.min.js",
            "/public/dist/libs/litepicker/dist/litepicker.js",
            "/public/dist/libs/list.js/dist/list.min.js",
            "/public/dist/js/demo-theme.min.js",
        ];

        (async () => {
            for (const src of scriptSrcList) {
                await loadScriptAsync(src);
            }

            // 현재 페이지 메뉴 활성화
            const menu = document.querySelector(
                `a.dropdown-item[href='${location.pathname}']`
            );
            if (menu !== null) {
                menu.classList.add("active");
                console.log("메뉴 활성화!");
            }

            typeof callback === "function" && callback();

            console.log("includeFoundation success");
        })();
    })();
};

const dataTablesConfg = {
    responsive: true,
    pagingType: "simple_numbers",
    paging: true, // paginate 제거
    info: true, // info + infoFiltered 제거
    lengthChange: true, // lengthMenu 제거
    searching: false,
    language: {
        emptyTable: "데이터가 존재하지 않습니다.",
        lengthMenu: "_MENU_ 개씩 보기",
        info: "현재 _START_ - _END_ / _TOTAL_건",
        infoEmpty: "데이터가 존재하지 않습니다.",
        infoFiltered: "( _MAX_건의 데이터에서 필터링됨 )",
        search: "검색: ",
        zeroRecords: "일치하는 데이터가 없습니다.",
        loadingRecords: "로딩중",
        processing: "로딩중",
        paginate: {
            previous:
                '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M15 6l-6 6l6 6" /> </svg>',
            next: '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M9 6l6 6l-6 6" /> </svg>',
        },
    },
};
