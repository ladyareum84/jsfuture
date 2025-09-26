// 뉴스 탭
$(function() {
$('ul.tab li').click(function() {
	var activeTab = $(this).attr('data-tab');
	$('ul.tab li').removeClass('current');
	$('.tabcontent').removeClass('current');
	$(this).addClass('current');
	$('#' + activeTab).addClass('current');
})
});
// 갤러리
    $(document).ready(function(){
		$('.responsive').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 4,
		  slidesToScroll: 4,

		});
    });
// 갤러리
    $(document).ready(function(){
		$('.responsive2').slick({
		  dots: false,
		  infinite: false,
		  speed: 300,
		  slidesToShow: 3,
		  slidesToScroll: 3,
		  responsive: [
			{
			  breakpoint: 999,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			  }
			}/*,
			{
			  breakpoint: 600,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}*/
		  ]
		});
    });

// 개인정보방침
function pri()
{
var Cwidth = 800;
var Cheight = 900;
var CTop  = (screen.height-Cheight)/2;
var CLeft = (screen.width-Cwidth)/2;

window.open('pri.html','pri','top='+CTop+',left='+CLeft+',width='+Cwidth+',height='+Cheight+',menubars=no, scrollbars=yes');
}

// 스크롤 및 모달 슬라이더
/*
jQuery(document).ready(function($){
	window.prettyPrint && prettyPrint();
	$('.wrapper').scrollbar();
});
*/


settings = {
	//Model Popup
	objModalPopupBtn: ".modalButton",
	objModalCloseBtn: ".overlay, .closeBtn",
	objModalDataAttr: "data-popup",
	objModalContentsNo: "contents-no"
}

$(settings.objModalPopupBtn).bind("click", function () {
	if($(this).attr(settings.objModalDataAttr)) {
		var strDataPopupName = $(this).attr(settings.objModalDataAttr);
		var strContentsNo = $(this).attr(settings.objModalContentsNo);
		setContents(strDataPopupName, strContentsNo);

		// 레이어팝업실행시 네이버스크립트호출
		if(strDataPopupName == 'matzip') {
			$.get("../ajax/log_activity.php", { logtype: "click", pagename: "main", t: "6-1", sub: "0" } );

			/*
			if(!wcs_add) var wcs_add = {};
			wcs_add["wa"] = getCode('6-1');
			wcs_do();
			*/
		}
		else if(strDataPopupName == 'ggultip') {
			$.get("../ajax/log_activity.php", { logtype: "click", pagename: "main", t: "6-2", sub: "0" } );

			/*
			if(!wcs_add) var wcs_add = {};
			wcs_add["wa"] = getCode('6-2');
			wcs_do();
			*/
		}
		else if(strDataPopupName == 'humor') {
			$.get("../ajax/log_activity.php", { logtype: "click", pagename: "main", t: "6-3", sub: "0" } );

			/*
			if(!wcs_add) var wcs_add = {};
			wcs_add["wa"] = getCode('6-3');
			wcs_do();
			*/
		}

		//Fade In Modal Pop Up
		$(".overlay, #" + strDataPopupName).fadeIn(170);
		$('.responsive').resize();
		$("body").css({overflow:'hidden'}).bind('touchmove', function(e){e.preventDefault()});
	}
});

//On clicking the modal background
$(settings.objModalCloseBtn).bind("click", function () {
	$(".modal").fadeOut(90);
	 $("body").css({overflow:'scroll'}).unbind('touchmove');
});

var setContents = function(catname, conid) {
		$.post("../ajax/index_fb_contents.php", { fb_id: conid })
			.done(function(data) {
				var html = '<div class="popup_img wrapper scrollbar-dynamic">';
				$.each(data.fb_image, function(i, val) {
					html += '<img src="' + val + '" class="page-content">';
				});
				html += '</div>';
				$("#" + catname + " > .modalWrapper").html(html);
				$("#" + catname + " > .popup_content").text(data.fb_title);
			});
	}


// 검색시 함수
function searchKey(e) {
	if(e.key.value == "") {
		alert("검색어를 입력해주세요");
		return false;
	}

	$.get("../ajax/log_activity.php", { logtype: "click", pagename: "main", t: "2", sub: "0" } )
	.always(function() {
		var url = '//www.helpsearch.co.kr/search/search.php?query=' + e.key.value;
		window.location.href = url;
		return false;
	});

	/*
	// 검색시 네이버스크립트호출
	if(!wcs_add) var wcs_add = {};
	wcs_add["wa"] = getCode('2');
	wcs_do();

	var url = 'http://www.helpsearch.co.kr/search/search.php?query=' + e.key.value;
	window.location = url;
	return false;
	*/
}
