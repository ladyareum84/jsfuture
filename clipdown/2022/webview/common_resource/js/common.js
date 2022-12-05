/**
 * 공용 으로 사용하는 /webview/~ 페이지들이 공용으로 사용하는 스크립트 입니다.
 */

/**
 * 공용 모달 모듈
 * @type {{confirm: ((function(string, Function, Function): undefined)|*), alert: ((function(string, Function): undefined)|*)}}
 */
const modalModule = (() => {

    const MODAL_TAG_ID = "jsfModal";
    const MODAL_ALERT_OK_ID = "alertOK";
    const MODAL_CONFIRM_OK_ID = "confirmOK";
    const MODAL_CONFIRM_NO_ID = "confirmNO";

    const getModalTag = () => {
        return document.getElementById(MODAL_TAG_ID);
    }

    // 모달 컨테이너 태그 추가 함수
    const appendModalTag = () => {
        let el = document.createElement("div");
        el.id = MODAL_TAG_ID;
        el.classList.add("modal");
        document.body.append(el);
    }

    const showModal = () => {
        let modal = getModalTag();
        if (modal !== null) {
            modal.style.display = "block";
        }
    }

    const hideModal = () => {
        let modal = getModalTag();
        if (modal !== null) {
            modal.style.display = "none";
            modal.innerHTML = "";
        }
    }

    /**
     * 모달 alert
     * @param {string} msg - 안내 메세지 (HTML 문자열 가능)
     * @param {function} okCallback - 확인 버튼 콜백
     * @returns {undefined}
     */
    const alert = (msg, okCallback) => {
        if (getModalTag() === null) {
            appendModalTag();
        }

        let modalTag = getModalTag();
        modalTag.innerHTML = `
            <div class="modal_body">
                <div class="modal_contents">
                    <div id="msg" class="item_message">
                        <p>${msg}</p>
                    </div>
                    <div class="modal_action">
                        <div class="btn_group">
                            <a id="${MODAL_ALERT_OK_ID}" href="#" class="btn_modal btn_check">확인</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 이벤트 설정
        const okBtn = document.getElementById(MODAL_ALERT_OK_ID);
        okBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("click");

            if (typeof okCallback === "function") {
                okCallback();
            }
            // 모달 숨기기
            hideModal();
        });

        // 모달 보이기
        showModal();
    }

    /**
     * 모달 confirm
     * @param {string} msg - 안내 메세지 (HTML 문자열 가능)
     * @param {function} okCallback - 예 버튼 콜백
     * @param {function} noCallback - 아니오 버튼 콜백
     * @returns {undefined}
     */
    const confirm = (msg, okCallback, noCallback) => {
        if (getModalTag() === null) {
            appendModalTag();
        }

        let modalTag = getModalTag();
        modalTag.innerHTML = `
            <div class="modal_body">
                <div class="modal_contents">
                    <div id="msg" class="item_message">
                        <p>${msg}</p>
                    </div>
                    <div class="modal_action">
                        <div class="btn_group">
                            <a id="${MODAL_CONFIRM_NO_ID}" href="#" class="btn_modal btn_cancel">아니요</a>
                            <a id="${MODAL_CONFIRM_OK_ID}" href="#" class="btn_modal btn_check">예</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 이벤트 설정
        const okBtn = document.getElementById(MODAL_CONFIRM_OK_ID);
        okBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("click");

            if (typeof okCallback === "function") {
                okCallback();
            }
            // 모달 숨기기
            hideModal();
        });

        const noBtn = document.getElementById(MODAL_CONFIRM_NO_ID);
        noBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("click");

            if (typeof okCallback === "function") {
                noCallback();
            }
            // 모달 숨기기
            hideModal();
        });

        // 모달 보이기
        showModal();
    }

    return {
        alert,
        confirm
    }
})();