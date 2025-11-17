javascript: (() => {
    /**
     * TrustedHTML 처리
     */
    window.trustedModule = (() => {
        const escapeHTMLPolicy = (() => {
            if (typeof trustedTypes !== 'undefined') {
                console.log('@@@ trustedTypes 지원');
                return trustedTypes.createPolicy('escapePolicy', {
                    createHTML: (to_escape) => to_escape,
                });
            } else {
                console.log('@@@ trustedTypes 미지원');
                return null;
            }
        })();

        return {
            getHTML: (htmlText) => {
                if (escapeHTMLPolicy !== null) {
                    return escapeHTMLPolicy.createHTML(htmlText);
                }
                return htmlText;
            },
        };
    })();

    const cashmate = (() => {
        const IS_DEV_MODE = false;

        let is_init = false;
        let is_mobile_youtube = true;
        /** let conf_save_sec = 180; **/

        const common = (() => {
            return {
                isYoutubePage: () => {
                    if (location.host === 'm.youtube.com') {
                        return true;
                    } else if (location.host === 'www.youtube.com') {
                        return true;
                    } else {
                        return false;
                    }
                },
                isMobileYoutube: () => {
                    if (location.host === 'm.youtube.com') {
                        return true;
                    }
                    return false;
                },
                isShortsPage: () => {
                    if (common.isMobileYoutube() === true) {
                        if (location.pathname.split('/')[1] === 'shorts') {
                            return true;
                        }
                        return false;
                    } else {
                        const shorts_page = document.querySelector('ytd-app #content ytd-page-manager ytd-shorts');
                        if (shorts_page !== null && shorts_page.getAttribute('role') !== null && shorts_page.getAttribute('role') === 'main') {
                            return true;
                        }
                        return false;
                    }
                },
                exceptionLog: () => { },
            };
        })();

        /** 개발 패널 태그 */
        const devPanel = (() => {
            const TAG_ID = 'jsf_dev_panel';
            return {
                addTag: () => {
                    if (document.getElementById(TAG_ID) !== null) {
                        IS_DEV_MODE && console.log('[dev]', 'devPanel already add.');
                        return;
                    }

                    if (is_mobile_youtube === true) {
                        let tagString = `
                        <div id='${TAG_ID}' style='display: block; background-color: #4a4747; color: #3ea6ff;
                            padding: 0; z-index: 9999; position: sticky; top: 0; width: 100%; height: 123px;'>
                            <div style='display: flex; justify-content: space-between;'>
                                <div>
                                <p style='font-size: 12px; margin-bottom: 5px;'>제목</p>
                                <p class='title' style='font-size: 18px; font-weight: bold;'>-</p>
                                </div>
                                <div>
                                <p style='font-size: 12px; margin-bottom: 5px'>vidx</p>
                                <p class='vidx' style='font-size: 18px; font-weight: bold;'>-</p>
                                </div>
                            </div>
                            <div style='display: flex; justify-content: space-between;'>
                                <div>
                                <p style='font-size: 12px; margin-bottom: 5px'>플레이어 종류</p>
                                <p class='player_type' style='font-size: 18px; font-weight: bold;'>-</p>
                                </div>
                                <div>
                                <p style='font-size: 12px; margin-bottom: 5px'>플레이어 상태</p>
                                <p class='status' style='font-size: 18px; font-weight: bold;'>-</p>
                                </div>
                                <div>
                                <p style='font-size: 12px; margin-bottom: 5px'>시청 시간</p>
                                <p class='time' style='font-size: 18px; font-weight: bold;'>00:00:00</p>
                                </div>
                            </div>
                            </div>`;
                        document.querySelector('body').insertAdjacentHTML('afterbegin', tagString);

                        /** 유튜브 태그 스타일 변경 */
                        let ytStyle = `<style id="ytStyle">
                                    ytm-mobile-topbar-renderer#header-bar {top: 122px;}
                                    ytm-app#app {padding-top: 0;}
                                    div#player-container-id {padding-top: 122px;}
                                    ytm-watch {margin-top: 48px;}
                                    div#player-shorts-container {padding-top: 96px;}
                                    div.shorts-header.cbox {margin-top: 30px;}
                                    ytm-custom-control div.new-controls.bigbar {margin-top: 122px;}
                                </style>`;
                        ytStyle = trustedModule.getHTML(ytStyle);

                        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', ytStyle);
                    } else {
                        let tagString = `
                        <div id='${TAG_ID}' style='display: flex; justify-content: space-between; background-color: #4a4747; color: #3ea6ff; padding: 9px;'>
                        <div>
                            <p style='font-size: 12px; margin-bottom: 5px;'>제목</p>
                            <p class='title' style='font-size: 18px; font-weight: bold;'>-</p>
                        </div>
                        <div>
                            <p style='font-size: 12px; margin-bottom: 5px'>vidx</p>
                            <p class='vidx' style='font-size: 18px; font-weight: bold;'>-</p>
                        </div>
                        <div style='display: none'>
                            <p style='font-size: 12px; margin-bottom: 5px'>플레이어 종류</p>
                            <p class='player_type' style='font-size: 18px; font-weight: bold;'>-</p>
                        </div>
                        <div>
                            <p style='font-size: 12px; margin-bottom: 5px'>플레이어 상태</p>
                            <p class='status' style='font-size: 18px; font-weight: bold;'>-</p>
                        </div>
                        <div>
                            <p style='font-size: 12px; margin-bottom: 5px'>시청 시간</p>
                            <p class='time' style='font-size: 18px; font-weight: bold;'>00:00:00</p>
                        </div>
                        </div>`;

                        document.getElementById('masthead-container').insertAdjacentHTML('afterbegin', tagString);
                    }
                },
                clearVideoInfo: () => {
                    document.querySelector(`#${TAG_ID} .title`).textContent = '-';
                    document.querySelector(`#${TAG_ID} .vidx`).textContent = '-';
                    document.querySelector(`#${TAG_ID} .player_type`).textContent = '-';
                    document.querySelector(`#${TAG_ID} .status`).textContent = '-';
                    document.querySelector(`#${TAG_ID} .time`).textContent = '00:00:00';
                },
                updateVideoInfo: (videoDetails) => {
                    try {
                        const { videoId, title } = videoDetails;

                        if (
                            IS_DEV_MODE === true &&
                            document.getElementById(TAG_ID) !== null &&
                            document.querySelector(`#${TAG_ID} .vidx`).textContent !== videoId
                        ) {
                            IS_DEV_MODE && console.log('set video infos');
                            document.querySelector(`#${TAG_ID} .vidx`).textContent = videoId;

                            if (title.length > 32) {
                                document.querySelector(`#${TAG_ID} .title`).textContent = title.substr(0, 31) + ' ...';
                            } else {
                                document.querySelector(`#${TAG_ID} .title`).textContent = title;
                            }

                            document.querySelector(`#${TAG_ID} .title`).title = title;
                            document.querySelector(`#${TAG_ID} .player_type`).textContent = '-';
                            document.querySelector(`#${TAG_ID} .status`).textContent = '-';
                            document.querySelector(`#${TAG_ID} .time`).textContent = '00:00:00';

                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error(error);
                    }
                },
                updatePlayerInfo: (infos) => {
                    if (IS_DEV_MODE === true && document.getElementById(TAG_ID) !== null) {
                        document.querySelector(`#${TAG_ID} .player_type`).textContent = infos?.type;
                        document.querySelector(`#${TAG_ID} .status`).textContent = infos?.status;
                    }
                },
                updateViewingTime: (seconds) => {
                    if (IS_DEV_MODE === true && document.getElementById(TAG_ID) !== null) {
                        let date = new Date(0);
                        date.setSeconds(seconds);
                        document.querySelector(`#${TAG_ID} .time`).textContent = date.toISOString().substring(11, 19);
                    }
                },
            };
        })();

        /** 포인트 적립 안내 태그 */
        const pointSaveInfo = (() => {
            const TAG_ID = 'jsf_point_save_info';
            const CONTAINER = 'ytm-single-column-watch-next-results-renderer';

            const WATCH_LAYER_TAG_ID = 'jsf_ytm_watch_layer';
            const YTM_WATCH = 'ytm-watch';

            const showInfo = () => {
                IS_DEV_MODE && console.log('info SHOW');
                let infoTag = document.querySelector(`#${TAG_ID} .jsf_info`);
                if (infoTag !== null) {
                    let display = infoTag.style.display;
                    if (display === 'none') {
                        infoTag.style.display = 'block';
                    }
                }

                let layer = document.querySelector(`#${WATCH_LAYER_TAG_ID}`);
                if (layer !== null) {
                    layer.style.display = 'block';
                }
            };

            const hideInfo = () => {
                IS_DEV_MODE && console.log('info HIDE');
                let infoTag = document.querySelector(`#${TAG_ID} .jsf_info`);
                if (infoTag !== null) {
                    infoTag.style.display = 'none';
                }

                let layer = document.querySelector(`#${WATCH_LAYER_TAG_ID}`);
                if (layer !== null) {
                    layer.style.display = 'none';
                }
            };

            return {
                addTag: (theme) => {
                    if (is_mobile_youtube === true) {
                        const infoTag = (() => {
                            if (theme === 'dark') {
                                /** dark 테마 */
                                return `
                                <div id='${TAG_ID}' style='padding: 5px; padding-bottom: 0; position: relative; text-align: right;'>
                                <div class='jsf_btn' style='padding: 8px 15px 5px 10px; display: flex; align-items: center; justify-content: flex-end;'>
                                    <span>포인트 적립 안내</span>
                                    <svg viewBox='0 0 27 27' xmlns='http://www.w3.org/2000/svg'
                                    style='width: 14px; height: 14px; margin-left: 3px;'>
                                        <g fill='#ffffff' fill-rule='evenodd'>
                                            <path d='M13.5 27C20.956 27 27 20.956 27 13.5S20.956 0 13.5 0 0 6.044 0 13.5 6.044 27 13.5 27zm0-2C7.15 25 2 19.85 2 13.5S7.15 2 13.5 2 25 7.15 25 13.5 19.85 25 13.5 25z'></path>
                                            <path d='M12.05 7.64c0-.228.04-.423.12-.585.077-.163.185-.295.32-.397.138-.102.298-.177.48-.227.184-.048.383-.073.598-.073.203 0 .398.025.584.074.186.05.35.126.488.228.14.102.252.234.336.397.084.162.127.357.127.584 0 .22-.043.412-.127.574-.084.163-.196.297-.336.4-.14.106-.302.185-.488.237-.186.053-.38.08-.584.08-.215 0-.414-.027-.597-.08-.182-.05-.342-.13-.48-.235-.135-.104-.243-.238-.32-.4-.08-.163-.12-.355-.12-.576zm-1.02 11.517c.134 0 .275-.013.424-.04.148-.025.284-.08.41-.16.124-.082.23-.198.313-.35.085-.15.127-.354.127-.61v-5.423c0-.238-.042-.43-.127-.57-.084-.144-.19-.254-.318-.332-.13-.08-.267-.13-.415-.153-.148-.024-.286-.036-.414-.036h-.21v-.95h4.195v7.463c0 .256.043.46.127.61.084.152.19.268.314.35.125.08.263.135.414.16.15.027.29.04.418.04h.21v.95H10.82v-.95h.21z'></path>
                                        </g>
                                    </svg>
                                </div>
                                <div class='jsf_info'
                                    style='display: none;
                                    position: absolute;
                                    right: 15px;
                                    width: auto;
                                    background: #20222B;
                                    border: 1px solid #D2D2D4;
                                    color : #fff;
                                    padding: 10px 10px;
                                    box-sizing: border-box;
                                    box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.15);
                                    z-index: 1000;
                                    text-align: left;
                                    '>
                                    <div class='notice_header' style='position: relative; padding-bottom: 5px;'>
                                        <span style='font-size: 12px; font-weight: bold;'>포인트 적립 안내</span>
                                        <!-- <div class='btn_box_top'>
                                            <button type='button' class='btn_popup_close' name='close'>
                                            <span class='btn_close icon-close'></span>
                                            </button>
                                        </div> -->
                                    </div>
                                    <div class='notice_list'>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 5px;list-style-type: none;'>- 동영상 시청 3분마다 포인트가 적립됩니다.</p>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 5px;list-style-type: none;'>- 최소화(PIP), 전체화면 시에도 포인트가 적립됩니다.</p>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 0;list-style-type: none;'>- 시청포인트는 하루 최대 적립 가능액이 존재합니다.</p>
                                    </div>
                                </div>
                                </div>
                `;
                            } else {
                                /** light 테마 */
                                return `
                                <div id='${TAG_ID}' style='padding: 5px; padding-bottom: 0; position: relative; text-align: right;'>
                                <div class='jsf_btn' style='padding: 8px 15px 5px 10px; display: flex; align-items: center; justify-content: flex-end;'>
                                    <span>포인트 적립 안내</span>
                                    <svg viewBox='0 0 27 27' xmlns='http://www.w3.org/2000/svg'
                                    style='width: 14px; height: 14px; margin-left: 3px;'>
                                        <g fill='#2C2F42' fill-rule='evenodd'>
                                            <path d='M13.5 27C20.956 27 27 20.956 27 13.5S20.956 0 13.5 0 0 6.044 0 13.5 6.044 27 13.5 27zm0-2C7.15 25 2 19.85 2 13.5S7.15 2 13.5 2 25 7.15 25 13.5 19.85 25 13.5 25z'></path>
                                            <path d='M12.05 7.64c0-.228.04-.423.12-.585.077-.163.185-.295.32-.397.138-.102.298-.177.48-.227.184-.048.383-.073.598-.073.203 0 .398.025.584.074.186.05.35.126.488.228.14.102.252.234.336.397.084.162.127.357.127.584 0 .22-.043.412-.127.574-.084.163-.196.297-.336.4-.14.106-.302.185-.488.237-.186.053-.38.08-.584.08-.215 0-.414-.027-.597-.08-.182-.05-.342-.13-.48-.235-.135-.104-.243-.238-.32-.4-.08-.163-.12-.355-.12-.576zm-1.02 11.517c.134 0 .275-.013.424-.04.148-.025.284-.08.41-.16.124-.082.23-.198.313-.35.085-.15.127-.354.127-.61v-5.423c0-.238-.042-.43-.127-.57-.084-.144-.19-.254-.318-.332-.13-.08-.267-.13-.415-.153-.148-.024-.286-.036-.414-.036h-.21v-.95h4.195v7.463c0 .256.043.46.127.61.084.152.19.268.314.35.125.08.263.135.414.16.15.027.29.04.418.04h.21v.95H10.82v-.95h.21z'></path>
                                        </g>
                                    </svg>
                                </div>
                                <div class='jsf_info'
                                    style='display: none;
                                    position: absolute;
                                    right: 15px;
                                    width: auto;
                                    background: #fff;
                                    border: 1px solid #2C2F42;
                                    padding: 10px 10px;
                                    box-sizing: border-box;
                                    box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.15);
                                    z-index: 1000;
                                    text-align: left;
                                    '>
                                    <div class='notice_header' style='position: relative; padding-bottom: 5px;'>
                                        <span style='font-size: 12px; font-weight: bold;'>포인트 적립 안내</span>
                                        <!-- <div class='btn_box_top'>
                                            <button type='button' class='btn_popup_close' name='close'>
                                            <span class='btn_close icon-close'></span>
                                            </button>
                                        </div> -->
                                    </div>
                                    <div class='notice_list'>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 5px;list-style-type: none;'>- 동영상 시청 3분마다 포인트가 적립됩니다.</p>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 5px;list-style-type: none;'>- 최소화(PIP), 전체화면 시에도 포인트가 적립됩니다.</p>
                                        <p class='item_notice' style='font-size: 11px; margin: 0; padding-bottom: 0;list-style-type: none;'>- 시청포인트는 하루 최대 적립 가능액이 존재합니다.</p>
                                    </div>
                                </div>
                                </div>
                            `;
                            }
                        })();

                        const ytmWatchLayerTag = `
                            <div id="${WATCH_LAYER_TAG_ID}"
                            style="
                            background-color: cyan;
                            width: 100%;
                            height: 100%;
                            z-index: 3000;
                            position: absolute;
                            display: none;
                            opacity: 0;
                            ">
                            </div>
                        `;

                        /** 태그 추가 interval */
                        setInterval(() => {
                            let container = document.querySelector(CONTAINER);
                            let info = document.querySelector('#' + TAG_ID);
                            if (container !== null && info === null) {
                                container.insertAdjacentHTML('afterbegin', trustedModule.getHTML(infoTag));

                                let btn = document.querySelector(`#${TAG_ID} .jsf_btn`);
                                if (btn !== null) {
                                    btn.addEventListener('click', (event) => {
                                        event.stopPropagation();
                                        IS_DEV_MODE && console.log('info CLICK');
                                        showInfo();
                                    });
                                }
                            }

                            let ytm_watch = document.querySelector(YTM_WATCH);
                            let watchLayer = document.querySelector(`#${WATCH_LAYER_TAG_ID}`);
                            if (ytm_watch !== null && watchLayer === null) {
                                ytm_watch.insertAdjacentHTML('afterbegin', trustedModule.getHTML(ytmWatchLayerTag));
                                let layer = document.querySelector(`#${WATCH_LAYER_TAG_ID}`);
                                if (layer !== null) {
                                    layer.addEventListener('touchstart', (event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        hideInfo();
                                    });
                                }
                            }
                        }, 500);
                    } else {
                        IS_DEV_MODE && console.log('need pointSaveInfo addTag for pc.');
                    }
                },
            };
        })();

        /** 안드로이드 외부 함수 */
        const androidExtModule = (() => {
            return {
                pointSave: (vid, title) => {
                    IS_DEV_MODE && console.log(`@androidExtPointSave('${vid}', '${title}') called.`);
                    if (window.ClipDownProto?.extPointReceiveCallback !== undefined) {
                        IS_DEV_MODE && console.log(`@extPointReceiveCallback('${vid}', '${title}') called.`);
                        ClipDownProto.extPointReceiveCallback(vid, title);
                    } else {
                        IS_DEV_MODE && console.log('@ClipDownProto.extPointReceiveCallback() undefined');
                    }
                },
            };
        })();

        const pointSaveModule = (() => {
            let videoInfo = null;
            let playerInfo = null;

            let is_init = false;
            let conf_save_sec = 180;

            const fn = (() => {
                return {
                    setVideoInfo: (videoDetails) => { },
                    getVideoInfo: () => { },
                    setPlayerInfo: () => { },
                    getPlayerInfo: () => { },
                };
            })();

            const overrideJSONparse = () => {
                let jsonParse = JSON.parse;
                JSON.parse = (raw_response) => {
                    try {
                        let response = jsonParse(raw_response);

                        /**
                         * 광고 제거 필터
                         * m.youtube.com##+js(json-prune, playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important)
                         */

                        /** 광고 데이터 제거 - 시작 */
                        if (Object.keys(response).includes('playerResponse') === true) {
                            delete response.playerResponse['adPlacements'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.adPlacements removed.');

                            delete response.playerResponse['playerAds'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.playerAds removed.');

                            /** 추가 */
                            delete response.playerResponse['adSlots'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.adSlots removed.');
                        }

                        if (Object.keys(response).includes('adPlacements') === true) {
                            delete response['adPlacements'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'adPlacements removed.');
                        }

                        if (Object.keys(response).includes('playerAds') === true) {
                            delete response['playerAds'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'playerAds removed.');
                        }

                        /** 추가 */
                        if (Object.keys(response).includes('adSlots') === true) {
                            delete response['adSlots'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'adSlots removed.');
                        }

                        /** 추가 */
                        if (Object.keys(response).includes('important') === true) {
                            delete response['important'];
                            IS_DEV_MODE && console.log('[JSON.parse]', 'important removed.');
                        }

                        /** 광고 데이터 제거 - 끝 */
                        if (response.hasOwnProperty('videoDetails') && response.hasOwnProperty('playerConfig')) {
                            /** 시청 동영상 정보 추출 */
                            IS_DEV_MODE && console.log(response['videoDetails']);
                            IS_DEV_MODE && console.log('isShortsPage', common.isShortsPage());

                            if (common.isShortsPage() === true) {
                                devPanel.clearVideoInfo();
                            } else {
                                devPanel.updateVideoInfo(response['videoDetails']);

                                if (videoInfo === null) {
                                    videoInfo = response['videoDetails'];

                                    viewingTimeMonitor.clear();
                                    playerInfoMonitor.stop();
                                    playerInfoMonitor.start();
                                } else {
                                    try {
                                        let vid = response['videoDetails']?.videoId;
                                        console.log('@@', vid, videoInfo.videoId);
                                        if (vid !== videoInfo.videoId) {
                                            console.warn('change video');
                                            videoInfo = response['videoDetails'];

                                            viewingTimeMonitor.clear();
                                            playerInfoMonitor.stop();
                                            playerInfoMonitor.start();
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                        }
                        return response;
                    } catch (error) {
                        console.error(error);
                    }
                };
            };

            const playerInfoMonitor = (() => {
                let playerInfoMonitorID = null;
                let current_player_status = null;

                /** 유튜브 플레이어 정보 획득 */
                const getPlayerInfos = () => {
                    /** 유튜브 플레이어의 상태에 따른 class 값을 반환하는 함수 */
                    const getCurrentPlayerStatus = (target) => {
                        if (target !== null) {
                            if (target.classList.contains('paused-mode') === true) {
                                return 'paused-mode';
                            } else if (target.classList.contains('playing-mode') === true) {
                                return 'playing-mode';
                            } else {
                                return 'destroy';
                            }
                        } else {
                            return null;
                        }
                    };

                    const isAdShowing = (target) => {
                        if (target !== null) {
                            if (target.classList.contains('ad-showing') === true) {
                                return true;
                            }
                            return false;
                        } else {
                            return null;
                        }
                    };

                    if (is_mobile_youtube === true) {
                        /** normal : #player-container-id #player .html5-video-player */
                        /** shorts : #player-container-id #player-shorts-container #player .html5-video-player */
                        let player = document.querySelector('#player-container-id #player .html5-video-player');
                        if (player !== null) {
                            return {
                                type: (() => {
                                    if (document.querySelector('#player-container-id #player-shorts-container #player .html5-video-player') !== null) {
                                        return 'mobile-shorts';
                                    }
                                    return 'mobile';
                                })(),
                                status: getCurrentPlayerStatus(player),
                                isAd: isAdShowing(player),
                            };
                        }
                        return {
                            type: 'no-player',
                            status: 'no-player',
                            isAd: 'no-player',
                        };
                    } else {
                        let mini_player = document.querySelector('ytd-app ytd-miniplayer div.html5-video-player');
                        let normal_player = document.querySelector('ytd-app ytd-page-manager ytd-watch-flexy div.html5-video-player');
                        let shorts_player = document.querySelector('ytd-app ytd-page-manager ytd-shorts div.html5-video-player');

                        if (shorts_player !== null) {
                            return {
                                type: 'shorts',
                                status: getCurrentPlayerStatus(shorts_player),
                            };
                        } else {
                            if (normal_player !== null) {
                                if (normal_player.classList.contains('unstarted-mode') === true) {
                                    /** 플레이어 종료 */
                                    return {
                                        type: 'unstarted-mode',
                                        status: 'unstarted-mode😂🚀',
                                    };
                                } else {
                                    /** 일반 플레이어 */
                                    return {
                                        type: 'normal',
                                        status: getCurrentPlayerStatus(normal_player),
                                    };
                                }
                            } else {
                                if (mini_player !== null) {
                                    /** 소형 플레이어 */
                                    return {
                                        type: 'mini',
                                        status: getCurrentPlayerStatus(mini_player),
                                    };
                                } else {
                                    /** 타입 판단 오류2 */
                                    console.log('##', '타입 판단 오류2');
                                    return {
                                        type: 'BUG',
                                        status: 'BUG🔥🔥',
                                    };
                                }
                            }
                        }
                    }
                };

                return {
                    start: () => {
                        if (playerInfoMonitorID === null) {
                            playerInfoMonitorID = setInterval(() => {
                                const playerInfos = getPlayerInfos();
                                let { type, status, isAd } = playerInfos;

                                console.log('@@', window.isPipMode, window.isOverridePipPause);
                                if (window.isPipMode === true && window.isOverridePipPause === false) {
                                    status = 'paused-mode';
                                } else if (window.isPipMode === true && window.isOverridePipPause === true) {
                                    status = 'playing-mode';
                                }

                                console.log('@@', type, status, isAd);

                                if (isAd === true || common.isShortsPage() === true) {
                                    viewingTimeMonitor.pause();
                                } else {
                                    devPanel.updatePlayerInfo(playerInfos);
                                    playerInfo = playerInfos;

                                    /** play status changed */
                                    if (current_player_status !== status) {
                                        current_player_status = status;
                                        if (status === 'playing-mode') {
                                            viewingTimeMonitor.start(conf_save_sec);
                                        } else if (status === 'paused-mode') {
                                            viewingTimeMonitor.pause();
                                        } else {
                                            console.log('###########################');
                                            viewingTimeMonitor.clear();
                                        }
                                    }
                                }
                            }, 500);
                        }
                    },
                    stop: () => {
                        clearInterval(playerInfoMonitorID);
                        playerInfoMonitorID = null;
                        current_player_status = null;
                    },
                };
            })();

            const viewingTimeMonitor = (() => {
                let isInit = false;
                let viewingTimeMonitorID = null;
                let viewingTime = 0;
                let pointSaveRemainSec = conf_save_sec;
                return {
                    start: (conf_save_sec) => {
                        if (viewingTimeMonitorID === null) {
                            IS_DEV_MODE && console.log(`viewingTimeMonitor.start(${conf_save_sec})`);

                            if (isInit === false) {
                                isInit = true;
                                pointSaveRemainSec = conf_save_sec;
                            }

                            viewingTimeMonitorID = setInterval(() => {
                                viewingTime++;

                                IS_DEV_MODE && devPanel.updateViewingTime(viewingTime);

                                if (--pointSaveRemainSec === 0) {
                                    pointSaveRemainSec = conf_save_sec;
                                    console.log('@@@@', videoInfo);
                                    androidExtModule.pointSave(videoInfo.videoId, videoInfo.title);
                                }
                                console.log(`@pointSaveRemainSec-${viewingTimeMonitorID}`, pointSaveRemainSec, conf_save_sec);
                            }, 1000);
                        } else {
                            IS_DEV_MODE && console.log('already viewingTimeMonitor.start()');
                        }
                    },
                    pause: () => {
                        IS_DEV_MODE && console.log('viewingTimeMonitor.pause()');
                        if (viewingTimeMonitorID !== null) {
                            clearInterval(viewingTimeMonitorID);
                            viewingTimeMonitorID = null;
                        }
                    },
                    clear: () => {
                        viewingTime = 0;
                        pointSaveRemainSec = conf_save_sec;
                        IS_DEV_MODE && console.log('viewingTimeMonitor.clear()');
                        if (viewingTimeMonitorID !== null) {
                            clearInterval(viewingTimeMonitorID);
                            viewingTimeMonitorID = null;
                        }
                    },
                };
            })();

            return {
                init: (save_sec) => {
                    if (is_init === true) {
                        IS_DEV_MODE && console.log('pointSaveModule already init.');
                        return;
                    }

                    is_init = true;
                    conf_save_sec = save_sec;
                    IS_DEV_MODE && console.log('pointSaveModule init.');
                    overrideJSONparse();

                    /** 시청 페이지 direct 접근 처리 */
                    if (location.pathname === '/watch') {
                        console.warn('@@@@', 'direct watch');

                        let videoId = ytInitialData?.currentVideoEndpoint?.watchEndpoint?.videoId;
                        let title =
                            ytInitialData?.contents?.singleColumnWatchNextResults?.results?.results?.contents[1]?.slimVideoMetadataSectionRenderer
                                ?.contents[0]?.slimVideoInformationRenderer?.title?.runs[0]?.text;

                        devPanel.updateVideoInfo({ videoId, title });
                        videoInfo = { videoId, title };

                        playerInfoMonitor.start();
                    }
                },
                stop: () => {
                    viewingTimeMonitor.pause();
                    playerInfoMonitor.stop();
                },
                restart: () => {
                    viewingTimeMonitor.start(conf_save_sec);
                    playerInfoMonitor.stop();
                    playerInfoMonitor.start();
                },
            };
        })();

        return {
            init: (save_sec, theme = 'light') => {
                console.log(save_sec, theme);

                /** init validate */
                if (is_init === true) {
                    IS_DEV_MODE && console.log('[init]', 'init fail. already cashmate inited.');
                    return;
                }
                if (typeof save_sec === 'undefined' || isNaN(save_sec) === true) {
                    IS_DEV_MODE && console.log('[init]', 'init fail. check save_sec');
                    return;
                }
                if (common.isYoutubePage() === false) {
                    IS_DEV_MODE && console.log('[init]', 'init fail. not youtube page');
                    return;
                }

                /** 설정 변수 값 셋팅 */
                is_init = true;
                /** conf_save_sec = save_sec; */
                is_mobile_youtube = common.isMobileYoutube() === true ? true : false;

                /** 개발 패널 태그 추가 */
                IS_DEV_MODE && devPanel.addTag();

                /** 포인트 적립 안내 태그 추가 */
                pointSaveInfo.addTag(theme);

                /** 포인트 적립 모듈 시작 */
                pointSaveModule.init(save_sec);

                IS_DEV_MODE && console.log('[init]', 'init success.', save_sec);

                console.log('@@', is_mobile_youtube);
            },
            showInfo: () => {
                console.log('showInfo', { save_sec, is_mobile_youtube });
            },
            stop: () => {
                pointSaveModule.stop();
            },
            restart: () => {
                pointSaveModule.restart();
            },
        };
    })();

    if (window.cashmate === undefined) {
        /** cashmate.init(conf_save_sec) */
        /** cashmate.init(10); */
        window.cashmate = cashmate;
    } else {
        console.log('already cashmate script loaded!!');
    }
})();

(() => {
    const videoWatchEventModule = (() => {
        const IS_DEV_MODE = true;
        const time_config = 60;
        const ytPlayerSelector = 'div.html5-video-player';

        let isInflmateWatchMission = false;
        let adId = '';

        /** 영상 시청 완료 외부 함수 */
        const videoWatchSuccess = () => {
            if (window.ClipDownProto?.videoWatchSuccess !== undefined) {
                IS_DEV_MODE && console.log('[videoWatchEventModule]', `@videoWatchSuccess() called.`);
                ClipDownProto.videoWatchSuccess();
            } else {
                IS_DEV_MODE && console.log('[videoWatchEventModule]', '@ClipDownProto.videoWatchSuccess() is undefined.');
            }
        };

        /** 미션 완료 시, 호출하는 외부 함수 */
        const inflmateWatchMissionComplete = (adId) => {
            if (window.ClipDownProto?.inflmateMissionComplete !== undefined) {
                IS_DEV_MODE && console.log('[videoWatchEventModule]', `@inflmateMissionComplete('watch', '${adId}') called.`);
                ClipDownProto.inflmateMissionComplete('watch', adId);
            } else {
                IS_DEV_MODE && console.log('[videoWatchEventModule]', `@ClipDownProto.inflmateMissionComplete('watch', '${adId}') is undefined.`);
            }
        };

        /** 타이머 태그 관리 */
        const timerView = (() => {
            const timerViewSelector = '#jsf_timer';
            const timerContainerSelector = '#player-container-id';

            /** 유튜브 플레이어 태그 생성시 까지 대기 */
            const waitForYtPlayerReady = () => {
                return new Promise((resolve, reject) => {
                    let handler = setInterval(() => {
                        let target = document.querySelector(ytPlayerSelector);
                        if (target !== null) {
                            IS_DEV_MODE && console.log('[videoWatchEventModule]', `ytPlayer ready`);

                            clearInterval(handler);
                            resolve(true);
                        } else {
                            IS_DEV_MODE && console.log('[videoWatchEventModule]', 'wait to ytPlayer loading... 😂');
                        }
                    }, 200);
                });
            };

            /** 타이머 태그 스타일 추가 */
            const appendStyle = () => {
                if (document.querySelector('#jsf_timer_style') === null) {
                    document.querySelector('head').insertAdjacentHTML(
                        'beforeend',
                        trustedModule.getHTML(`
            <style id="jsf_timer_style" type="text/css">
              /* Viewpage Player - Timer */
              .view_player{position: relative; width: 100%;}
              .video_player{position: relative; padding-top: 56.25%;}
              .video_player iframe{position: absolute; top: 0; left: 0; width: 100%; height: 100%;} 
    
              .timer_view{display: block; position: absolute; top: 10px; left: 10px; max-width: 100%; text-align: center;}
              .timer_view .item_img{position: relative; width: 100%; max-width: 80px;}
              .timer_view .box_timer{position: absolute; width: 100%; bottom: 6px; left: 0;}
              .timer_view .box_timer .time{background: #333; color: #fff; font-size: 14px; font-size: 1.4rem; font-weight: 700; border-radius: 30px; padding: 3px 10px; box-shadow: 0 -4px 6px -4px rgba(0, 0, 0, 0.45);}
              
              .timer_view .item_img svg {max-width: 100%; width: 100%; height: 100%;}
              @media (max-width: 480px) {
                .timer_view .item_img{max-width: 62px;}
              }
            </style>
            `)
                    );
                }

                IS_DEV_MODE && console.log('[videoWatchEventModule]', `appendStyle() call.`);
            };

            const getTimeText = (sec) => {
                let minute = Math.floor(sec / 60);
                minute = minute >= 10 ? minute : `0${minute}`;
                let second = sec % 60;
                second = second >= 10 ? second : `0${second}`;

                return `${minute}:${second}`;
            };

            /** 타이머 태그 */
            const timerTag = `
            <!-- Timer Style -->
                <div id="jsf_timer" class="timer_view">
                <div class="item_img">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="280" height="280" viewBox="0 0 280 280">
                        <defs>
                            <clipPath id="clip-path">
                            <rect id="icon_box" width="280" height="280" rx="16" transform="translate(-0.44)" fill="#f7f7f7" opacity="0"/>
                            </clipPath>
                            <clipPath id="clip-path-2">
                            <rect id="Rectangle_162" data-name="Rectangle 162" width="182" height="182" transform="translate(0 0)" fill="none"/>
                            </clipPath>
                            <clipPath id="clip-path-3">
                            <rect id="Rectangle_163" data-name="Rectangle 163" width="171" height="171" transform="translate(0 0)" fill="none"/>
                            </clipPath>
                            <clipPath id="clip-path-4">
                            <rect id="Rectangle_164" data-name="Rectangle 164" width="171" height="174" transform="translate(0 0)" fill="none"/>
                            </clipPath>
                        </defs>
                        <g id="img_popup_banner_coin" transform="translate(78.75 3.738)">
                            <g id="icon_box-2" data-name="icon_box" transform="translate(-78.31 -3.738)">
                            <g id="Mask_Group_14" data-name="Mask Group 14" clip-path="url(#clip-path)">
                                <g id="coin" transform="translate(48.903 49.369)">
                                <g id="Group_178" data-name="Group 178" transform="translate(-0.343 -0.369)">
                                    <g id="Group_177" data-name="Group 177" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_695" data-name="Path 695" d="M172.043,86.021a86.177,86.177,0,1,1-27.786-63.3,86.02,86.02,0,0,1,27.786,63.3" transform="translate(3.628 4.236)" fill="#f4c100"/>
                                    </g>
                                </g>
                                <g id="Group_180" data-name="Group 180" transform="translate(-0.343 -0.369)">
                                    <g id="Group_179" data-name="Group 179" transform="translate(0)" clip-path="url(#clip-path-3)">
                                    <path id="Path_696" data-name="Path 696" d="M168.115,85.664c0,46.254-36.351,83.946-81.823,85.623C40.818,169.61,4.467,131.917,4.467,85.664S40.818,1.717,86.292.041c45.473,1.676,81.823,39.369,81.823,85.623" transform="translate(6.018 4.183)" fill="#ffd539"/>
                                    </g>
                                </g>
                                <g id="Group_182" data-name="Group 182" transform="translate(-0.343 -0.369)">
                                    <g id="Group_181" data-name="Group 181" transform="translate(0 0)" clip-path="url(#clip-path-4)">
                                    <path id="Path_697" data-name="Path 697" d="M139.358,19.032,19.029,139.36A85.553,85.553,0,0,1,8.243,124.814L124.814,8.246a85.147,85.147,0,0,1,14.544,10.786" transform="translate(6.345 6.954)" fill="#ffe37f"/>
                                    </g>
                                </g>
                                <g id="Group_184" data-name="Group 184" transform="translate(-0.343 -0.369)">
                                    <g id="Group_183" data-name="Group 183" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_698" data-name="Path 698" d="M156.19,44.654,44.65,156.194a85.911,85.911,0,0,1-21.779-12.513l120.81-120.81A85.762,85.762,0,0,1,156.19,44.654" transform="translate(12.464 13.072)" fill="#ffe37f"/>
                                    </g>
                                </g>
                                <g id="Group_186" data-name="Group 186" transform="translate(-0.343 -0.369)">
                                    <g id="Group_185" data-name="Group 185" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_699" data-name="Path 699" d="M147.063,80.22a66.842,66.842,0,0,1-133.68.821c-.007-.274-.007-.548-.007-.821A66.843,66.843,0,0,1,80.22,13.377c.274,0,.551,0,.826.006a66.555,66.555,0,0,1,37.68,12.191,67.458,67.458,0,0,1,8.756,7.381A66.712,66.712,0,0,1,147.063,80.22" transform="translate(8.346 8.954)" fill="#fc9000"/>
                                    </g>
                                </g>
                                <g id="Group_188" data-name="Group 188" transform="translate(-0.343 -0.369)">
                                    <g id="Group_187" data-name="Group 187" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_700" data-name="Path 700" d="M127.482,32.954,32.954,127.481a66.585,66.585,0,0,1-19.571-46.44c-.007-.274-.007-.548-.007-.821A66.843,66.843,0,0,1,80.22,13.377c.274,0,.551,0,.826.007a66.541,66.541,0,0,1,37.68,12.189,67.572,67.572,0,0,1,8.756,7.381" transform="translate(8.346 8.954)" fill="#ffad00"/>
                                    </g>
                                </g>
                                <g id="Group_190" data-name="Group 190" transform="translate(-0.343 -0.369)">
                                    <g id="Group_189" data-name="Group 189" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_701" data-name="Path 701" d="M127.984,80.22a66.845,66.845,0,0,1-66.843,66.843q-1.9,0-3.775-.1a66.845,66.845,0,0,0,0-133.476q1.873-.105,3.775-.1A66.845,66.845,0,0,1,127.984,80.22" transform="translate(27.424 8.954)" fill="#f5790d"/>
                                    </g>
                                </g>
                                <g id="Group_192" data-name="Group 192" transform="translate(-0.343 -0.369)">
                                    <g id="Group_191" data-name="Group 191" transform="translate(0)" clip-path="url(#clip-path-2)">
                                    <path id="Path_702" data-name="Path 702" d="M57.251,87.171v22.354H37.9V48.757c0-10.8,3.381-14.84,14.651-14.84H68.9c16.249,0,28.178,8.077,28.178,25.829v1.6c0,17.752-11.928,25.829-28.178,25.829Zm0-16.343H67.957c6.294,0,9.862-4.7,9.862-9.956v-.658c0-5.259-3.568-9.956-9.862-9.956H59.975c-2.161,0-2.724.47-2.724,2.724Z" transform="translate(18.984 17.862)" fill="#f5790d"/>
                                    <path id="Path_703" data-name="Path 703" d="M62.854,87.171v22.354H43.506V48.757c0-10.8,3.381-14.84,14.651-14.84H74.5c16.249,0,28.178,8.077,28.178,25.829v1.6c0,17.752-11.928,25.829-28.178,25.829Zm0-16.343H73.56c6.294,0,9.862-4.7,9.862-9.956v-.658c0-5.259-3.568-9.956-9.862-9.956H65.578c-2.161,0-2.724.47-2.724,2.724Z" transform="translate(21.413 17.862)" fill="#ffe37f"/>
                                    </g>
                                </g>
                                </g>
                            </g>
                            </g>
                        </g>
                    </svg>                                 
                </div>
                <div class="box_timer">
                    <span id="remainSecond" class="time font_en weight-600_bold">${getTimeText(time_config)}</span>
                </div>
                </div>
            <!-- //Timer Style -->
            `;

            return {
                /** 타이머 태그 생성 */
                render: async () => {
                    await waitForYtPlayerReady();

                    if (document.querySelector(timerViewSelector) === null) {
                        appendStyle();

                        let target = document.querySelector(timerContainerSelector);
                        if (target !== null) {
                            target.insertAdjacentHTML('beforeend', trustedModule.getHTML(timerTag));
                        }
                        IS_DEV_MODE && console.log('[videoWatchEventModule]', 'timerView render.');

                        /** 영상 시청 남은 시간 확인 */
                        videoWatchTimer.start();

                        /** 시청 영상 변경 감지 */
                        urlChangeChecker.start();
                    } else {
                        console.log('already timerView rendered.');
                    }
                },
                /** 타이머 잔여 시간 변경 */
                setRemainSec: (second) => {
                    let target = document.querySelector(`${timerContainerSelector} span#remainSecond`);
                    if (target !== null) {
                        target.innerHTML = trustedModule.getHTML(getTimeText(second));
                    }
                },
                /** 타이머 제거 */
                remove: () => {
                    let target = document.querySelector('#jsf_timer');
                    console.log(target);
                    if (target !== null) {
                        target.remove();
                    }
                    IS_DEV_MODE && console.log('[videoWatchEventModule]', 'timerView remove.');
                },
            };
        })();

        /** 시청 영상 변경됬는지 확인 */
        const urlChangeChecker = (() => {
            let currentUrl = null;
            let handler;
            return {
                start: () => {
                    handler = setInterval(() => {
                        if (currentUrl === null) {
                            currentUrl = location.href;
                            IS_DEV_MODE && console.log('[videoWatchEventModule]', 'urlChangeChecker currentUrl', currentUrl);

                            console.log('CONTAINS!! : ' + currentUrl.contains('watch'));
                            if (!currentUrl.indexOf('watch') === -1) {
                                console.log('CONTAINS!!');
                                videoWatchEventModule.timerView.remove();
                            }
                        } else {
                            if (currentUrl !== location.href) {
                                currentUrl = location.href;
                                IS_DEV_MODE && console.log('[videoWatchEventModule]', 'urlChangeChecker currentUrl changed!!', currentUrl);

                                videoWatchTimer.stop();
                                urlChangeChecker.stop();
                                videoWatchEventModule.timerView.remove();
                            }
                        }
                    }, 200);
                },
                stop: () => {
                    clearInterval(handler);
                    handler = null;
                },
            };
        })();

        /** 영상 시청 잔여시간 확인 */
        const videoWatchTimer = (() => {
            let remainSec = time_config;

            const PLAYING_STATE = 1;

            let handler = null;
            return {
                start: () => {
                    if (handler === null) {
                        handler = setInterval(() => {
                            let player = document.querySelector('div.html5-video-player');
                            if (player !== null) {
                                let state = player.getPlayerState();
                                if (state === PLAYING_STATE) {
                                    remainSec = remainSec - 1;
                                    timerView.setRemainSec(remainSec);

                                    if (remainSec === 0) {
                                        IS_DEV_MODE && console.log('[videoWatchEventModule]', 'watch FINISH');

                                        videoWatchTimer.stop();
                                        urlChangeChecker.stop();
                                        timerView.remove();

                                        if (isInflmateWatchMission === false) {
                                            videoWatchSuccess();
                                        } else {
                                            inflmateWatchMissionComplete(adId);
                                        }
                                    } else {
                                        IS_DEV_MODE && console.log('[videoWatchEventModule]', 'remainSec', remainSec);
                                    }
                                }
                                IS_DEV_MODE && console.log('[videoWatchEventModule]', 'player state', state);
                            } else {
                                IS_DEV_MODE && console.log('[videoWatchEventModule]', 'player is null');
                            }
                        }, 1000);
                    }
                },
                stop: () => {
                    clearInterval(handler);
                    handler = null;
                },
            };
        })();

        return {
            init: () => {
                if (location.pathname !== '/watch') {
                    IS_DEV_MODE && console.log('[videoWatchEventModule]', '@init fail', 'not watch page');
                    return;
                }

                IS_DEV_MODE && console.log('[videoWatchEventModule]', '@init');
                timerView.render();
            },
            initInflmateWatchMisson: (_adId) => {
                if (_adId === undefined) {
                    IS_DEV_MODE && console.log('[videoWatchEventModule]', '@initInflmateWatchMisson fail', '_adid null');
                    return;
                }

                if (location.pathname !== '/watch') {
                    IS_DEV_MODE && console.log('[videoWatchEventModule]', '@initInflmateWatchMisson fail', 'not watch page');
                    return;
                }

                IS_DEV_MODE && console.log('[videoWatchEventModule]', '@initInflmateWatchMisson');
                isInflmateWatchMission = true;
                adId = _adId;
                timerView.render();
            },
            timerView,
        };
    })();

    if (window.videoWatchEventModule === undefined) {
        window.videoWatchEventModule = videoWatchEventModule;
    } else {
        console.log('already videoWatchEventModule loaded!!');
    }
})();

(() => {
    /**
     * [CDMOBILE-596]
     * - 인플메이트 좋아요, 구독 미션을 위한 모듈입니다.
     *
     * [호출 예시]
     * - inflmateMissionModule.init('like', 'adId');
     * - inflmateMissionModule.init('subscribe', 'adId');
     */
    const inflmateMissionModule = (() => {
        let isInit = false;
        let missionType;
        let adId;

        const LIKE_MISSON = 'like';
        const SUBSCRIBE_MISSON = 'subscribe';
        const MISSIONS = [LIKE_MISSON, SUBSCRIBE_MISSON];

        const LOG_PREFIX = '[inflmateMissionModule]';
        const IS_DEV_MODE = true;

        const ready = (fn) => {
            if (document.readyState !== 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        };

        /**
         * 미션 참여가 가능한 상태인지 확인하는 함수
         * - script2.js 와 동일하게 관리 필요
         * - ytInitialData 에서 로그인, 좋아요, 구독 상태 확인
         *
         * 1. 현재 페이지가 영상 시청 페이지 인지 확인
         * 2. 로그인 상태 확인
         * 3. 각 미션별 참여 가능 상태 확인
         *  - 좋아요 : 좋아요가 되어 있는 상태인가 확인
         *  - 구독 : 구독이 되어 있는 상태인가 확인
         */
        const checkMissionValidStatus = (missionType) => {
            /** 유튜브 로그인 상태 확인 */
            const isLoginStatus = () => {
                let isLoggedIn = false;
                /** ytcfg 우선 사용 */
                if (typeof ytcfg !== 'undefined' && typeof ytcfg.get === 'function') {
                    isLoggedIn = ytcfg.get('LOGGED_IN');
                } else if (window.ytInitialData?.responseContext?.webResponseContextExtensionData?.ytConfigData?.LOGGED_IN !== undefined) {
                    /** ytInitialData 대체 */
                    isLoggedIn = window.ytInitialData.responseContext.webResponseContextExtensionData.ytConfigData.LOGGED_IN;
                }

                if (isLoggedIn === true) {
                    console.log('[isLoginStatus]', '현재 유튜브 로그인 상태입니다.');
                } else {
                    console.log('[isLoginStatus]', '현재 유튜브 미로그인 상태입니다.');
                }

                return isLoggedIn;
            };

            /**
             * 유튜브 좋아요 상태 확인
             */
            const isLiked = () => {
                let info =
                    ytInitialData.contents.singleColumnWatchNextResults.results.results.contents[1].slimVideoMetadataSectionRenderer.contents[2]
                        .slimVideoActionBarRenderer.buttons[0].slimMetadataButtonRenderer.button.segmentedLikeDislikeButtonViewModel.likeButtonViewModel
                        .likeButtonViewModel.likeStatusEntity.likeStatus;

                const INFO_TEXTS = ['LIKE', 'INDIFFERENT'];

                if (info === undefined || INFO_TEXTS.includes(info) === false) {
                    throw new Error('[isLiked] not vaild info text');
                } else {
                    if (info === INFO_TEXTS[0]) {
                        /**
                         * 좋아요 버튼이 클릭된 상태
                         */
                        return true;
                    }
                    /**
                     * 좋아요 버튼이 클릭되지 않은 상태
                     */
                    return false;
                }
            };

            /**
             * 유튜브 구독 상태 확인
             */
            const isSubscribed = () => {
                let info =
                    ytInitialData.contents.singleColumnWatchNextResults.results.results.contents[1].slimVideoMetadataSectionRenderer.contents[1]
                        .slimOwnerRenderer.subscribeButton.subscribeButtonRenderer.subscribed;

                if (info === undefined || typeof info !== 'boolean') {
                    throw new Error('[isSubscribed] not vaild info');
                } else {
                    return info;
                }
            };

            try {
                if (location.pathname !== '/watch') {
                    IS_DEV_MODE && console.warn(LOG_PREFIX, 'mission invalid status!!', '영상 시청 페이지가 아닌 상태');
                    return [false, 'notWatchPage'];
                }

                if (isLoginStatus() === false) {
                    IS_DEV_MODE && console.warn(LOG_PREFIX, 'mission invalid status!!', '유튜브 미로그인 상태');
                    return [false, 'notLoggedIn'];
                }

                if (missionType === LIKE_MISSON) {
                    if (isLiked() === true) {
                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'mission invalid status!!', '좋아요 버튼 클릭된 상태');
                        return [false, 'alreadyLiked'];
                    }
                } else {
                    if (isSubscribed() === true) {
                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'mission invalid status!!', '구독 버튼 클릭된 상태');
                        return [false, 'alreadySubscribed'];
                    }
                }

                return [true, 'valid'];
            } catch (e) {
                IS_DEV_MODE && console.error(LOG_PREFIX, 'checkMissionValidStatusError', e);
                return [false, 'checkMissionValidStatusError'];
            }
        };

        /** 미션 완료 시, 호출하는 외부 함수 */
        const inflmateMissionComplete = () => {
            if (window.ClipDownProto?.inflmateMissionComplete !== undefined) {
                IS_DEV_MODE && console.log(LOG_PREFIX, `@inflmateMissionComplete('${missionType}', '${adId}') called.`);
                ClipDownProto.inflmateMissionComplete(missionType, adId);
            } else {
                IS_DEV_MODE && console.log(LOG_PREFIX, `@ClipDownProto.inflmateMissionComplete('${missionType}', '${adId}') is undefined.`);
            }
        };

        /**
         * 툴팁 태그 스타일 추가 함수
         */
        const addTooltipStyle = () => {
            let target = document.getElementById('jsfTooltipStyle');
            if (target === null) {
                let ytStyle = `<style id="jsfTooltipStyle">
                .tooltip {
                position: relative;
                display: block;
        
                height: 22px;
                margin-top: -10px;
                }
                
                .tooltip .tooltiptext {
                width: 80px;
                background-color: red;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px 0;
        
                position: absolute;
                z-index: 1;
                } 

                .tooltip .tooltiptext.like {
                left: 18px;
                }
                
                .tooltip .tooltiptext.subscribe {
                right: 3px;
                }

                .tooltip .tooltiptext::after {
                content: " ";
                position: absolute;
                border-style: solid;
                border-width: 5px;
                }
        
                .tooltip .tooltip-top::after {
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-color: red transparent transparent transparent;
                }
                </style>`;
                ytStyle = trustedModule.getHTML(ytStyle);

                document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', ytStyle);
            }
        };

        /** 시청 영상 변경됬는지 확인 */
        const urlChangeChecker = (() => {
            let currentUrl = null;
            let handler;
            return {
                start: () => {
                    handler = setInterval(() => {
                        if (currentUrl === null) {
                            currentUrl = location.href;
                            IS_DEV_MODE && console.log(LOG_PREFIX, 'urlChangeChecker currentUrl', currentUrl);
                        } else {
                            if (currentUrl !== location.href) {
                                currentUrl = location.href;
                                IS_DEV_MODE && console.log(LOG_PREFIX, 'urlChangeChecker currentUrl changed!!', currentUrl);

                                missionMonitor.stop();
                                urlChangeChecker.stop();
                            }
                        }
                    }, 200);
                },
                stop: () => {
                    IS_DEV_MODE && console.log(LOG_PREFIX, 'urlChangeChecker stop!!');
                    clearInterval(handler);
                    handler = null;
                },
            };
        })();

        /**
         * 툴팁 태그 생성 함수
         * @param {*} missionType
         * @returns
         */
        const makeTooltipTag = (missionType) => {
            const render = (target) => {
                if (target !== null) {
                    let tooltipTag = `
            <div id="jsfTooltip" class="tooltip">
                <span class="tooltiptext ${missionType} tooltip-top">포인트 받기</span>
            </div>
            `;

                    tooltipTag = trustedModule.getHTML(tooltipTag);
                    target.insertAdjacentHTML('beforebegin', tooltipTag);
                } else {
                    IS_DEV_MODE && console.error(LOG_PREFIX, 'makeTooltipTag target is null.');
                }
            };
            let checkTag = document.querySelector('#jsfTooltip');
            if (checkTag === null) {
                let target = null;
                if (missionType === LIKE_MISSON) {
                    IS_DEV_MODE && console.log(LOG_PREFIX, 'target checking');
                    target = document.querySelector('ytm-slim-video-metadata-section-renderer ytm-slim-video-action-bar-renderer');
                    if (target != null) {
                        IS_DEV_MODE && console.log(LOG_PREFIX, 'target checked');
                        render(target);
                    }
                } else if (missionType === SUBSCRIBE_MISSON) {
                    IS_DEV_MODE && console.log(LOG_PREFIX, 'target checking');
                    target = document.querySelector('ytm-slim-video-metadata-section-renderer ytm-slim-owner-renderer');
                    if (target != null) {
                        IS_DEV_MODE && console.log(LOG_PREFIX, 'target checked');
                        render(target);
                    }
                } else {
                    return;
                }
            }
        };

        const removeTooltipTag = () => {
            let target = document.getElementById('jsfTooltip');
            if (target !== null) {
                target.remove();
            }
        };

        const missionMonitor = (() => {
            let handler = null;
            const start = (missionType) => {
                if (handler !== null) {
                    IS_DEV_MODE && console.log(LOG_PREFIX, 'missionMonitor already start.');

                    return;
                }

                if (missionType === LIKE_MISSON) {
                    handler = setInterval(() => {
                        let isLike = document.querySelector('like-button-view-model button')?.attributes?.getNamedItem('aria-pressed')?.value;
                        if (isLike !== undefined && isLike === 'true') {
                            IS_DEV_MODE && console.log(LOG_PREFIX, 'like button clicked!!!');

                            stop();
                            urlChangeChecker.stop();
                            removeTooltipTag();
                            inflmateMissionComplete();

                            /**
                             * 좋아요, 취소 버튼 비활성화
                             */
                            let likeButtonContainer = document.querySelector('.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper');
                            if (likeButtonContainer !== null) {
                                likeButtonContainer.style.pointerEvents = 'none';
                            } else {
                                IS_DEV_MODE && console.log(LOG_PREFIX, 'likeButtonContainer is null', 'check tag.');
                            }
                        } else {
                            IS_DEV_MODE && console.log(LOG_PREFIX, 'monitoring... like button');

                            makeTooltipTag(missionType);
                        }
                    }, 200);
                } else if (missionType === SUBSCRIBE_MISSON) {
                    handler = setInterval(() => {
                        let isSubscribe = document.querySelector('ytm-subscribe-button-renderer')?.classList.contains('is-subscribed');
                        if (isSubscribe !== undefined && isSubscribe === true) {
                            IS_DEV_MODE && console.log(LOG_PREFIX, 'subscribe button clicked!!!');

                            stop();
                            urlChangeChecker.stop();
                            removeTooltipTag();
                            inflmateMissionComplete();

                            /**
                             * 구독 해제 버튼 비활성화
                             */
                            let subscribeButton = document.querySelector('ytm-subscribe-button-renderer button');
                            if (subscribeButton !== null) {
                                subscribeButton.style.pointerEvents = 'none';
                            } else {
                                IS_DEV_MODE && console.log(LOG_PREFIX, 'subscribeButton is null', 'check tag.');
                            }
                        } else {
                            IS_DEV_MODE && console.log(LOG_PREFIX, 'monitoring... subscribe button');

                            makeTooltipTag(missionType);
                        }
                    }, 200);
                }
            };

            const stop = () => {
                IS_DEV_MODE && console.log(LOG_PREFIX, 'missionMonitor stop.');
                clearInterval(handler);
            };

            return {
                start,
                stop,
            };
        })();

        return {
            init: (_missionType, _adId) => {
                ready(() => {
                    if (MISSIONS.includes(_missionType) === false) {
                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'init fail. invalid missionType', _missionType);
                        return;
                    }

                    if (_adId === undefined) {
                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'init fail. undefined _adid null');
                        return;
                    }

                    if (isInit === true) {
                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'init fail. missionModule already inited.');
                        return;
                    }

                    if (checkMissionValidStatus(_missionType)[0] === true) {
                        missionType = _missionType;
                        adId = _adId;
                        isInit = true;

                        addTooltipStyle();
                        makeTooltipTag(missionType);
                        missionMonitor.start(missionType);
                        urlChangeChecker.start();

                        IS_DEV_MODE && console.warn(LOG_PREFIX, 'missionModule init success.');
                    }
                });
            },
        };
    })();

    if (window.inflmateMissionModule === undefined) {
        window.inflmateMissionModule = inflmateMissionModule;
    } else {
        console.log('already inflmateMissionModule loaded!!');
    }
})();

/** clipdown_lite 기존 script2.js 소스 추가 */
(() => {
    if (window.ClipDown2 === undefined) {
        console.log('#### ClipDown Scripte2 Start ####');
        window.ClipDown2 = true;
        let isPIPMode = false;
        let isPress = false;
        let isOverridePipPause = false;
        let isPipMode = false;
        window.isPipMode = isPipMode;
        window.isOverridePipPause = isOverridePipPause;

        function setOverridePipPause() {
            if (isPipMode) {
                const video = document.querySelector('video');

                if (video) {
                    let pauseBlock = true;
                    const originalPause = video.pause;
                    video.pause = function () {
                        if (isOverridePipPause === false) {
                            originalPause.apply(this);
                        } else {
                            console.log('block');
                        }
                    };
                }
            }
        }
        window.setOverridePipPause = setOverridePipPause;

        /** 클립다운 lite 앱에서 사용하는 함수 */
        function setVideoPlayPause() {
            let player = document.querySelector('#player .html5-video-player');
            if (player !== null) {
                isOverridePipPause = !isOverridePipPause;
                window.isOverridePipPause = isOverridePipPause;
                callbackVideoPlayPauseButton(isOverridePipPause);
                setOverridePipPause();
                if (player.getPlayerState() === 2) {
                    /** 플레이어 재생 처리 */
                    player.playVideo();
                } else if (player.getPlayerState() === 1) {
                    /** 플레이어 일시 정지 처리 */
                    player.pauseVideo();
                }
            }
        }

        window.setVideoPlayPause = setVideoPlayPause;

        /**
         * 클립다운 lite 앱에서 사용하는 함수
         * 앱에서 pip 모드를 on, off 할 때 사용되는 함수
         */
        function onOffPIPModeAction(isPIPModeOn) {
            console.log('onOffPIPModeAction', isPIPModeOn);

            window.scrollTo(0, 0);

            let player = document.querySelector('#player .html5-video-player');
            let playerControl = document.querySelector('#player-control-container');
            let tags = document.querySelector('ytm-single-column-watch-next-results-renderer');

            isPipMode = isPIPModeOn;
            window.isPipMode = isPipMode;
            if (isPIPModeOn) {
                /** 영상 seek 를 위한 localStorage 값 저장 */
                localStorage.setItem('jsf-pip-time', player.getCurrentTime());
                playerControl.style.display = 'none';
                isOverridePipPause = false;
                window.setVideoPlayPause();
            } else {
                /** -1초를 해줘야, PIP 에서 오작동 표기 되고 있는, 플레이어 컨트롤러 스피너가 사라지고 정상 작동함. */
                document.querySelector('video').currentTime -= 1;
                isOverridePipPause = false;
                window.setOverridePipPause();
                playerControl.style.display = 'block';
                tags.style.display = 'flex';
            }
        }

        window.onOffPIPModeAction = onOffPIPModeAction;

        /** 클립다운 lite 앱에서 사용하는 함수 */
        function fullscreenModeClose() {
            let button = document.querySelector('.fullscreen-icon');
            if (button !== undefined) {
                button.click();
            }
        }

        window.fullscreenModeClose = fullscreenModeClose;

        /** 클립다운 lite 앱에서 사용하는 함수 - 테스트목적으로 사용 추후 제거 예정*/
        function toggleFullscreen() {
            let button = document.querySelector('button.icon-button.fullscreen-icon');
            if (button !== null) {
                button.click();
                console.log('toggleFullscreen() success');
            } else {
                console.log('toggleFullscreen() fail');
            }
        }

        window.toggleFullscreen = toggleFullscreen;

        /** 클립다운 lite 앱에서 사용하는 함수 */
        function setFullScreen() {
            console.log('call setFullScreen()');
            let player = document.querySelector('div.html5-video-player');
            if (player !== null && typeof player.isFullscreen === 'function') {
                if (player.isFullscreen() === false) {
                    let button = document.querySelector('button.icon-button.fullscreen-icon');
                    if (button !== null) {
                        button.click();
                        console.log('*fullscreen toggle button click!');
                    } else {
                        console.log('*fullscreen toggle button is null');
                    }
                } else {
                    console.log('*already fullscreen mode');
                }
            } else {
                console.log('*player tag error');
            }
        }

        window.setFullScreen = setFullScreen;

        /** 클립다운 lite 앱에서 사용하는 함수 */
        function cancelFullScreen() {
            console.log('call cancelFullScreen()');
            let player = document.querySelector('div.html5-video-player');
            if (player !== null && typeof player.isFullscreen === 'function') {
                if (player.isFullscreen() === true) {
                    let button = document.querySelector('button.icon-button.fullscreen-icon');
                    if (button !== null) {
                        button.click();
                        console.log('*fullscreen toggle button click!');
                    } else {
                        console.log('*fullscreen toggle button is null');
                    }
                } else {
                    console.log('*already no-fullscreen mode');
                }
            } else {
                console.log('*player tag error');
            }
        }

        window.cancelFullScreen = cancelFullScreen;

        /** pip 모드 하얀영역 제거 */
        function removeDrawerLayout() {
            console.log('#### removeDrawerLayout 시작 ####');
            let drawerLayout = document.querySelector('drawer-layout-container .drawer-layout');
            if (drawerLayout !== null) {
                console.log('#### 라인 없애기 ####');
                document.querySelector('drawer-layout-container .drawer-layout').remove();
            } else {
                console.log('#### 라인 찾을수없음 ####');
            }
        }
        window.removeDrawerLayout = removeDrawerLayout;

        const videoSoundOn = () => {
            let btn = document.querySelector('.ytp-unmute');
            console.log(btn);
            if (btn !== null) {
                btn.click();
            }
        };

        const callbackClickShareButton = (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();

            const VIDEO_TITLE_SELECTOR = 'ytm-slim-video-metadata-section-renderer .slim-video-metadata-header h2.slim-video-information-title';
            let video_title = document.querySelector(VIDEO_TITLE_SELECTOR) !== null ? document.querySelector(VIDEO_TITLE_SELECTOR).innerText : '';
            const video_url = location.href;
            console.log(video_title, video_url);

            if (window.ClipDownProto?.callbackClickShareButton !== undefined) {
                ClipDownProto.callbackClickShareButton(video_title, video_url);
            }
        };

        window.callbackVideoPlayPauseButton = (isPlay) => {
            if (window.ClipDownProto?.callbackVideoPlayPauseButton !== undefined) {
                ClipDownProto.callbackVideoPlayPauseButton(isPlay);
            }
        };

        const shareButtonMonitor = () => {
            const marker = 'jsf_marked';

            setInterval(() => {
                let watch_page_buttons = document.querySelectorAll('.slim_video_action_bar_renderer_button');
                for (let i = 0; i < watch_page_buttons.length; i++) {
                    let btn = watch_page_buttons[i];
                    let btnInfo = btn.querySelector(`button:not(.${marker})`);
                    if (btnInfo !== null) {
                        if (
                            btnInfo.innerText === '공유' ||
                            btnInfo.innerText === 'Share' ||
                            btnInfo.ariaLabel === '공유' ||
                            btnInfo.ariaLabel === 'Share'
                        ) {
                            if (btnInfo.onclick !== callbackClickShareButton) {
                                btnInfo.onclick = callbackClickShareButton;
                                btnInfo.classList.add(marker);
                                console.log('share button add...', btnInfo);
                            }
                        }
                    }
                }

                /**
                 * 영상 시청 페이지 - 전체 화면 공유 버튼 처리
                 */
                let fullscreen_share_buttons = document.querySelectorAll('ytm-slim-metadata-button-renderer');
                if (fullscreen_share_buttons.length > 0) {
                    /**
                     * 현재 전체화면 상태일 경우, 유튜브의 공유 버튼을 복제하여 사용처리
                     */
                    let target = document.getElementById('fullscreenShareButton');
                    if (target === null) {
                        let replicationTag = document.createElement('ytm-slim-metadata-button-renderer');
                        replicationTag.id = 'fullscreenShareButton';

                        for (let i = 0; i < fullscreen_share_buttons.length; i++) {
                            let btn = fullscreen_share_buttons[i];
                            let btnInfo = btn.querySelector(`button`);
                            if (btnInfo !== null) {
                                if (
                                    btnInfo.innerText === '공유' ||
                                    btnInfo.innerText === 'Share' ||
                                    btnInfo.ariaLabel === '공유' ||
                                    btnInfo.ariaLabel === 'Share'
                                ) {
                                    let origin = btnInfo.closest('ytm-slim-metadata-button-renderer');
                                    if (origin !== null) {
                                        replicationTag.innerHTML = trustedModule.getHTML(origin.innerHTML);
                                        replicationTag.onclick = callbackClickShareButton;
                                        origin.insertAdjacentElement('beforebegin', replicationTag);
                                        origin.remove();
                                        console.log('replication fullscreen share button!!');
                                    }
                                }
                            }
                        }
                    }
                }
            }, 200);
        };

        const videoAutoPlayOff = (interval) => {
            setTimeout(() => {
                if (document.querySelector('.ytm-autonav-toggle-button-container')?.ariaPressed === 'true') {
                    document.querySelector('.ytm-autonav-toggle-button-container').click();
                }
            }, interval);
        };

        const locationChecker = () => {
            let isStarted = false;
            let handler = undefined;
            let intervalMiliSec = 500;
            let beforeVideoUrl = '';

            const start = () => {
                const doTask = () => {
                    const nowVideoUrl = location.href.replace(location.hash, '');
                    if (location.pathname === '/watch' && beforeVideoUrl !== nowVideoUrl) {
                        console.log('VideoChanged from:' + beforeVideoUrl + ' to:' + nowVideoUrl);
                        beforeVideoUrl = nowVideoUrl;

                        /** videoAutoPlayOff(1000); CDMOBILE-307 */

                        return;
                    }
                };
                if (isStarted === false) {
                    isStarted = true;
                    handler = setInterval(() => {
                        doTask();
                    }, intervalMiliSec);
                    doTask();
                } else {
                    console.log('already started.');
                }
            };

            const stop = () => {
                isStarted = false;
                clearInterval(handler);
            };

            return { start, stop };
        };

        const fixErrorView = (interval, observer) => {
            setTimeout(() => {
                if (Number(document.querySelector('.html5-main-video').style.top.replace(/px$/, '')) >= 100) {
                    observer.disconnect();
                    document.querySelector('.html5-main-video').style = `width: ${window.innerWidth - 30}px; height: ${window.innerHeight
                        }px; left: 15px; top: 0px;`;
                    try {
                        observer.observe(document.querySelector('.html5-main-video'), { attributes: true });
                    } catch (err) {
                        console.log('observe exception : ', err);
                    }
                }
            }, interval);
        };

        const videoPlayerLayoutChecker = () => {
            let observer = new MutationObserver(function (mutationsList, observer) {
                if (!isPIPMode) {
                    fixErrorView(500, observer);
                    return;
                }

                if (Number(document.querySelector('.html5-main-video').style.left.replace(/px$/, '')) !== 0) {
                    observer.disconnect();
                    document.querySelector(
                        '.html5-main-video'
                    ).style = `width: ${window.innerWidth}px; height: ${window.innerHeight}px; left: 0px; top: 0px;`;

                    try {
                        observer.observe(document.querySelector('.html5-main-video'), { attributes: true });
                    } catch (err) {
                        console.log('observe exception : ', err);
                    }

                    setTimeout(() => {
                        if (window.innerHeight < 300) {
                            document.querySelector('#player').style = 'padding-bottom:56.25% !important';
                        }
                    }, 300);
                }
                document.querySelector('drawer-layout-container').style.display = 'none';
            });
            try {
                observer.observe(document.querySelector('.html5-main-video'), { attributes: true });
            } catch (err) {
                console.log('observe exception : ', err);
            }
        };

        const disableYoutubeHeaderAndVideo = () => {
            const task = () => {
                let styleTag = document.getElementById('disableHeaderAndVideo');
                if (styleTag === null) {
                    console.log('@@not null');
                    let style = `<style id="disableHeaderAndVideo" type="text/css">
                                #header-bar { display: none; }
                                #app { padding-top: 0px; }
                                #player-container-id { top: 0px; }
                                ytm-engagement-panel { top: 56.25vw !important; }
                                ytm-related-chip-cloud-renderer.chips-visible { top: calc(56.25vw + 48px) !important; }
                                ytm-pivot-bar-renderer { display: none !important; }
                                @media (max-width: 930px) and (orientation: landscape) {
                                  ytm-related-chip-cloud-renderer.chips-visible { top: 48px !important; }
                                }
                                ytm-item-section-renderer ytm-channel-list-item-renderer { padding: 10px 20px; }
                                ytm-item-section-renderer > lazy-list { padding-top: 20px; }
                                @media (max-width: 930px) and (orientation: landscape) {
                                    ytm-watch .player-size, .player-container .player-size {
                                        padding-bottom: 56.25% !important;
                                    }
                                }
                              </style>`;
                    style = trustedModule.getHTML(style);
                    document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', style);
                }
            };
            setInterval(task, 200);
        };

        const disableYoutubeAD = () => {
            let style = `<style>
                    ytm-alert-with-button-renderer, .ad-container, #YtKevlarVisibilityIdentifier, #YtSparklesVisibilityIdentifier, #feed-pyv-container, #feedmodule-PRO, #homepage-chrome-side-promo, #masthead-ad, #merch-shelf, #pla-shelf, #premium-yva, #promo-info, #promo-list, #search-pva, #shelf-pyv-container, #video-masthead, #watch-branded-actions, #watch-buy-urls, #watch-channel-brand-div, .GoogleActiveViewElement, .banner-promo-style-type-masthead-v2, .carousel-offer-url-container, .companion-ad-container, .list-view[style='margin: 7px 0pt;'], .promoted-sparkles-text-search-root-container, .promoted-videos, .searchView.list-view, .sparkles-light-cta, .watch-extra-info-column, .watch-extra-info-right, .ytd-action-companion-ad-renderer, .ytd-carousel-ad-renderer, .ytd-compact-promoted-video-renderer, .ytd-companion-slot-renderer, .ytd-display-ad-renderer, .ytd-merch-shelf-renderer, .ytd-player-legacy-desktop-watch-ads-renderer, .ytd-promoted-sparkles-text-search-renderer, .ytd-promoted-video-renderer, .ytd-search-pyv-renderer, .ytd-video-masthead-ad-v3-renderer, .ytp-ad-action-interstitial-background-container, .ytp-ad-action-interstitial-slot, .ytp-ad-image-overlay, .ytp-ad-overlay-container, .ytp-ad-progress, .ytp-ad-progress-list, ytm-promoted-video-renderer, a[href^='http://www.youtube.com/cthru?'], a[href^='https://www.youtube.com/cthru?'], ytd-compact-promoted-video-renderer, ytd-companion-slot-renderer, ytd-promoted-sparkles-text-search-renderer, ytd-promoted-sparkles-web-renderer, ytd-single-option-survey-renderer, ytd-video-masthead-ad-v3-renderer, ytm-companion-slot, ytm-promoted-sparkles-text-search-renderer, ytm-promoted-sparkles-web-renderer, #AdBar, #AdSense1, #AdSense2, #Adbanner, #BannerAd, #DFP_in_article_mpu, #DFP_top_leaderboard, #FooterAd, #GoogleRelatedAds, #HeaderAd, #SidebarAd, #Tadspacehead, #ad-300x250, #ad-728, #ad-aside-1, #ad-banner, #ad-bottom, #ad-container, #ad-flex-top, #ad-frame, #ad-header, #ad-horizontal, #ad-horizontal-header, #ad-lead, #ad-leaderboard, #ad-rectangle, #ad-right-top, #ad-secondary-sidebar-1, #ad-sidebar1, #ad-sidebar2, #ad-skyscraper, #ad-slot-2, #ad-text, #ad-top, #ad-top-slot, #ad-top-wrap, #ad-unit, #ad728, #adBanner, #adBottom, #adContent, #adFooter, #adSquare, #adTop, #adUnit, #ad_1, #ad_2, #ad_4, #ad_5, #ad_6, #ad_728x90, #ad_bottom, #ad_footer, #ad_global_above_footer, #ad_header, #ad_home, #ad_left, #ad_main, #ad_main_top, #ad_rec_01, #ad_right, #ad_text:not(textarea), #ad_top, #ad_website_top, #ad_zone1, #adbanner, #adbar, #adblock1, #adblock2, #adbottom, #adbox, #adbox2, #adbox_right, #adcontainer1, #adcontainer2, #adcontainer3, #adimg, #adl_300x250, #adleft, #admputop, #adright, #ads-1, #ads-5, #ads-container, #ads-header, #ads-leaderboard, #adsRight, #ads_box, #ads_header, #ads_left, #adsctl00_AdsHome2, #adsense, #adslider, #adslot1, #adslot2, #adslot3, #adsquare, #adswidget1-quick-adsense, #adswidget2-quick-adsense-reloaded-2, #adtop, #adunit, #advWrapper, #adv_728x90, #adver2, #adver5, #advert-placeholder-post-content-image-1, #advert-right, #advert_1, #advertisement-detail1, #advertisement-detail2, #advertiserReports, #advertising_300, #advertising_728, #advertorial, #adwrapper, #article-ad, #article-footer-sponsors, #atwAdFrame4, #b5ad300, #banner600, #banner728, #banner_ad, #base-advertising-top, #bbccom_mpu, #block-dfp-billboard-leaderboard, #block-dfp-mpu-1, #block-dfp-mpu-2, #block-sidebarad1, #bottom-ad, #bottom-ads, #bottom-ads-container, #bottomAd, #bottomBannerAd, #bottomDDAd, #bottomad, #boxad, #bsap_aplink, #btmsponsoredcontent, #buysellads, #carbonads-container, #center-ad, #cmn_ad_tag_head, #contentad-adsense-homepage-1, #contentad-adsense-homepage-2, #contentad-story-bottom-1, #contentad-top-adsense-1, #contentad-topbanner-1, #crt-adblock-a, #crt-adblock-b, #cubeAd, #dfp-ad-1, #dfp-ad-2, #dfp-ad-billboard_leaderboard, #dfp-ad-billboard_leaderboard-wrapper, #dfp-ad-mpu_1, #dfp-ad-mpu_1-wrapper, #dfp-ad-mpu_2, #dfp-ad-mpu_2-wrapper, #div-insticator-ad-1, #div-insticator-ad-2, #divTopAd, #extraAdsBlock, #footAd, #footer-ad, #footer-ads, #footer_ad, #footerad, #footeradvert, #frnAdSky, #frnBannerAd, #gAds, #google-adsense, #googleAd, #google_ads, #googleadsense, #gpt2_ads_widget-6, #halfPageAd, #header-ad, #header-ad-container, #header-ads, #headerAd, #header_ads, #headerad, #inline-ad, #insticator-container, #leftad, #leftrail_dynamic_ad_wrapper, #liste_top_ads_wrapper, #mod-ad-gemini-rm-1, #mpu2, #mvp-post-bot-ad, #my-adsLREC4-base, #p-googleadsense, #quads-ad1_widget, #quads-ad2, #quads-ad2_widget, #quads-ad4, #reklama, #right-ad, #right-ads-rail, #rightAd300x250, #rightAd300x250Lower, #rightAds, #rightad, #rightsideadstop, #sgAdScGp160x600, #sidebar-ad, #sidebar-advertisement, #single-ad, #source-ad-native-sticky-wrapper, #sponsorBar, #sponsored-links, #sponsored_content, #sponsored_link, #sponsored_link_bottom, #sponsored_links, #stickyad, #td-applet-ads_container, #top-ad, #top-banner-ad, #topAd, #topAd728x90, #topad, #towerad, #wp_pro_ad_system_ad_zone, #yandex_ad, .ADBox, .AD_area, .ADbox, .Ad-Container, .Ad-label, .Ad-leaderboard, .AdBorder, .AdBox, .AdContainer-Sidebar, .AdSense, .AdsRec, .Ads_4, .BannerAd, .GalleryViewerAdSuppress, .GeminiAdItem, .MediumRectangleAdPanel, .NGOLocalFooterAd, .PremiumObitAdBar, .RelatedAds, .RightAdWrapper, .SidekickItem-Ads, .SponsoredLinks, .SponsoredResults, .SummaryPage-HeaderAd, .TopAd, .TopAdContainer, .WP_Widget_Ad_manager, ._SummaryPageHeaderAdView, ._SummaryPageSidebarStickyAdView, ._ap_adrecover_ad, ._has-ads, .a-ad, .ad--desktop, .ad-1, .ad-160, .ad-160-600, .ad-160-above, .ad-160x600, .ad-2, .ad-3, .ad-300-250, .ad-300x250, .ad-300x600, .ad-4, .ad-5, .ad-728-90, .ad-728x90, .ad-Leaderboard, .ad-alsorectangle, .ad-atf, .ad-atf-medRect, .ad-background, .ad-banner, .ad-banner-container, .ad-banner-image, .ad-banner-top, .ad-bar, .ad-below, .ad-billboard, .ad-block, .ad-bottom, .ad-break, .ad-card, .ad-cell, .ad-center, .ad-centered, .ad-codes, .ad-column, .ad-container--featured_videos, .ad-container--leaderboard, .ad-container-300x250, .ad-container-top, .ad-content, .ad-custom-size, .ad-desktop, .ad-disclaimer, .ad-div, .ad-entity-container, .ad-ex, .ad-fadeup, .ad-footer, .ad-frame, .ad-google, .ad-gpt, .ad-hdr, .ad-head, .ad-header, .ad-header-container, .ad-holder, .ad-horizontal, .ad-icon, .ad-in-post, .ad-inline, .ad-inner, .ad-inserter, .ad-inserter-widget, .ad-item, .ad-label, .ad-leader, .ad-leaderboard, .ad-leaderboard-top, .ad-left, .ad-line, .ad-link, .ad-location, .ad-marker, .ad-med-rect, .ad-medium-two, .ad-microsites, .ad-midleader, .ad-mobile, .ad-mobile-banner, .ad-mpu, .ad-mrec, .ad-one, .ad-panel, .ad-placeholder, .ad-placement, .ad-position, .ad-right, .ad-row, .ad-s-rendered, .ad-section, .ad-side, .ad-sidebar, .ad-size-leaderboard, .ad-size-medium-rectangle-flex, .ad-sky, .ad-skyscraper, .ad-slot, .ad-slot--top-banner-ad, .ad-slot-container, .ad-slot-sidebar-b, .ad-source, .ad-space, .ad-spacer, .ad-spot, .ad-square, .ad-stack, .ad-sticky, .ad-sticky-container, .ad-tag, .ad-text, .ad-title, .ad-tl1, .ad-top, .ad-top-banner, .ad-tower, .ad-unit, .ad-unit-container, .ad-unit-label, .ad-unit-wrapper, .ad-vertical, .ad-wide, .ad-widget, .ad-wireframe-wrapper, .ad-with-header-wrapper, .ad-wrap, .ad-wrapper, .ad-zone, .ad.inner, .ad.module, .ad01, .ad300, .ad300x250, .ad300x600, .ad728, .ad728x90, .adBlock, .adBox, .adColumn, .adContent, .adDiv, .adFrame, .adFull, .adHeader, .adLabel, .adLoaded, .adOuterContainer, .adRight, .adSense, .adSlot, .adSpace, .adTop, .adUnit, .adWrap, .adWrapper, .ad_300, .ad_300_250, .ad_300_600, .ad_468x60, .ad_728_90, .ad__container, .ad__wrapper-element, .ad_adInfo, .ad_area, .ad_banner, .ad_block, .ad_bottom, .ad_box, .ad_boxright1, .ad_container, .ad_crown, .ad_default, .ad_desktop, .ad_footer, .ad_fullwidth, .ad_global_header, .ad_halfpage, .ad_label, .ad_label_method, .ad_leaderboard_atf, .ad_native, .ad_native_xrail, .ad_note, .ad_placeholder, .ad_placement, .ad_slug_table, .ad_space, .ad_spot, .ad_text, .ad_top, .ad_unit, .ad_wrap, .ad_wrapper, .ad_xrail, .ad_xrail_top, .ad_zone, .adbar, .adbottom, .adbox-rectangle, .adbox-wrapper, .adchoices, .adchoices-link, .adcode, .add300, .addisclaimer, .adframe, .adinjwidget, .adlateral, .adlink, .adloaded, .admain, .admarker, .admz, .adops, .adplace, .adrect, .adright, .adrotate_widgets, .ads--sidebar, .ads--top, .ads-block, .ads-bottom, .ads-box, .ads-footer, .ads-in-content, .ads-label, .ads-large, .ads-left, .ads-post, .ads-right, .ads-sidebar, .ads-to-hide, .ads-top, .ads-widget, .ads-wrapper, .ads1, .ads160-600, .ads160_600-widget, .ads_300, .ads__sidebar, .ads_ad_box, .ads_ad_box2, .ads_by, .ads_code, .ads_container, .ads_div, .ads_google, .ads_header, .ads_label, .ads_top, .adsanity-group, .adsbillboard, .adsblock, .adsbox, .adsbygoogle, .adsense-block, .adsense_single, .adsense_wrapper, .adsitem, .adslisting, .adslisting2, .adslistingz, .adsload, .adslot, .adslot_1, .adslot_2, .adslot_3, .adspace, .adspace-widget, .adspacer, .adspot, .adspot1, .adsrecnode, .adssidebar2, .adstop, .adswidget, .adtag, .adtester-container, .adtop, .adunit, .adunit-middle, .adunitContainer, .adv-border, .adv-container, .adv-label, .adv-slide-block-wrapper, .adv_left, .advads-widget, .advads_widget, .advert-block, .advert-box, .advert-container, .advert-content, .advert-leaderboard, .advert-mpu, .advert-text, .advert1, .advert2, .advertCont, .advertContainer, .advert_top, .advertisement-box, .advertisement-container, .advertisement-text, .advertisement-top, .advertisementBanner, .advertisement_box, .advertising-block, .advertising-content, .adverts, .adwords, .adwrap-widget, .afs_ads, .after-post-ad, .afw_ad, .article-ad-bottom, .article-adv-right-sideBar, .article-view__footer-ad, .article_ad, .aside-ad, .atf-ad-medRect, .b_ads, .banner-300x250, .banner-728x90, .banner-ad, .banner160x600, .banner_160x600, .banner_728x90, .banner_ad, .bannerad, .bannervcms, .bbccom_advert, .bean-advertisment, .below-next-nativeads, .betteradscontainer, .big-ad, .big-ads, .bigbox-ad, .billboard-ad, .billboard-ads, .block-ads, .block-dfp, .block1--ads, .blogAd, .bomAd, .bottom-ad, .bottom-ad-container, .bottom-ads, .bottom-main-adsense, .bottomAd, .bottomBannerAd, .bottom_ad, .bottom_ads, .bottomad, .bottomads, .box-ad, .box-advert, .box-recommend-ad, .breaker-ad, .browse-banner_ad, .bsa_it_ad, .bsac, .bsac-container, .bullet-sponsored-links-gray, .bunyad-ad, .bxad, .c-ad, .can_ad_slug, .carbon_ads, .card--article-ad, .center-ad, .chitikaAdBlock, .cm-ad, .cmAd, .cns-ads-stage, .column-ad, .contained-ad-container, .contained-ad-shaft, .contained-ad-wrapper, .container_ad, .content-ad, .content-ads, .content-list__ad-label, .contentAds, .content_ads, .contentad, .cta-ad, .cube-ad, .custom-ads, .dcmads, .desktop-ad, .desktop-ads, .desktop_ad, .detail-ad, .dfp-ad, .dfp-slot, .dfp-tag-wrapper, .dfp-wrapper, .dfp_ad, .dfp_slot, .dianomi-ad, .dikr-responsive-ads-slot, .display-ad, .div_adv300, .dmRosMBAdBox, .earAdv, .easyAdsBox, .etad, .ezAdsense, .ezo_ad, .ezoic-ad, .featured-ads, .feed-ad, .feed-s-update--is-sponsored, .feed-shared-post-meta--is-sponsored, .feed-shared-update--is-sponsored, .first-ad, .following-ad, .following-ad-container, .footer-ad, .footer-advert, .footer-leaderboard-ad, .footerad, .fortune-ad-tag__leaderboard, .fp-ads, .full-ad, .full-width-ad, .g1-advertisement, .g_ad, .gemini-ad, .general_banner_ad, .generic-ad-module, .google-ad, .google-ad-iframe, .google-ads, .googleAd, .googleAds, .google_ad, .google_ads, .google_ads_v3, .gpt-ad, .header-ad, .header-ad-wrapper, .header-top-ad, .headerAd, .header__ad, .header_ad, .heatmapthemead_ad_widget, .herald-ad, .hero-ad, .home-ad, .home-ads, .home-top-right-ads, .home_advertisement, .horizontalAdText, .horizontal_ad, .hp_adv300x250, .hp_advP1, .ht_ad_widget, .iAdserver, .iconads, .iframe-ad, .img_ad, .imuBox, .in-content-ad, .inline-ad, .inlinead, .innerAds, .internal_ad, .interstitial-ad, .ipsAd, .is-sponsored, .item-container-ad, .iw-leaderboard-ad, .js-ad, .js-ad-hover, .js-ad-slot, .js-ad-static, .js-dfp-ad, .js-native-ad, .js-stream-ad, .js-stream-featured-ad, .js_contained-ad-container, .layout-ad, .lazyadslot, .lbc-ad, .leader-ad, .leaderboard-ad, .leaderboard-ad-container, .leaderboard-ad-module, .leaderboard_ad, .left-ad, .leftAd, .ligatus, .logo-ad, .lower-ad, .lx_ad_title, .m-ad, .m-header-ad, .m-header-ad--slot, .m-in-content-ad, .m-in-content-ad--slot, .m-in-content-ad-row, .main-ad, .mediumRectangleAd, .member-ads, .middle-ad, .mmads, .mobads, .mobile-ad, .module-ads, .moduleAdSpot, .mom-ad, .mp-ad, .mpu-ad, .mpu_container, .mvp-ad-label, .mvp-feat1-list-ad, .mvp-widget-ad, .mvp_ad_widget, .myAds, .native-ad, .native-leaderboard-ad, .nativeAd, .native_ad, .nav-ad, .newsad, .ob_ads_header, .ob_container .item-container-obpd, .ob_dual_right > .ob_ads_header ~ .odb_div, .oio-banner-zone, .onf-ad, .openx, .overlay-ad, .pagefair-acceptable, .panel-ad, .panel-ad-mr, .partner-overlay-top-ad, .pencil-ad-section, .player-leaderboard-ad-wrapper, .plistaList > .itemLinkPET, .plistaList > .plista_widget_underArticle_item[data-type='pet'], .pm-ad-zone, .post-ad, .post__inarticle-ad-template, .poster-ad-asset-module, .profile-ad-container, .proper-ad-unit, .pubDesk, .pub_300x250, .pub_300x250m, .pub_728x90, .quads-ad1_widget, .quads-ad2, .quads-ad4, .quads-location, .rail-ad, .region-top-ad, .reklam2, .reklama, .reklama1, .responsive-ads, .right-ad, .right-ads, .right-rail-ad, .rightAd, .rightColumnAd, .right_ad, .right_side_ads, .rightads, .rmx-ad, .s_ad_160x600, .s_ad_300x250, .sam_ad, .search-ad, .section-ads, .sgAd, .side-ad, .side-ads, .side-ads-container, .side-ads_sticky-group, .sideAd, .sideAdv-wrapper, .sidead, .sidebar-ad, .sidebar-ad-slot, .sidebar-ad-wrapper, .sidebar-ads, .sidebar-advertisement, .sidebarAd, .sidebar_ad_1, .sidebar_ad_2, .sidebar_ad_3, .sidebar_ads, .sidebar_right_ad, .single-ad, .single_ad, .sister-ads, .slide-ad, .sponsor-block, .sponsor-logo, .sponsor-text, .sponsored-content, .sponsored-headlines, .sponsored-inmail, .sponsored-inmail-legacy, .sponsored-link, .sponsored-links, .sponsored_ad, .sponsored_content, .sponsors-box, .sponsorshipbox, .squareAd, .square_ad, .squaread, .sr-in-feed-ads, .standalone-ad-container, .static-ad, .sticky-ad, .sticky-ad-container, .sticky-sidebar-ad, .stickyad, .story-ad-container, .str-300x250-ad, .strawberry-ads, .stream-ad, .td-a-ad, .td-a-rec-id-custom_ad_1, .td-a-rec-id-custom_ad_2, .td-a-rec-id-custom_ad_3, .td-a-rec-id-custom_ad_4, .td-a-rec-id-custom_ad_5, .td-adspot-title, .td-header-ad-wrap, .text-ad, .text-ad-links, .text-ads, .textAd, .text_ad, .text_ads, .textad, .themonic-ad2, .tile-ad, .tmsads, .toolbar-ad, .top-300-ad, .top-ad, .top-ad-container, .top-adv, .top-advert, .top-advertisement, .top-banner-ad-container, .top-leaderboard-ad, .top_ad, .topads, .trc-content-sponsored, .trc-content-sponsoredUB, .variableHeightAd, .verticalAdText, .vertical_ad, .view-advertisements, .view-id-advertisements, .vuukle-ads, .w_ad, .wdt_ads, .widead, .widget-ad, .widget-ads, .widget-gpt2-ami-ads, .widget_ad_widget, .widget_adrotate_widgets, .widget_ads, .widget_advert, .widget_arvins_ad_randomizer, .widget_better-ads, .widget_cpxadvert_widgets, .widget_evolve_ad_gpt_widget, .widget_newscorpau_ads, .wikia-ad, .wpInsertAdWidget, .wpInsertInPostAd, .wpmrec, .wppaszone, .wpproaddlink, .yom-ad, .zmgad-full-width, .zmgad-right-rail, a[data-redirect^='http://click.plista.com/pets'], a[href*='.adform.net/'], a[href*='.smartadserver.com'], a[href*='/cmd.php?ad='], a[href*='/servlet/click/zone?'], a[href^='//www.mgid.com/'], a[href^='http://ad.doubleclick.net/'], a[href^='http://adclick.g.doubleclick.net/'], a[href^='http://adserver.adtech.de/'], a[href^='http://bs.serving-sys.com/'], a[href^='http://click.plista.com/pets'], a[href^='http://pubads.g.doubleclick.net/'], a[href^='http://track.adform.net/'], a[href^='https://ad.atdmt.com/'], a[href^='https://ad.doubleclick.net/'], a[href^='https://adclick.g.doubleclick.net/'], a[href^='https://bs.serving-sys.com'], a[href^='https://click.plista.com/pets'], a[href^='https://googleads.g.doubleclick.net/pcs/click'], a[href^='https://pubads.g.doubleclick.net/'], a[href^='https://track.adform.net/'],ytm-watch-metadata-app-promo-renderer, ytm-watch-metadata-app-promo-renderer.item, ytm-watch-metadata-app-promo-renderer.item:last-child {display: none !important;}
                </style>`;
            style = trustedModule.getHTML(style);

            document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', style);
        };

        const addWrapJSONParse = () => {
            (() => {
                const IS_DEV_MODE = true;
                const currentDomain = location.host;

                IS_DEV_MODE && console.log('[youtube page]', currentDomain);

                let _JSON = {};
                _JSON.parse = JSON.parse;

                function getObjectOfYoutubeAdDataRemoved(obj) {
                    let response = obj;

                    /**
                     * 광고 제거 필터
                     * m.youtube.com##+js(json-prune, playerResponse.adPlacements playerResponse.playerAds playerResponse.adSlots adPlacements playerAds adSlots important)
                     */

                    /** 광고 데이터 제거 - 시작 */
                    if (Object.keys(response).includes('playerResponse') === true) {
                        delete response.playerResponse['adPlacements'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.adPlacements removed.');

                        delete response.playerResponse['playerAds'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.playerAds removed.');

                        /** 추가 */
                        delete response.playerResponse['adSlots'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'playerResponse.adSlots removed.');
                    }

                    if (Object.keys(response).includes('adPlacements') === true) {
                        delete response['adPlacements'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'adPlacements removed.');
                    }

                    if (Object.keys(response).includes('playerAds') === true) {
                        delete response['playerAds'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'playerAds removed.');
                    }

                    /** 추가 */
                    if (Object.keys(response).includes('adSlots') === true) {
                        delete response['adSlots'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'adSlots removed.');
                    }

                    /** 추가 */
                    if (Object.keys(response).includes('important') === true) {
                        delete response['important'];
                        IS_DEV_MODE && console.log('[JSON.parse]', 'important removed.');
                    }

                    return response;
                }

                (() => {
                    IS_DEV_MODE && console.log('@@@@!', 'change JSON.parse function!!');
                    parent.JSON.parse = (jsonString) => {
                        let obj = _JSON.parse(jsonString);

                        if (typeof obj === 'object') {
                            try {
                                IS_DEV_MODE && console.log(jsonString);
                                return getObjectOfYoutubeAdDataRemoved(obj);
                            } catch (err) {
                                if (window.ClipDownProto?.javascriptErrorCallback !== undefined) {
                                    ClipDownProto.javascriptErrorCallback(err.message + ' ' + err.stack);
                                }
                                IS_DEV_MODE && console.log('error : ' + err.message);
                                IS_DEV_MODE && console.log('stack : ' + err.stack);
                            }
                        }
                        return obj;
                    };
                })();
            })();
        };

        const youtubeLogCallback = (currentMode, title, uploadDate, genre, author, isSubscript, youtubeId) => {
            if (typeof ClipDownProto !== 'undefined') {
                console.log('### logging :: ', title, document.querySelector('player-microformat-renderer script'));
                ClipDownProto.youtubeLogCallback(currentMode, title, uploadDate, genre, author, isSubscript, youtubeId);
            }
        };

        const youtubeLogModule = () => {
            let before = null;
            console.log('start monitorPlayer');

            const getCurrentMode = () => {
                let player = document.querySelector('#player-container-id .html5-video-player');
                if (player.classList.contains('unstarted-mode')) {
                    return 'unstarted-mode';
                } else if (player.classList.contains('paused-mode')) {
                    return 'paused-mode';
                } else if (player.classList.contains('playing-mode')) {
                    return 'playing-mode';
                } else if (player.classList.contains('ended-mode')) {
                    return 'ended-mode';
                } else if (player.classList.contains('ad-showing')) {
                    return 'ad-showing';
                } else {
                    console.log('check mode', `${player.getAttribute('class')}`);
                    return 'null';
                }
            };

            const isNeedTask = () => {
                if (location.href.indexOf('/watch?v') === -1) {
                    return false;
                } else {
                    return true;
                }
            };

            const getCurrentPlayingVideo = () => {
                const player = document.getElementById('movie_player');
                if (player !== null && player.getPlayerResponse() !== null) {
                    let videoData = player.getVideoData();
                    let playerResponse = player.getPlayerResponse();

                    let genre =
                        playerResponse?.microformat?.playerMicroformatRenderer?.category !== undefined
                            ? playerResponse?.microformat?.playerMicroformatRenderer?.category
                            : '';

                    let uploadDate =
                        playerResponse?.microformat?.playerMicroformatRenderer?.uploadDate !== undefined
                            ? playerResponse?.microformat?.playerMicroformatRenderer?.uploadDate
                            : '';

                    return {
                        genre,
                        uploadDate,
                        ...videoData,
                    };
                }
                return null;
            };

            monitorPlayer = setInterval(() => {
                if (isNeedTask()) {
                    /* console.log('Log Monitor Start'); */
                    let current = getCurrentMode();
                    /* console.log('before:' + before + ',current:' + current); */
                    if (before !== current) {
                        before = current;
                        (async () => {
                            let video = getCurrentPlayingVideo();
                            let subscripte = document.querySelector('ytm-subscribe-button-renderer button');
                            if (current !== 'unstarted-mode' && video !== null) {
                                let isSubscripte = subscripte === null ? false : subscripte.getAttribute('aria-pressed') === 'true';
                                youtubeLogCallback(current, video.title, video.uploadDate, video.genre, video.author, isSubscripte, video.video_id);
                            } else {
                                before = null;
                            }
                        })();
                    }
                }
            }, 300);
        };

        /** CDMOBILE-358, 동영상 디폴트 해상도 설정 */
        const setDefaultPlayerQuility = () => {
            console.log('setDefaultPlayerQuility() called.');
            let qualityData = localStorage.getItem('yt-player-quality');
            if (qualityData === null) {
                console.log('qualityData not exist.');
                let oneYearMilliseconds = 31557600000;
                let currentTime = new Date().getTime();
                let storageTime = oneYearMilliseconds + currentTime;
                let storageData = `{"data":"{\\"quality\\":720,\\"previousQuality\\":360}","expiration":${storageTime},"creation":${currentTime}}`;
                localStorage.setItem('yt-player-quality', storageData);

                console.log('set default qualityData', storageData);
            } else {
                console.log('qualityData already exist.');
            }
        };

        /**
         * [CDMOBILE-424] 구글 파이어베이스 버튼 클릭 이벤트 수집 기능 추가
         */
        const firebaseEventModule = (() => {
            const likeButtonMonitor = (() => {
                const marker = 'jsf_firebase';
                const selector = 'like-button-view-model';

                let handler;
                const task = () => {
                    let tag = document.querySelector(`${selector}:not(#${marker})`);

                    if (tag !== null) {
                        console.log('### likeButton add click Event Listener');
                        tag.id = marker;
                        tag.addEventListener('click', () => {
                            console.log('### 좋아요 버튼 클릭');
                            if (window.ClipDownProto?.callbackLikeButton !== undefined) {
                                console.log('### ClipDownProto.callbackLikeButton() 함수 호출 성공');
                                ClipDownProto.callbackLikeButton();
                            } else {
                                console.log('### ClipDownProto.callbackLikeButton() 함수 호출 실패');
                            }

                            /*
                            console.log('SnsAd Type : '+snsAdModule.getSnsType());
                            if (snsAdModule.getSnsType() === 'like') {
                                snsAdModule.completeSnsAd();
                            }
                            */
                        });
                    }

                    let isLike = document.querySelector('like-button-view-model button')?.attributes?.getNamedItem('aria-pressed')?.value;
                    if (isLike !== undefined && isLike === 'true') {
                        if (snsAdModule.getSnsType() === 'like') {
                            snsAdModule.completeSnsAd();
                        }
                    }
                };

                return {
                    start: () => {
                        handler = setInterval(() => {
                            task();
                        }, 200);
                    },
                    stop: () => {
                        clearInterval(handler);
                    },
                };
            })();

            const subscribeButtonMonitor = (() => {
                const marker = 'jsf_firebase';
                const selector = 'ytm-subscribe-button-renderer button';

                let handler;
                const task = () => {
                    let tag = document.querySelector(`${selector}:not(#${marker})`);

                    if (tag !== null) {
                        console.log('### subscribeButton add click Event Listener');
                        tag.id = marker;
                        tag.addEventListener('click', () => {
                            console.log('### 구독 버튼 클릭');
                            if (window.ClipDownProto?.callbackSubscribeButton !== undefined) {
                                console.log('### ClipDownProto.callbackSubscribeButton() 함수 호출 성공');
                                ClipDownProto.callbackSubscribeButton();
                            } else {
                                console.log('### ClipDownProto.callbackSubscribeButton() 함수 호출 실패');
                            }

                            /*
                            console.log('SnsAd Type : '+snsAdModule.getSnsType());
                            if (snsAdModule.getSnsType() === 'subscribe') {
                                snsAdModule.completeSnsAd();
                            }
                              */
                        });
                    }

                    let isSubscribe = document.querySelector('ytm-subscribe-button-renderer')?.classList.contains('is-subscribed');
                    if (isSubscribe !== undefined && isSubscribe === true) {
                        if (snsAdModule.getSnsType() === 'subscribe') {
                            snsAdModule.completeSnsAd();
                        }
                    }
                };

                return {
                    start: () => {
                        handler = setInterval(() => {
                            task();
                        }, 200);
                    },
                    stop: () => {
                        clearInterval(handler);
                    },
                };
            })();

            const commentButtonMonitor = (() => {
                const marker = 'jsf_firebase';
                const selector = `ytm-comments-header-renderer button[aria-label='댓글']`;

                let handler;
                const task = () => {
                    let tag = document.querySelector(`${selector}:not(#${marker})`);

                    if (tag !== null) {
                        console.log('### commentButton add click Event Listener');
                        tag.id = marker;
                        tag.addEventListener('click', () => {
                            console.log('### 댓글 버튼 클릭');
                            if (window.ClipDownProto?.callbackCommentButton !== undefined) {
                                console.log('### ClipDownProto.callbackCommentButton() 함수 호출 성공');
                                ClipDownProto.callbackCommentButton();
                            } else {
                                console.log('### ClipDownProto.callbackCommentButton() 함수 호출 실패');
                            }
                        });
                    }
                };

                return {
                    start: () => {
                        handler = setInterval(() => {
                            task();
                        }, 200);
                    },
                    stop: () => {
                        clearInterval(handler);
                    },
                };
            })();

            return {
                start: () => {
                    likeButtonMonitor.start();
                    subscribeButtonMonitor.start();
                    commentButtonMonitor.start();
                },
                stop: () => {
                    likeButtonMonitor.stop();
                    subscribeButtonMonitor.stop();
                    commentButtonMonitor.stop();
                },
            };
        })();

        (() => {
            /**
             * CDMOBILE-750 백그라운드 오디오 재생 현상 수정
             * - 페이지의 visibilityState 값이 Hidden 이고 유튜브 플레이어의 상태 값이 ended(0) 인 경우, 자동재생 팝업 취소 버튼 클릭 로직 수행
             * - 5000초 동안 시도 후, 종료 처리
             */
            const LOG_PREFIX = 'cancelAutoPlay';

            const cancelAutoPlay = () =>
                new Promise((resolve, reject) => {
                    let handler = setInterval(() => {
                        let target = document.querySelector('ytm-button-renderer.cancel-autoplay > button');
                        if (target !== null) {
                            console.log(LOG_PREFIX, 'button exist!, click button!');

                            clearInterval(handler);
                            target.click();
                            resolve(true);
                        } else {
                            console.log(LOG_PREFIX, 'button does not exist...');
                        }
                    }, 200);

                    setTimeout(() => {
                        clearInterval(handler);
                        reject(false);
                    }, 5000);
                });

            let isBusy = false;
            let player = document.getElementById('movie_player');
            document.addEventListener('visibilitychange', () => {
                console.log(LOG_PREFIX, document.visibilityState, new Date());

                if (document.visibilityState === 'hidden') {
                    if (player !== null && player.getPlayerState() !== 0) {
                        console.log(LOG_PREFIX, 'player state is not ended!');
                        return;
                    }

                    if (isBusy === false) {
                        isBusy = true;
                        (async () => {
                            try {
                                await cancelAutoPlay();
                                console.log(LOG_PREFIX, 'SUCCESS');
                            } catch (e) {
                                console.log(LOG_PREFIX, 'FAIL', e);
                            }
                            isBusy = false;
                        })();
                    }
                }
            });
        })();

        (function () {
            /** cashmate 비회원이 경우 광고 제거 함수 호출 필요 */
            cashmate.addWrapJSONParse = addWrapJSONParse;
            disableYoutubeAD();
            disableYoutubeHeaderAndVideo();
            videoSoundOn();
            videoPlayerLayoutChecker();
            locationChecker().start();
            youtubeLogModule();
            setDefaultPlayerQuility();
            firebaseEventModule.start();
            shareButtonMonitor();
        })();
    }

    const ready = (fn) => {
        if (document.readyState !== 'loading') {
            console.log('ready');
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    /**
     * [CDMOBILE-775] pip 모드 시, 영상 재생되지 않는 현상 처리
     */
    ready(() => {
        const time = localStorage.getItem('jsf-pip-time');
        console.log('pip seek time', time);
        if (time !== null) {
            try {
                window.scrollTo(0, 0);
                removeDrawerLayout();
                window.callbackVideoPlayPauseButton(true);

                const player = document.getElementById('movie_player');
                player.seekTo(time);
                player.unMute();
                localStorage.removeItem('jsf-pip-time');
            } catch (error) {
                console.error('pip seek error!!!', error);
            }
        }
    });
})();

/**
 * SNS-35 SNS 광고 뱃지 추가
 */

const snsAdModule = (() => {
    let snsAdType = '';
    let point = 0;
    let actionHandler = null;
    let isFinished = false;
    let isShowAlert = false;

    const init = (snsAdType_, point_) => {
        self.snsAdType = snsAdType_;
        self.point = point_;

        let resVerification = verification();
        if (resVerification) {
            drawLayout(true, true);
        } else {
            self.snsAdType = '';
            console.log('SNS 광고 참여가 불가능한 상태입니다.');
        }
    };

    const verification = () => {
        console.log('광고 참여 가능 여부 확인 (로그인, 좋아요구독 상태)');

        if (!isLoginStatus()) {
            console.log('로그인 상태가 아닙니다.');
            aosCallBack(false, 'Youtube가 미로그인 상태입니다.', 'checkState');
            return false;
        }

        if (self.snsAdType === 'like') {
            if (getStateLike()) {
                if (!isShowAlert) {
                    alert('이미 좋아요/구독중이므로 광고 참여가 불가합니다.');
                    isShowAlert = true;
                }
                aosCallBack(false, '이미 좋아요를 한 영상입니다.', 'checkState');

                return false;
            }
        } else {
            if (getStateSubscribe()) {
                if (!isShowAlert) {
                    alert('이미 좋아요/구독중이므로 광고 참여가 불가합니다.');
                    isShowAlert = true;
                }
                aosCallBack(false, '이미 구독를 한 영상입니다.', 'checkState');

                return false;
            }
        }

        return true;
    };

    const completeSnsAd = () => {
        if (self.snsAdType === 'like') {
            if (!isFinished) {
                console.log(self.snsAdType + '!!');
                drawLayout(false);
                clearInterval(self.actionHandler);
                disableAction();
                aosCallBack(true, '광고참여가 완료되었습니다.', 'adJoinComplete');
                isFinished = true;
            }
        } else {
            if (!isFinished) {
                drawLayout(false);
                clearInterval(self.actionHandler);
                disableAction();
                aosCallBack(true, '광고참여가 완료되었습니다.', 'adJoinComplete');
                isFinished = true;
            }
        }
    };

    const aosCallBack = (result, message, data) => {
        if (window.ClipDownProto?.snsAdCallback !== undefined) {
            console.log('Call AosCallBack ' + result + ', ' + message + ', ' + data);
            window.ClipDownProto.snsAdCallback(result, message, data);
        } else {
            console.log('Cant Call AosCallBack ' + result + ', ' + message + ', ' + data);
        }
    };

    const disableAction = () => {
        if (self.snsAdType === 'like') {
            let likeButtonContainer = document.querySelector('.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper');
            if (likeButtonContainer !== null) {
                likeButtonContainer.style.pointerEvents = 'none';
            } else {
                console.log('likeButtonContainer is null', 'check tag.');
            }
        } else if (self.snsAdType === 'subscribe') {
            let subscribeButton = document.querySelector('ytm-subscribe-button-renderer button');
            if (subscribeButton !== null) {
                subscribeButton.style.pointerEvents = 'none';
            } else {
                console.log('subscribeButton is null', 'check tag.');
            }
        }
    };

    const getStateLike = () => {
        let isLike = document.querySelector('like-button-view-model button')?.attributes?.getNamedItem('aria-pressed')?.value;
        return isLike !== undefined && isLike === 'true';
    };

    const getStateSubscribe = () => {
        let isSubscribe = document.querySelector('ytm-subscribe-button-renderer')?.classList.contains('is-subscribed');
        return isSubscribe !== undefined && isSubscribe === true;
    };

    const isLoginStatus = () => {
        let isLoggedIn = false;

        if (typeof ytcfg !== 'undefined' && typeof ytcfg.get === 'function') {
            isLoggedIn = ytcfg.get('LOGGED_IN');
        } else if (window.ytInitialData?.responseContext?.webResponseContextExtensionData?.ytConfigData?.LOGGED_IN !== undefined) {
            isLoggedIn = window.ytInitialData.responseContext.webResponseContextExtensionData.ytConfigData.LOGGED_IN;
        }

        if (isLoggedIn === true) {
            return true;
        } else {
            return false;
        }
        return isLoggedIn;
    };

    const drawLayout = (isShow_, isFirst_ = false) => {
        if (isFirst_) {
            const styleElement = document.createElement('style');
            styleElement.id = 'badge-styles';
            styleElement.textContent = `
            .badge_point_view { display: inline; position: absolute; margin: 10px 10px; z-index: 999; }
            .badge_point_view.badge_right { top: 0; right: 0; transform: translate(-45px, -15px); }
            .badge_point_view.badge_left { top: 5px; left: 0; transform: translate(12px, -30px); }
            .badge_point_view .bubble { background: #E21D19; padding: 6px 12px; text-align: center; border-radius: 30px; filter: drop-shadow(0 0px 3px rgba(0, 0, 0, 0.3)); }
            .badge_point_view .bubble.bubble_side:before {
                content: '';
                position: absolute;
                width: 0px;
                height: 0px;
                right: 0;
                bottom: 0;
                border-top: 8px solid transparent;
                border-left: 8px solid transparent;
                border-right: 8px solid #E21D19;
                border-bottom: 8px solid #E21D19;
                transform: rotate(90deg);
            }
            .badge_point_view .bubble.bubble_bottom:before {
                content: '';
                position: absolute;
                width: 0px;
                height: 0px;
                left: 42%;
                bottom: -4px;
                border-top: 4px solid #E21D19;
                border-left: 4px solid #E21D19;
                border-right: 4px solid transparent;
                border-bottom: 4px solid transparent;
                transform: rotate(-135deg);
            }
            .badge_point_view .bubble .text_point { position: relative; color: #fff; font-size: 13px; font-weight: 800; line-height: 1; }
        `;
            document.head.appendChild(styleElement);
        }

        if (self.snsAdType === 'like') {
            if (isShow_) {
                const badgeHTML =
                    `
                    <div class="badge_point_view badge_left">
                        <div class="bubble bubble_bottom">
                            <div class="text_point">
                                <span class="message font_en">` +
                                self.point +
                                `P</span>
                            </div>
                        </div>        
                    </div>
                `;

                const wrapper = document.createElement('div');
                wrapper.innerHTML = trustedModule.getHTML(badgeHTML);

                document.querySelector('.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper').appendChild(wrapper);
                document.querySelector('.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper').style.position = 'relative';
                document.querySelector('.slim-video-action-bar-actions').style.overflowY = '';
                document.querySelector('.slim-video-action-bar-actions').style.padding = '20px 16px 8px';
            } else {
                let tooltip = document.querySelector('.badge_point_view');
                if (tooltip !== null) {
                    tooltip.remove();
                }
            }
        } else {
            if (isShow_) {
                const badgeHTML =
                    `
                <div class="badge_point_view badge_right">
                    <div class="bubble bubble_side">
                        <div class="text_point">
                            <span class="message font_en">` +
                    self.point +
                    `P</span>
                        </div>
                    </div>                     
                </div>
            `;
                const wrapper = document.createElement('div');
                wrapper.innerHTML = trustedModule.getHTML(badgeHTML);

                document.querySelector('.slim-owner-subscribe-button.cbox').appendChild(wrapper);
                document.querySelector('.slim-owner-subscribe-button.cbox').style.position = 'relative';
            } else {
                let tooltip = document.querySelector('.badge_point_view');
                if (tooltip !== null) {
                    tooltip.remove();
                }
            }
        }
    };

    const version = () => {
        console.log('1.0.52');
    };

    const getSnsType = () => {
        return self.snsAdType;
    };

    return {
        init,
        version,
        aosCallBack,
        getSnsType,
        completeSnsAd,
    };
})();

(() => {
    const ready = (fn) => {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    ready(() => {
        if (window.__YSW_RUNNING__) {
            console.log('[YSW] already running in', location.href);
            return;
        }
        window.__YSW_RUNNING__ = true;

        /** 기본 상수 */
        const DEBUG = false;
        const PREFIX = '@!@YSW';
        const SCAN_INTERVAL_MS = 2000;

        /** 로거 */
        const log = (...a) => {
            if (DEBUG) console.log(PREFIX, ...a);
        };

        /** 우상단 배지로 주입 확인 */
        const mountBadge = () => {
            try {
                if (document.getElementById('__ysw_badge__')) return;
                const b = document.createElement('div');
                b.id = '__ysw_badge__';
                b.textContent = 'YSW ON';
                Object.assign(b.style, {
                    position: 'fixed',
                    top: '8px',
                    right: '8px',
                    zIndex: 2147483647,
                    font: '12px/1.4 -apple-system,system-ui,Segoe UI,Roboto,Arial',
                    background: 'rgba(0,0,0,.7)',
                    color: '#fff',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    pointerEvents: 'none',
                });
                if (DEBUG) {
                    document.documentElement.appendChild(b);
                }
            } catch { }
        };

        /** 팝업 후보 셀렉터 / 감지 문구 / 버튼 힌트 */
        const DIALOG_SEL = [
            'tp-yt-paper-dialog',
            '.yt-spec-dialog-layout',
            'ytd-popup-container',
            'yt-confirm-dialog-renderer',
            'dialog[role="dialog"]',
            '#dialog',
            '#dialog-container',
            '[aria-modal="true"]',
            'ytm-modal-dialog-renderer',
            'ytm-dialog',
            'ytm-confirm-dialog-renderer',
        ].join(',');
        const TEXT_RE = new RegExp(
            '(동영상이\\s*일시정지되었습니다\\.?|이어\\s*서\\s*시청하시겠어요\\??|계속\\s*시청|Are\\s*you\\s*still\\s*watching\\??|Video\\s*paused|Continue\\s*watch(?:ing)?\\??|Still\\s*watching\\??)',
            'i'
        );
        const BTN_HINTS = ['계속', '예', '확인', '시청', '재생', 'Yes', 'OK', 'Continue', 'Resume', 'Play'];

        /** 유틸: 공백 접기 */
        const collapseWhitespace = (str) => {
            let out = '',
                inSpace = true;
            for (const ch of str ?? '') {
                const isWS = ch.trim() === '' || ch === '\u00A0' || ch === '\u200B';
                if (isWS) {
                    if (!inSpace) {
                        out += ' ';
                        inSpace = true;
                    }
                } else {
                    out += ch;
                    inSpace = false;
                }
            }
            return out.trim();
        };

        /** 유틸: 엘리먼트 텍스트 */
        const elemText = (el) => collapseWhitespace(el?.innerText || el?.textContent || '');

        /** 팝업 텍스트 매칭 */
        const looksLikeStillWatching = (c) => TEXT_RE.test(elemText(c));

        /** 후보 다이얼로그 수집 */
        const candidateDialogs = () =>
            [...document.querySelectorAll(DIALOG_SEL)].filter((el) => {
                const st = getComputedStyle(el);
                return st && st.display !== 'none' && st.visibility !== 'hidden';
            });

        /** 버튼 스코어링 */
        const scoreButton = (btn) => {
            const t = elemText(btn).toLowerCase();
            let s = 0;
            for (const k of BTN_HINTS) if (t.includes(k.toLowerCase())) s += 2;
            if (btn.getAttribute('dialog-dismiss') != null) s += 1;
            return s;
        };

        /** 버튼 찾기 */
        const findButtons = (c) => {
            const sel = [
                'button',
                'tp-yt-paper-button',
                '.yt-spec-button-shape-next button',
                'yt-button-renderer button',
                'ytm-button-renderer button',
            ].join(',');
            return [...c.querySelectorAll(sel)].sort((a, b) => scoreButton(b) - scoreButton(a));
        };

        /** iOS/Android/CustomEvent 통지 */
        const notify = (event, detail = {}) => {
            log(`event=${event}`, detail);
            try {
                if (window.webkit?.messageHandlers?.ClipDownProto) {
                    window.webkit.messageHandlers.ClipDownProto.postMessage({ method: 'stillWatching', event, payload: detail });
                } else if (window.Android?.postMessage) {
                    window.Android.postMessage(JSON.stringify({ type: 'stillWatching', event, detail }));
                }
            } catch { }
            try {
                window.dispatchEvent(new CustomEvent('ysw:' + event, { detail }));
            } catch { }
        };

        /** 팝업 처리 */
        let lastActionTs = 0;
        const handlePopup = (container) => {
            if (!looksLikeStillWatching(container)) return;
            notify('detected', { text: elemText(container).slice(0, 200) });

            /** 1) 버튼 클릭 */
            const btns = findButtons(container);
            for (const b of btns) {
                const t = elemText(b);
                if (BTN_HINTS.some((k) => t.toLowerCase().includes(k.toLowerCase()))) {
                    b.click();
                    notify('dismissed', { by: 'button', label: t });
                    lastActionTs = Date.now();
                    return;
                }
            }

            /** 2) video.play() */
            const video = document.querySelector('video');
            if (video && video.paused) {
                video
                    .play()
                    .then(() => notify('dismissed', { by: 'video.play()' }))
                    .catch(() => { });
                lastActionTs = Date.now();
                return;
            }

            /** 3) 단축키 k */
            const ev = new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', bubbles: true });
            document.dispatchEvent(ev);
            notify('dismissed', { by: 'key:k' });
            lastActionTs = Date.now();
        };

        /** 주기 스캔 */
        const scan = () => {
            if (DEBUG) {
                console.log(PREFIX, 'scanning...', { href: location.href, isTop: window.top === window, t: Date.now() });
            }

            const dialogs = candidateDialogs();
            dialogs.forEach((d) => {
                if (Date.now() - lastActionTs > 3000) handlePopup(d);
            });
        };

        /** 안전한 루트 노드 탐색 */
        const getRootNodeSafe = () => document.documentElement || document.body || null;

        /** DOM 준비 보장 */
        const onDomReady = (fn) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') fn();
            else document.addEventListener('DOMContentLoaded', fn, { once: true });
        };

        /** MutationObserver 설치 (루트 준비될 때까지 재시도) */
        const installObserver = (cb) => {
            const mo = new MutationObserver(cb);
            const tryObserve = () => {
                const root = getRootNodeSafe();
                if (root && typeof root.nodeType === 'number') {
                    mo.observe(root, { childList: true, subtree: true });
                    log('MutationObserver attached to', root === document.documentElement ? 'documentElement' : 'body');
                } else {
                    setTimeout(tryObserve, 200);
                }
            };
            tryObserve();
            return mo;
        };

        /** 시작 시퀀스 */
        let timer;
        onDomReady(() => {
            mountBadge();
            installObserver(() => scan());
            timer = setInterval(scan, SCAN_INTERVAL_MS);
            log('started (detect + auto-dismiss)', { href: location.href, isTop: window.top === window });
        });

        /** SPA 내비게이션 대응 (모바일/데스크톱 이벤트 모두) */
        const rearm = () => {
            if (timer) clearInterval(timer);
            timer = setInterval(scan, SCAN_INTERVAL_MS);
            if (DEBUG) {
                console.log(PREFIX, 're-armed after navigation', location.href);
            }

            mountBadge();
        };
        window.addEventListener('ytm-navigate-finish', rearm);
        window.addEventListener('ytm-page-data-updated', rearm);
        window.addEventListener('yt-navigate-finish', rearm);
        window.addEventListener('yt-page-data-updated', rearm);
    });

    /** 이미 실행 중이면 중복 실행 방지 */
})();

(() => {
    if (window.__YSW_CAPTION_FULLSCREEN_ONLY__) return;
    window.__YSW_CAPTION_FULLSCREEN_ONLY__ = true;

    /** 설정: 전체화면에서만 적용할 이동량(vh) */
    const STYLE_ID = 'ysw-cap-fs-only-style';
    const NUDGE_VH_FULLSCREEN = 12; /** 필요시 숫자만 조절 (권장 8~14) */

    /** 유틸: 전체화면 여부 */
    function isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    }

    /** 유틸: <style> 보장 */
    function ensureStyleTag() {
        let tag = document.getElementById(STYLE_ID);
        if (!tag) {
            tag = document.createElement('style');
            tag.id = STYLE_ID;
            (document.head || document.documentElement).appendChild(tag);
        }
        return tag;
    }

    /** CSS 생성: 전체화면일 때만 자막 위로 이동 */
    function cssFullscreen(vh) {
        return `
        /** 전체화면에서만 자막 컨테이너를 위로 이동 */
        .ytp-fullscreen .ytp-caption-window-container,
        .ytp-fullscreen .ytp-caption-window-bottom {
        transform: translateY(calc(-1 * ${vh}vh)) !important;
        will-change: transform;
        z-index: 2147483647 !important;
        opacity: 1 !important;
        pointer-events: none;
        }

        /** 가독성 최소 보정 */
        .ytp-fullscreen .ytp-caption-segment {
        text-shadow: 0 0 2px rgba(0,0,0,.8), 0 0 4px rgba(0,0,0,.6);
        }
    `.trim();
        }

    /** 적용/해제: 전체화면이면 CSS 주입, 아니면 제거 */
    function applyForFullscreen() {
        const tag = ensureStyleTag();
        if (isFullscreen()) {
            tag.textContent = cssFullscreen(NUDGE_VH_FULLSCREEN);
        } else {
            /** 일반/시어터 모드에서는 완전히 비워서 영향 제거 */
            tag.textContent = '';
        }
    }

    /** 초기 1회 적용 */
    applyForFullscreen();

    /** 전체화면 전환 이벤트만 수신 */
    ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach((ev) =>
        document.addEventListener(ev, applyForFullscreen, { passive: true })
    );

    /** 외부 제어 API: WKWebView에서 런타임으로 수치 조절 */
    window.__setCaptionFullscreenVh = function (vh) {
        if (typeof vh !== 'number') return;
        const tag = ensureStyleTag();
        if (isFullscreen()) {
            tag.textContent = cssFullscreen(vh);
        } else {
            /** 전체화면이 아닐 때 호출해도 다음 진입 시 적용되도록 저장해두려면 아래 라인으로 교체
             *  tag.textContent = cssFullscreen(vh);
             *  지금은 일반 모드 무영향 원칙을 위해 비워둡니다.
             */
            tag.textContent = '';
        }
    };

    /** 완전 초기화(원복) */
    window.__yswResetCaptions = function () {
        const tag = document.getElementById(STYLE_ID);
        if (tag) tag.remove();
        delete window.__YSW_CAPTION_FULLSCREEN_ONLY__;
    };
})();
