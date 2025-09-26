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