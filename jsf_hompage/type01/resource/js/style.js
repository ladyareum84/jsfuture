// Favicon 브라우저 다크모드인지 쿠키값을 저장 후 php에서 구분할 수 있는 형태로 사용가능?
//(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";

$(".nav_item li").click(
  function(event) {
    $('li').removeClass('active')
    $(event.target.parentNode).addClass('active')
  }
);

// load2
let t1 = gsap.timeline();

t1.from(".imsrk", {
  opacity: 0,
  xPercent: -100,
  delay: 0.3,
  duration: 0.8,
  ease: "power1.out",
  yoyo: true,
});

t1.from(
  ".dot",
  {
    opacity: 0,
    yPercent: 100,
    delay: 0.3,
    repeatDelay: 0.8,
    duration: 0.8,
    ease: "power1.out",
  },
  0.01
);

t1.to(".dot", {
  x: 20,
  duration: 0.5,
  ease: "power1.out",
});

t1.to(".dot", {
  x: -10,
  duration: 0.4,
  ease: "power1.out",
});

t1.to(".imsrk", {
  opacity: 0,
  xPercent: -100,
  duration: 0.3,
  ease: "power1.out",
  yoyo: true,
});

t1.to(
  ".dot",
  {
    opacity: 0,
    duration: 0.5,
    ease: "expo.out",
  },
  2
);

t1.to(
  ".cover",
  {
    xPercent: -100,
    duration: 0.8,
    ease: "power1.out",
  },
  2
);

///////

t1.to(
  ".cover-2",
  {
    xPercent: -100,
    duration: 0.5,
    ease: "power1.out",
  },
  2.2
);

t1.to(
  ".cover-3",
  {
    xPercent: -100,
    duration: 0.5,
    ease: "power1.out",
  },
  2.4
);

t1.to(
  ".cover-4",
  {
    xPercent: -100,
    duration: 0.5,
    ease: "power1.out",
  },
  2.6
);

t1.from(
  ".imsrk2",
  {
    xPercent: -100,
    duration: 1,
    ease: "power1.out",
    opacity: 0,
  },
  2.8
);

// t1.from(".cover-5", {
//    xPercent: 100,
//    duration: 1,
//    ease: "power1.out",
//    delay: 0.3,
// });

t1.from(".cover-5", {
   opacity:0,
   duration: 1,
   ease: "power1.out",
   delay: 0.3,
});

// Animation
function animateFrom(elem, direction) {
  direction = direction || 1;
  var x = 0,
    y = direction * 100;
  if (elem.classList.contains("item_reveal_left")) {
    x = -100;
    y = 0;
  } else if (elem.classList.contains("item_reveal_right")) {
    x = 100;
    y = 0;
  }
  elem.style.transform = "translate(" + x + "px, " + y + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(
    elem,
    { x: x, y: y, autoAlpha: 0 },
    {
      duration: 1.25,
      x: 0,
      y: 0,
      autoAlpha: 1,
      ease: "expo",
      overwrite: "auto",
    }
  );
}

function hide(elem) {
  gsap.set(elem, { autoAlpha: 0 });
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".content_item_reveal").forEach(function (elem) {
    hide(elem); // assure that the element is hidden when scrolled into view

    ScrollTrigger.create({
      trigger: elem,
      onEnter: function () {
        animateFrom(elem);
      },
      onEnterBack: function () {
        animateFrom(elem, -1);
      },
      onLeave: function () {
        hide(elem);
      }, // assure that the element is hidden when scrolled into view
    });
  });
});

window.onload = function () {
  $(".btn_menu").click(function () {
    $(".btn_menu").toggleClass("active");
    $(".overlay").toggleClass("show");
    $("body").toggleClass("active");
  });
};

var progressPath = document.querySelector('.progress_wrap path');
		var pathLength = progressPath.getTotalLength();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
		progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		progressPath.style.strokeDashoffset = pathLength;
		progressPath.getBoundingClientRect();
		progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
		var updateProgress = function () {
			var scroll = $(window).scrollTop();
			var height = $(document).height() - $(window).height();
			var progress = pathLength - (scroll * pathLength / height);
			progressPath.style.strokeDashoffset = progress;
		}
		updateProgress();
		$(window).scroll(updateProgress);	
		var offset = 50;
		var duration = 550;
		jQuery(window).on('scroll', function() {
			if (jQuery(this).scrollTop() > offset) {
				jQuery('.progress_wrap').addClass('active');
			} else {
				jQuery('.progress_wrap').removeClass('active');
			}
		});				
		jQuery('.progress_wrap').on('click', function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
		})




