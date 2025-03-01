//Tabs
$('.tab_container .tab_content').not(':first').hide();
$('.tab_container .sub_content').each(function(){
	var idValue = $(this).attr('id');
	if(idValue.charAt(idValue.length - 1) != 1){
		$(this).hide();
	}else{
		$("li[rel=" + idValue + "]").addClass("active");
	}
});

$('.tabs.tabs_nav li').click(function(){
	$('.tabs.tabs_nav li').removeClass('active'); 
	$(this).addClass('active');					 
	var tab_id = $(this).attr('rel');
	$('.tab_container .tab_content').hide();
	$('#'+tab_id).show();
});

$('.tabs.table_tabs_nav li').click(function(){
	$('.tabs.table_tabs_nav li').removeClass('active'); 
	$(this).addClass('active');					 
	var tab_id = $(this).attr('rel');
	$('.tab_container .tab_content').hide();
	$('#'+tab_id).show();
});

// MultiTabs _ 2depth일때사용
$('.tabs.sub_tabs_nav li').click(function(){
	$(this).parent().children().removeClass('active'); 
	$(this).addClass('active');
	var tab_id = $(this).attr('rel');
	$('.tab_container .sub_content').each(function(){
		if($(this).attr('id').substring(0, 6) == tab_id.substring(0, 6)){
			$(this).hide();
		}
	});
	$('#'+tab_id).show();
});


var windowHeight;
$(document).ready(function() {
	$("#monthlyCouponTooltipBtn, #monthlyCouponTooltipCloseBtn").click(function () {
		if ($("#monthlyCouponTooltipBtn").attr("aria-expanded") == 'true') {
			$("#monthlyCouponTooltipBtn").attr("aria-expanded", "false");
		} else {
			$("#monthlyCouponTooltipBtn").attr("aria-expanded", "true");
		}

		if ($("#monthlyCouponNoticeTooltip").attr("aria-hidden") == 'true') {
			$("#monthlyCouponNoticeTooltip").attr("aria-hidden", "false");
		} else {
			$("#monthlyCouponNoticeTooltip").attr("aria-hidden", "true");
		}
	});
});


// input file name
jQuery('#inputFile').change(function(e) {
	var filename = e.target.files[0].name
	jQuery('.help-text').html(filename);
  });


// Calendar
$(document).ready(function() {
    calendarInit();
});
/*
    달력 렌더링 할 때 필요한 정보 목록 

    현재 월(초기값 : 현재 시간)
    금월 마지막일 날짜와 요일
    전월 마지막일 날짜와 요일
*/

function calendarInit() {

    // 날짜 정보 가져오기
    var date = new Date(); // 현재 날짜(로컬 기준) 가져오기
    var utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
    var kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
    var today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)
  
    var thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // 달력에서 표기하는 날짜 객체
  
    
    var currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
    var currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
    var currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

    // kst 기준 현재시간
    // console.log(thisMonth);

    // 캘린더 렌더링
    renderCalender(thisMonth);

    function renderCalender(thisMonth) {

        // 렌더링을 위한 데이터 정리
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();
        currentDate = thisMonth.getDate();

        // 이전 달의 마지막 날 날짜와 요일 구하기
        var startDay = new Date(currentYear, currentMonth, 0);
        var prevDate = startDay.getDate();
        var prevDay = startDay.getDay();

        // 이번 달의 마지막날 날짜와 요일 구하기
        var endDay = new Date(currentYear, currentMonth + 1, 0);
        var nextDate = endDay.getDate();
        var nextDay = endDay.getDay();

        // console.log(prevDate, prevDay, nextDate, nextDay);

        // 현재 월 표기
        $('.year_month').text(currentYear + '.' + (currentMonth + 1));

        // 렌더링 html 요소 생성
        calendar = document.querySelector('.dates')
        calendar.innerHTML = '';
        
        // 지난달
        for (var i = prevDate - prevDay + 0; i <= prevDate; i++) {
            calendar.innerHTML = calendar.innerHTML + '<div class="day prev disable">' + i + '</div>'
        }
        // 이번달
        for (var i = 1; i <= nextDate; i++) {
            calendar.innerHTML = calendar.innerHTML + '<div class="day current">' + i + '</div>'
        }
        // 다음달
        for (var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
            calendar.innerHTML = calendar.innerHTML + '<div class="day next disable">' + i + '</div>'
        }

        // 오늘 날짜 표기
        if (today.getMonth() == currentMonth) {
            todayDate = today.getDate();
            var currentMonthDate = document.querySelectorAll('.dates .current');
            currentMonthDate[todayDate -1].classList.add('today');
        }
    }

    // 이전달로 이동
    $('.go_prev').on('click', function() {
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        renderCalender(thisMonth);
    });

    // 다음달로 이동
    $('.go_next').on('click', function() {
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        renderCalender(thisMonth); 
    });
}


// 오늘의 포인트
$('.counter').each(function() {
    var $this = $(this),
        countTo = $this.attr('data-count');
    
    $({ countNum: $this.text()}).animate({
      countNum: countTo
    },
  
    {
  
      duration: 2000,
      easing:'linear',
      step: function() {
        $this.text(Math.floor(this.countNum));
      },
      complete: function() {
        $this.text(this.countNum);
        //alert('finished');
      }
  
    });  
  });
