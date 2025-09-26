var animating = false, repos;

var easing = [0.86, 0, 0.07, 1];

$(document).ready(function(){
	
	var $shapes = $('.shape');
	
	$('.shape-move').mouseParallax({ moveFactor: 35 });
	$('.shape-alt').mouseParallax({ moveFactor: 45 });
	
	
	$('.react').on({
		mouseenter: function(){
			$('body').addClass('reacted');
			animating = true;
			
			repos = setTimeout(function(){
				$('.shape-move, .shape-alt').velocity({
					translateY: 0,
					translateX: 0
				}, {duration: 50, queue: false, easing: 'linear'})
			}, 1000)
			
		},
		mouseleave: function(){
			$('body').removeClass('reacted');
			
			clearTimeout(repos);
			
			setTimeout(function(){
				animating = false;
			}, 2000);
		}
	});
	
	
	$('.film').on({
		mouseenter: function(){
			$('body').addClass('filmed');
			animating = true;
			
			repos = setTimeout(function(){
				$('.shape-move, .shape-alt').velocity({
					translateY: 0,
					translateX: 0
				}, {duration: 50, queue: false, easing: 'linear'})
			}, 1000);
			
		},
		mouseleave: function(){
			$('body').removeClass('filmed');
			
			clearTimeout(repos);
			
			setTimeout(function(){
				animating = false;
			}, 2000);
		}
	});
	
	//$('body').addClass('initTrans');
	
	$('h2').velocity({
		translateY: -200
	}, 0);
	
	$('h1').velocity({
		translateY: 0
	}, 0);
	
	$('form').velocity({
		translateY: 200,
		opacity: 0
	}, 0);
	
	$('.footer').on('click', function(){
		
		$('h3').velocity({
			translateX: '-200px',
			opacity: 0
		}, 800, easing);
		
		$('h1').velocity({
			translateY: 100,
			opacity: 0
		}, {duration: 800, delay: 300}, easing);

		$('h2').velocity({
			translateY: 0
		}, {duration: 800, delay: 600}, easing);

		$('.footer').addClass('is-active').velocity({
			maxHeight: 800
		}, {duration: 800, delay: 600}, easing);

		$('.close').velocity({
			opacity: 1
		}, {duration: 800, delay: 600}, easing)

		$('form').velocity({
			translateY: 0,
			opacity: 1
		}, {duration: 800, delay: 600}, easing);
	});
	
	$('.close').on('click', function(e){
		e.stopPropagation();
		
		$('h3').velocity('reverse', {duration: 800, delay: 800}, easing);
		
		$('h1').velocity('reverse', {duration: 800, delay: 300}, easing);

		$('h2').velocity('reverse', {duration: 800}, easing);

		$('.close').velocity('reverse', {duration: 800}, easing)

		$('form').velocity('reverse', {duration: 800}, easing);

		$('.footer').velocity('reverse', {duration: 800}, easing);
		
		setTimeout(function(){
			$('.footer').removeClass('is-active');
		}, 900)
	})

});

(function ( $ ) {
	$.fn.extend({
	
		mouseParallax: function(options) {
		
			var defaults = { moveFactor: 5, zIndexValue: "-1", targetContainer: 'body' };
		
			var options = $.extend(defaults, options);
		
			return this.each(function() {
				var o = options;
				var el = $(this);
				
				$(o.targetContainer).on('mousemove', function(e){
					
					console.log(animating);
					
				/*	setTimeout(function(){
						$('body').removeClass('initTrans');
					}, 600);*/
					
					mouseX = e.pageX;
					mouseY = e.pageY;
					
					windowWidth = $(window).width();
					windowHeight = $(window).height();
					
					percentX = ((mouseX/windowWidth)*o.moveFactor) - (o.moveFactor/2);
					percentY = ((mouseY/windowHeight)*o.moveFactor) - (o.moveFactor/2);
	
					leftString = (0-percentX-o.moveFactor)+"%";
					topString = (0-percentY-o.moveFactor)+"%";
					
					/*el.css({
						'transform': 'translate('+topString+', '+leftString+')' 
					})*/
					
					if (!animating) {
						el.velocity({
							translateY: topString,
							translateX: leftString
						}, {duration: 50, queue: false, easing: 'linear'})
					}
				});
			});
		}					
	});
} (jQuery) );