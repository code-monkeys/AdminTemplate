$(function(){
	$("#skin-default").click(function(){
		$("body").removeClass("skin-inverse");
		var url = $(this).data("route");  
		$.get(url);
	});
	$("#skin-inverse").click(function(){
		$("body").addClass("skin-inverse");
		var url = $(this).data("route");  
		$.get(url);
	});
});