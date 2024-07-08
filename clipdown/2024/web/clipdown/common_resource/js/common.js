//jQuery to collapse the navbar on scroll
var header_height = $('.navbar').height(),
    intro_height = $('.intro-section').height(),
    offset_val = intro_height + header_height;
$(window).scroll(function () {
    var scroll_top = $(window).scrollTop();
    if (scroll_top >= offset_val) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $(".navbar-fixed-top").removeClass("navbar-transparent");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $(".navbar-fixed-top").addClass("navbar-transparent");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll:not(.no-scroll)').bind('click', function (event) {
        let $anchor = $(this);
        let tagId = $anchor.attr('href').slice(1);
        $('html, body').stop().animate({
            scrollTop: $(tagId).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Scroll to Top
jQuery(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn(500);
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 300);
    });
});

// 페이지 종료 시
$(window).on('beforeunload', function () {
    $(window).scrollTop(0);
});

$(document).ready(function () {
    if ($(window).scrollTop() !== 0) {
        $(window).scrollTop(0);
    }

    /**
     * IE 브라우저 인 경우, Edge 브라우저에 현재 페이지 표시 및 현재 탭 Edge 안내 페이지 표시
     */
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        window.location = 'microsoft-edge:' + location.href;
        setTimeout(function () {
            window.location = "https://support.microsoft.com/office/160fa918-d581-4932-9e4e-1075c4713595";
        }, 1);
    }
});