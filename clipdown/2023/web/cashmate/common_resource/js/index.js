/**
 * index.php 페이지에서 동작하는 스크립트 파일 입니다.
 */

/**
 * PC 상단 메인 동영상 설정
 */
(function () {
    let video = document.getElementById("videoPlayer");
    let playButton = document.getElementById("PlayBtn");

    playButton.addEventListener("click", function () {
        if (video.paused === true || video.ended === true) {
            video.play();
            playButton.style.display = "none";
        }
    });

    video.addEventListener("click", function () {
        if (video.paused === false) {
            video.pause();
            playButton.style.display = "block";
        }
    });

    video.addEventListener("ended", function () {
        playButton.style.display = "block";
    });
})();

/**
 * 접속 클라이언트가 Mobile 인지 구분
 * host 값으로 구분한다.
 */
function isMobile() {
    let host = location.host;
    if(host === "m.clipdown.net") {
        return true;
    } else {
        return false;
    }
}

/**
 * 자주 묻는 질문 영역 태그 생성
 */
(function () {
    // 자주 묻는 질문 탭 태그 생성
    let qnaTab = document.getElementById("pills-tab2");
    (function () {
        let tag = '\
            <li id="menu_howUse" class="active"><a gtm-id="qnaTab" href="#howUse" data-toggle="tab" aria-expanded="true">사용방법</a></li>\
            <li id="menu_downloadUse" class=""><a gtm-id="qnaTab" href="#downloadUse" data-toggle="tab" aria-expanded="false">다운로드</a></li>\
            <li id="menu_installUse">\
                <a gtm-id="qnaTab" href="#installUse" data-toggle="tab" aria-expanded="true">${menu_title}</a>\
            </li>\
        ';

        // set values
        if(isMobile() === true) {
            tag = tag.replace("${menu_title}", "기타");
        } else {
            tag = tag.replace("${menu_title}", "설치 및 기타");
        }

        qnaTab.innerHTML = tag;

        // render qna
        let menus = document.querySelectorAll("#pills-tab2 li");
        for (let i = 0; i < menus.length; i++) {
            /**
             * menus[i].id.split("_")[1] 값은 아래와 같다.
             * howUse, downloadUse, installUse
             */
            renderQna(menus[i].id.split("_")[1]);
        }
    })();

    // qna-data.js 값을 읽어와 글 태그 생성
    function renderQna(type) {
        let container = document.querySelector("#" + type + " table tbody");
        let datas = isMobile() === false ? qna["pc"][type] : qna["mobile"][type];

        let tagStr = "";
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            let str = '\
                <tr>\
                    <th>${type}</th>\
                    <td>\
                        <a gtm-id="qnaPost" gtm-qna-title="${title}" gtm-qna-type="${type}" href="#" class="qna_popup" data-qna-type="${type}" data-qna-title="${title}">\
                            ${title}\
                        </a>\
                        <div class="content" style="display:none";>${content}</div>\
                    </td>\
                </tr>\
            ';

            str = str.replace(/\$\{type\}/gi, data.type);
            str = str.replace(/\$\{title\}/gi, data.title);
            str = str.replace(/\$\{content\}/gi, data.content);
            str = str.replace(/\$\{gtmId\}/gi, data.gtmId);

            tagStr += str;
        }

        container.innerHTML = tagStr;
    }

    // 자주 묻는 질문 게시글 클릭 이벤트 설정
    (function () {
        // add modal open events
        let qnaTags = document.querySelectorAll("a.qna_popup");
        for (let i = 0; i < qnaTags.length; i++) {
            qnaTags[i].addEventListener("click", function (event) {
                event.preventDefault();
                let dataset = this.dataset;
                let content = this.parentElement.querySelector("div").innerHTML;

                modal.openQNA(dataset, content);
            });
        }
    })();
})();

/**
 * 공지사항 클릭 이벤트 설정
 */
(function () {
    // add modal open events
    let noticeTags = document.querySelectorAll("a.notice_popup");
    for (let i = 0; i < noticeTags.length; i++) {
        noticeTags[i].addEventListener("click", function (event) {
            event.preventDefault();
            let idx = this.dataset.noticeIdx;
            modal.openNotice(idx);
        });
    }
})();

/**
 * 공용 모달 처리 모듈
 */
const modal = (function() {

    const modal = document.querySelector("#commonModal");

    // 페이지 진입 시, 공지사항 팝업이 표시되고 있는지 상태 여부
    let isLandingNoticeShowing = false;

    // 랜딩 공지사항 데이터 (공지사항 idx 값이 , 로 연결된 문자열)
    let landingNoticeString = global.popupNoticeString;

    // 랜딩 공지사항 배열
    let landingNoticeIdxList = landingNoticeString === "" ? [] : landingNoticeString.split(",");

    if(landingNoticeIdxList.length > 0) {
        setLandingNoticeLogic();
    }

    // modal 닫기 버튼 설정
    modal.querySelector("button.btn-close").addEventListener("click", function () {
        close();
    });

    // modal esc 키 입력 닫기 설정
    if (isMobile() === false) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.key === 'Esc' ) {
                //if esc key was not pressed in combination with ctrl or alt or shift
                const isNotCombinedKey = !(event.ctrlKey || event.altKey || event.shiftKey);
                if (isNotCombinedKey) {
                    if (modal.style.display === "block") {
                        close();
                    }
                }
            }
        });
    }

    function setLandingNoticeLogic() {
        isLandingNoticeShowing = true;
        openNotice(landingNoticeIdxList[0]);
    }

    /**
     * 자주 묻는 질문 모달 값 셋팅 후 열기
     * @param dataset
     * @param content
     */
    function openQNA(dataset, content) {
        // change modal values
        modal.querySelector("span.separation").innerHTML = "[" + dataset.qnaType + "]";
        modal.querySelector("span.title").innerHTML = dataset.qnaTitle;
        modal.querySelector("div.popup-content").innerHTML = content;

        // show
        modal.style.display = "block";
    }

    /**
     * 공지사항 모달 값 셋팅 후 열기
     * @param idx 공지사항 idx 값
     */
    function openNotice(idx) {
        $.ajax({
            method: "GET",
            url: "http://www.clipdown.net/exec/noticeAjax.php",
            data: {
                "mode": "noticeInfo",
                "idx": idx,
                "type": 'C'
            },
            dataType: 'json',
            async: false,
            success: function (data) {
                let title = data.title;
                let content = data.content;

                // change modal values
                modal.querySelector("span.separation").innerHTML = "[공지사항] ";
                modal.querySelector("span.title").innerHTML = title;
                modal.querySelector("div.popup-content").innerHTML = content;

                // show
                modal.style.display = "block";
            }
        });
    }

    function close() {
        modal.style.display = "none";
        if (isLandingNoticeShowing === true) {
            // 닫은 랜딩 공지사항 제거
            landingNoticeIdxList.shift();
            if(landingNoticeIdxList.length > 0) {
                // console.log("***", landingNoticeIdxList, landingNoticeIdxList.length, isLandingNoticeShowing);
                openNotice(landingNoticeIdxList[0]);
            } else {
                isLandingNoticeShowing = false;
            }
        }
    }

    return {
        close: close,
        openQNA: openQNA,
        openNotice: openNotice,
        info: function() {
            console.log("isLandingNoticeShowing", isLandingNoticeShowing);
            console.log("landingNoticeIdxList", landingNoticeIdxList);
        }
    }

})();

/**
 * app 다운로드 버튼 처리
 */
(function () {
    const mobile_links = {
        onestore: "http://clipdown.net/bridge.php?ref=homepage&down=onestore&ref_url=",
        galaxystore: "http://clipdown.net/bridge.php?ref=homepage&down=galaxy&ref_url=",
    };

    const pc_links = {
        onestore: "https://m.onestore.co.kr/mobilepoc/apps/appsDetail.omp?prodId=0000743406",
        galaxystore: "https://galaxystore.samsung.com/detail/kr.co.js.clipdown",
    };

    // 다운로드 버튼 클릭 이벤트 추가 함수
    const addDownloadEvent = (button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            if (isMobile()) {
                if (this.id !== "clipdownMobileDownloadBtn") {
                    location.href = mobile_links[this.id] + document.referrer;
                }
            } else {
                window.open(pc_links[this.id], "");
            }
        });
    }

    // 다운로드 버튼 이벤트 추가
    let buttons = document.querySelectorAll(".btn-group .m_btn");
    for (let i = 0; i < buttons.length; i++) {
        addDownloadEvent(buttons[i]);
    }

    // 클립다운 모바일 다운로드 팝업(하단 플로팅 버튼 클릭 시 화면에 표시됨)
    (() => {
        // 클립다운 다운로드 팝업
        const clipdownMobileDownloadPopup = document.getElementById("clipdownMobileDownloadPopup");



        if (clipdownMobileDownloadPopup !== null) {
            // 팝업 열기 버튼
            let openBtn =  document.getElementById("clipdownMobileDownloadBtn");
            if (openBtn !== null) {
                openBtn.addEventListener("click", (event) => {
                    event.preventDefault();
                    clipdownMobileDownloadPopup.style.display = "block";
                });
            }

            // 팝업 닫기 버튼
            const closeBtn = clipdownMobileDownloadPopup.querySelector(".btn-close");
            if (closeBtn !== null) {
                closeBtn.addEventListener("click", () => {
                    clipdownMobileDownloadPopup.style.display = "none";
                });
            }

            // 원스토어 다운로드 버튼
            const onestoreBtn = clipdownMobileDownloadPopup.querySelector("#onestore");
            if (onestoreBtn !== null) {
                addDownloadEvent(onestoreBtn);
            }

        }
    })();

})();



/**
 * back link 수집 로직
 */
(function() {
    $(document).ready(function () {
        $.ajax({
            url: "/save_back_link.php",
            type: 'POST',
            data: {
                "app": global.app,
                "http_host": global.http_host,
                "http_referer": global.http_referer,
                "query_string": global.query_string
            }
        });
    });
})();

/**
 * PC 런처 파일을 다운로드 버튼 클릭 시, 로그를 남기는 함수
 */
(function() {
    function sendLauncherSetup() {
        const app = 5;
        $.ajax({
            method: "GET",
            url: "/download_lanucher.php",
            data: {
                "app": app
            },
            dataType: 'text',
            async: false,
            success: function(data) {
            }
        });
    }
    if(isMobile() === false) {
        let downloadButtons = document.querySelectorAll("#launcherDownload");

        for(let i = 0; i < downloadButtons.length; i++) {
            let tag = downloadButtons[i];
            tag.addEventListener("click", function () {
                sendLauncherSetup();
            });
        }
    }
})();

/**
 * [CDPC-105]
 * PC 페이지 하단 다운로드 팝업
 */
(function () {
    if (isMobile() === false) {
        let showCount = 0;
        let isShowing = false;
        $(window).scroll(function () {
            let viewportHeight = window.innerHeight;
            let noticeMarginTop = 150;
            let noticeOffsetTop = $("#notice").offset().top;
            let noticeTitleHeight = $("#notice .header_title").height();

            let space = 50;
            let scrollValue = $(document).scrollTop();
            let showPopupScorllTopPosition = noticeOffsetTop - viewportHeight + noticeMarginTop + noticeTitleHeight;

            // console.log(scrollValue, showButtonScorllTopPosition);
            if(scrollValue >= showPopupScorllTopPosition + space) {
                // console.log($('.popupDownlad.show').css('bottom'));

                // 2회만 팝업 표시처리
                if(isShowing === false && ++showCount <= 2) {
                    // 팝업 보이기
                    $('.popupDownlad').addClass("show").show();
                    isShowing = true;
                    // console.log("show");
                }
            } else {
                if(isShowing === true) {
                    // 팝업 숨기기
                    $('.popupDownlad').removeClass("show").hide();
                    isShowing = false;
                    // console.log("hide");
                }
            }
        });
        $('.btn-close').click(function(){
            $('.popupDownlad').removeClass("show").hide();
        });
    }
})();

/**
 * [CDPC-106]
 * Mobile 하단 플로팅 다운로드 버튼
 */
(function () {
    $(document).ready(function () {
        setMobileFloatingButton();
    });

    function setMobileFloatingButton() {
        if(isMobile() === false) {
            return;
        }

        let isShowing = false;
        let isCSSChanged = false;

        let navbarHeight = $("nav").height() + 1;
        let aboutOffsetTop = $("#about").offset().top;

        let showButtonScrollTopPosition = aboutOffsetTop - navbarHeight;
        let fixedScrollTopPosition = $("#notice").offset().top;

        $(window).scroll(function () {
            let scrollValue = $(document).scrollTop();

            if(scrollValue >= showButtonScrollTopPosition) {

                if(isShowing === false) {
                    // 버튼 보이기√
                    $('.m_download_bottom').css('bottom', "0");
                    $('.m_download_bottom').fadeIn(300);

                    isShowing = true;
                }

                if(scrollValue >= fixedScrollTopPosition) {
                    if(isCSSChanged === false) {
                        // 위치 변경
                        isCSSChanged = true;
                        $('.m_download_bottom').addClass("fixed");
                    }
                } else {
                    if(isCSSChanged === true) {
                        // 위치 변경 원복
                        isCSSChanged = false;
                        $('.m_download_bottom').removeClass("fixed");
                    }
                }

            } else {
                if(isShowing === true) {
                    // 버튼 숨기기
                    $('.m_download_bottom').fadeOut(300)
                    isShowing = false;
                }
            }
        });
    }
})();

/**
 * [CDPC-108]
 *  PC 홈페이지 런쳐 파일 설치 안내 팝업 처리
 */
(function () {
    // PC 에서만 사용
    if (isMobile() === true) {
        return;
    }

    function fnBrowserDetect(){
        const userAgent = navigator.userAgent.toLowerCase();

        if(userAgent.match(/firefox|fxios/i)){
            // mozilla/5.0 (windows nt 10.0; win64; x64; rv:95.0) gecko/20100101 firefox/95.0
            return "firefox";
        } else if(userAgent.match(/opr\//i)){
            return "opera";
        } else if(userAgent.match(/edg/i)){
            // mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/96.0.4664.110 safari/537.36 edg/96.0.1054.62
            return "edge";
        } else if(userAgent.match(/trident/i)) {
            // mozilla/5.0 (windows nt 10.0; wow64; trident/7.0; touch; .net4.0c; .net4.0e; tablet pc 2.0; .net clr 2.0.50727; .net clr 3.0.30729; .net clr 3.5.30729; zoom 3.6.0; rv:11.0) like gecko
            return 'ie';
        } else if(userAgent.match(/whale/i)) {
            // mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/96.0.4664.110 whale/3.12.129.46 safari/537.36
            return 'whale';
        } else if(userAgent.match(/chrome|chromium|crios/i)){
            // mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/97.0.4692.71 safari/537.36
            return "chrome";
        } else if(userAgent.match(/safari/i)){
            return "safari";
        } else {
            return null;
        }
    }

    $(document).ready(function () {
        // 크롬 브라우저는 좌측하단 정렬
        // 크롬 브라우저가 아닐 경우, 가운데 정렬
        if (fnBrowserDetect() !== "chrome") {
            $("#installGuidePopup div.install-info").addClass("center");
        }

        // 다운로드 버튼 클릭 시, 팝업 표시
        let fileURL = $("#launcherDownload").attr("href");
        $("a[href='" + fileURL + "']").click(function() {
            $("#installGuidePopup").fadeIn(200);
        });

        // 팝업 종료 이벤트 추가
        $("#installGuidePopup").click(function() {
            $("#installGuidePopup").fadeOut(200);
        });

        // 메세지 클릭 시, 팝업 종료 막기
        $(".install-info").click(function (event){
            event.stopPropagation();
        });
    });

})();