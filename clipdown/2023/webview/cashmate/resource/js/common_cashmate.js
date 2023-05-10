//Tabs
$('.tab-container .tab-content').not(':first').hide();
$('.tab-container .sub-content').each(function(){
	var idValue = $(this).attr('id');
	if(idValue.charAt(idValue.length - 1) != 1){
		$(this).hide();
	}else{
		$("li[rel=" + idValue + "]").addClass("active");
	}
});

$('.tabs.tabs-nav li').click(function(){
	$('.tabs.tabs-nav li').removeClass('active'); 
	$(this).addClass('active');					 
	var tab_id = $(this).attr('rel');
	$('.tab-container .tab-content').hide();
	$('#'+tab_id).show();

});
$('.tabs.table-tabs-nav li').click(function(){
	$('.tabs.table-tabs-nav li').removeClass('active'); 
	$(this).addClass('active');					 
	var tab_id = $(this).attr('rel');
	$('.tab-container .tab-content').hide();
	$('#'+tab_id).show();
});

// MultiTabs - 2depth일때사용
$('.tabs.sub-tabs-nav li').click(function(){
	$(this).parent().children().removeClass('active'); 
	$(this).addClass('active');
	var tab_id = $(this).attr('rel');
	$('.tab-container .sub-content').each(function(){
		if($(this).attr('id').substring(0, 6) == tab_id.substring(0, 6)){
			$(this).hide();
		}
	});
	$('#'+tab_id).show();
});
