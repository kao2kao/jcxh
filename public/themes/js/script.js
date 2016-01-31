$(document).ready(function(){
	
	"use strict";
	
	
	/* Global Variables */
	
	var window_w = $(window).width(); // Window Width
	var window_h = $(window).height(); // Window Height
	var window_s = $(window).scrollTop(); // Window Scroll Top
	
	var $html = $('html'); // HTML
	var $body = $('body'); // Body 
	var $header = $('#header');	// Header 
	var $footer = $('#footer');	// Footer
	
	
	// On Resize
	$(window).resize(function(){
		
		window_w = $(window).width();
		window_h = $(window).height();
		window_s = $(window).scrollTop();
		
	});
	
	// On Scroll
	$(window).scroll(function(){
	
		window_s = $(window).scrollTop();
		
	});
	
	
	/* Modernizr Fix */
	
	var supportPerspective = Modernizr.testAllProps('perspective');
	if(supportPerspective)
		$html.addClass('csstransforms3d');
	else
		$html.addClass('notcsstransforms3d');
	
	
	
	
	
	/* Main Functions */
	
	
	/* Layout Options */
	
	enableStickyHeader(); // Sticky Header 
	
	enableFullWidth(); // Full Width Section
	
	enableTooltips(); // Tooltips
	
	enableContentAnimation(); // Content Animation
	
	enableSpecialCssEffects(); // CSS Animations
	
	enableBackToTop(); // Back to top button
	
	enableMobileNav(); // Mobile Navigation
	
	/* Sliders */
	
	enableFlexSlider(); // FlexSlider
	
	enableOwlCarousel(); // Owl Carousel
	
	//enableRevolutionSlider(); // Revolution Slider
	

	/* ============================== */
	/* 			FUNCTIONS		      */
	/* ============================== */
	
	
	
	/* Sticky Header */
	function enableStickyHeader(){
		
		var stickyHeader = $body.hasClass('sticky-header-on');
		
		var resolution = 991;
		if($body.hasClass('tablet-sticky-header'))
			resolution = 767
		
		if(stickyHeader && window_w > resolution){
			$header.addClass('sticky-header');
			var header_height = $header.innerHeight();
			$body.css('padding-top', header_height+'px');
		}
		
		$(window).scroll(function(){
			animateHeader();
		});
		
		$(window).resize(function(){
		
			animateHeader();
			
			if(window_w < resolution){
			
				$header.removeClass('sticky-header').removeClass('animate-header');
				$body.css('padding-top', 0+'px');
				
			}else{
				
				$header.addClass('sticky-header');
				var header_height = $header.innerHeight();
				$body.css('padding-top', header_height+'px');
				
			}
			
		});
		
		function animateHeader(){
			
			if(window_s>100){
				
				$('#header.sticky-header').addClass('animate-header');
				
			}else{
				
				$('#header.sticky-header').removeClass('animate-header');
				
			}
			
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	function enableFullWidth(){
		
		// Full Width Elements
		var $fullwidth_el = $('.full-width, .full-width-slider');
		
		
		// Set Full Width on resize
		$(window).resize(function(){
			
			setFullWidth();
			
		});
		
		// Fix Full Width at Window Load
		$(window).load(function(){
			
			setFullWidth();
			
		});
		
		// Set Full Width Function
		function setFullWidth(){
			
			$fullwidth_el.each(function(){
		
				var element = $(this);
				
				// Reset Styles
				element.css('margin-left', '');
				element.css('width', '');	
				
				
				if(!$body.hasClass('boxed-layout')){
					
					var element_x = element.offset().left;
					
					// Set New Styles
					element.css('margin-left', -element_x+'px');
					element.css('width', window_w+'px');	
				
				}
				
			});
			
		}
		
	}
	
	

	/* Flex Slider */
	function enableFlexSlider(){
		
		
		// Main Flexslider
		$('.main-flexslider').flexslider({
			animation: "slide",
			slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"图片设置为滑动式时的滑动方向：左右或者上下
			slideshow: true,                //Boolean: Animate slider automatically 载入页面时，是否自动播放
			slideshowSpeed: 4000,           //Integer: Set the speed of the slideshow cycling, in milliseconds 自动播放速度毫秒
			animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds动画淡入淡出效果延时
			directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)是否显示左右控制按钮
			controlNav: true,
			prevText: "上一页",
			nextText: "下一页"
		});
		
		
		
		
		// Banner Rotator
		$('.banner-rotator-flexslider').flexslider({
			animation: "slide",
			controlNav: true,
			directionNav: false,
			prevText: "",           
			nextText: "", 
		});
		
		
		
		// Portfolio Slideshow
		$('.portfolio-slideshow').flexslider({
			animation: "fade",
			controlNav: false,
			slideshowSpeed: 4000,
			prevText: "",           
			nextText: "", 
		});
		
	}
	
	

	/* Owl Carousel */
	function enableOwlCarousel(){
		
		$('.owl-carousel').each(function(){
		
			/* Number Of Items */
			var max_items = $(this).attr('data-max-items');
			var tablet_items = max_items;
			if(max_items > 1){
				tablet_items = max_items - 1;
			}
			var mobile_items = 1;
			
			
			/* Initialize */
			$(this).owlCarousel({
				items:max_items,
				pagination : false,
				itemsDesktop : [1600,max_items],
				itemsDesktopSmall : [1170,max_items],
				itemsTablet: [991,tablet_items],
				itemsMobile: [767,mobile_items],
				slideSpeed:400
			});
		
			
			var owl = $(this).data('owlCarousel');
			
			// Left Arrow
			$(this).parent().find('.carousel-arrows span.left-arrow').click(function(e){
				owl.prev();
			});
			
			// Right Arrow
			$(this).parent().find('.carousel-arrows span.right-arrow').click(function(e){
				owl.next(); 
			});
			
		});
		
		
	}
	
	
	
	
	
	/* Tooltips */
	function enableTooltips(){
		
		// Tooltip on TOP
		$('.tooltip-ontop').tooltip({
			placement: 'top'
		});
		
		// Tooltip on BOTTOM
		$('.tooltip-onbottom').tooltip({
			placement: 'bottom'
		});
		
		// Tooltip on LEFT
		$('.tooltip-onleft').tooltip({
			placement: 'left'
		});
		
		// Tooltip on RIGHT
		$('.tooltip-onright').tooltip({
			placement: 'right'
		});
		
	}
	
	
	/* Content Animation */
	function enableContentAnimation(){
		
		if($html.hasClass('cssanimations')){
		
			$('.animate-onscroll').animate({opacity:0},0);
			
			
			$(window).load(function(){
				
				$('.animate-onscroll').filter(function(index){
					
					return this.offsetTop < (window_s + window_h);
					
				}).each(function(index, value){
					
					var el = $(this);
					var el_y = $(this).offset().top;
					
					if((window_s) > el_y){
						$(el).addClass('animated fadeInDown').removeClass('animate-onscroll').removeClass('animated fadeInDown');
					}
					
				});
				
				animateOnScroll();
				
			});
			
			$(window).resize(function(){
				animateOnScroll();
			});
			
			$(window).scroll(function(){
				animateOnScroll();
			});
		
		}
		
		// Start Animation When Element is scrolled
		function animateOnScroll(){
			
			$('.animate-onscroll').filter(function(index){
					
				return this.offsetTop < (window_s + window_h);
				
			}).each(function(index, value){
				
				var el = $(this);
				var el_y = $(this).offset().top;
				
				if((window_s + window_h) > el_y){
				
					setTimeout(function(){
					
						$(el).addClass('animated fadeInDown');
						
						setTimeout(function(){
							$(el).removeClass('animate-onscroll');
						}, 500);
						
						setTimeout(function(){
							$(el).css('opacity','1').removeClass('animated fadeInDown');
						},2000);
						
					},index*200);
					
				}
				
			});
			
		}
		
	}
	
	
	
	
	
	
	
	/* Special CSS Effects */
	function enableSpecialCssEffects(){
		
		/* Sidebar Banner Hover Effect */
		$('.banner').each(function(){
			
			var new_icon = $(this).find('.icons').clone().addClass('icons-fadeout');
			$(this).prepend($(new_icon));
			
		});
		
		
		/* Firefox Pricing Tables Height Fix */
		$(window).load(function(){
			fixPricingTables();
		});
		
		$(window).resize(function(){
			fixPricingTables();
		});
		
		/* Fix Pricing Tables */
		function fixPricingTables(){
			
			$('.pricing-tables').each(function(){
				
				$(this).find('.pricing-table').attr('style', '');
				
				if(window_w > 767){
					var pricing_tables_h = $(this).height();
					$(this).find('.pricing-table').innerHeight(pricing_tables_h);
				}
				
			});
			
		}
		
		
		
		/* Sorting Float Fix */
		
		$(window).load(function(){
			mediaSortFix();
		});
		
		$(window).resize(function(){
			mediaSortFix();
		});
		
		function mediaSortFix(){
			if(window_w > 767){
				var media_item_height = 0;
				$('.media-items .mix').css('height','');
				
				$('.media-items .mix').each(function(){
					if($(this).height() > media_item_height)
						media_item_height = $(this).height();
				});
				$('.media-items .mix').height(media_item_height);
			}else{
				$('.media-items .mix').css('height','');
			}
		}
		
	}
	
	
	
	
	
	
	
	/* Back To Top Button */
	function enableBackToTop(){
		
		$('#button-to-top').hide();
		
		/* Show/Hide button */
		$(window).scroll(function(){
			
			if(window_s > 100 && window_w > 991){
				$('#button-to-top').fadeIn(300);
			}else{
				$('#button-to-top').fadeOut(300);
			}
			
		});
		
		$('#button-to-top').click(function(e){
			
			e.preventDefault();
			$('body,html').animate({scrollTop:0}, 600);
			
		});
		
	}
	
	
	
	
	
	
	/* Mobile Navigation */
	function enableMobileNav(){
		
		/* Menu Button */
		$('#menu-button').click(function(){
			
			if(!$('#navigation').hasClass('navigation-opened')){
				
				$('#navigation').slideDown(500).addClass('navigation-opened');
				
			}else{
				
				$('#navigation').slideUp(500).removeClass('navigation-opened');
				
			}
			
		});
		
		
		/* On Resize */
		$(window).resize(function(){
			
			if(window_w > 991){
				
				$('#navigation').show().attr('style','').removeClass('navigation-opened');
				
			}
			
		});
		
		
		/* Dropdowns */
		$('#navigation li').each(function(){
			
			if($(this).find('ul').length > 0){
				$(this).append('<div class="dropdown-button"></div>');
			}
			
		});
		
		$('#navigation .dropdown-button').click(function(){
			
			$(this).parent().toggleClass('dropdown-opened').find('>ul').slideToggle(300);
			
		});
		
		
	}
	

});
