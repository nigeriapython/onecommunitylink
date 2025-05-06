$(document).ready(function () {

    // === MOBILE MENU TOGGLE ===
    $('#menu-toggle').on('click', function () {
        $('#mobile-menu').slideToggle('fast');
    });

    $(window).on('resize', function () {
        if ($(window).width() >= 768) {
            $('#mobile-menu').hide();
        }
    });

    // === DROPDOWN MENU ===
    $('.has-dropdown > .dropdown-toggle, .has-dropdown > button').on('click', function (e) {
        e.preventDefault();
        const $currentMenu = $(this).siblings('.dropdown-menu');
        $('.dropdown-menu').not($currentMenu).slideUp(200);
        $currentMenu.stop(true, true).slideToggle(200);
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.has-dropdown').length) {
            $('.dropdown-menu').slideUp(200);
        }
    });

    // === CAROUSEL ===
    const $track = $('#carousel-track');
    const $slides = $track.children();
    const slideWidth = $slides.outerWidth(true);
    let position = 0;
    let autoSlide;

    // Clone slides for seamless loop
    $slides.clone().appendTo($track);

    function moveNext() {
        position++;
        $track.css('transform', `translateX(${-position * slideWidth}px)`);

        if (position >= $slides.length) {
            setTimeout(() => {
                $track.css('transition', 'none');
                position = 0;
                $track.css('transform', 'translateX(0)');
                setTimeout(() => {
                    $track.css('transition', 'transform 0.7s ease-in-out');
                }, 50);
            }, 700);
        }
    }

    function movePrev() {
        if (position === 0) {
            $track.css('transition', 'none');
            position = $slides.length;
            $track.css('transform', `translateX(${-position * slideWidth}px)`);
            setTimeout(() => {
                $track.css('transition', 'transform 0.7s ease-in-out');
                position--;
                $track.css('transform', `translateX(${-position * slideWidth}px)`);
            }, 50);
        } else {
            position--;
            $track.css('transform', `translateX(${-position * slideWidth}px)`);
        }
    }

    $('#next').on('click', moveNext);
    $('#prev').on('click', movePrev);

    function startAutoSlide() {
        autoSlide = setInterval(moveNext, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    $('#carousel-wrapper').hover(stopAutoSlide, startAutoSlide);
    startAutoSlide();

    // === TOUCH SWIPE SUPPORT ===
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        let touchStartX = 0;

        $('#carousel-wrapper')
            .on('touchstart', function (e) {
                touchStartX = e.originalEvent.changedTouches[0].screenX;
            })
            .on('touchend', function (e) {
                const touchEndX = e.originalEvent.changedTouches[0].screenX;
                const swipeThreshold = 50;

                if (touchEndX < touchStartX - swipeThreshold) {
                    moveNext();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    movePrev();
                }
            });
    }

    // === SCROLL ANIMATIONS ===
    function animateOnScroll() {
        $('.service-card').each(function () {
            const elemTop = $(this).offset().top;
            const winBottom = $(window).scrollTop() + $(window).height();

            if (winBottom > elemTop + 50) {
                $(this).addClass('opacity-100 translate-y-0');
            }
        });
    }

    animateOnScroll();
    $(window).on('scroll resize', animateOnScroll);

    // === IMPACT COUNTER ===
    const $counter = $('#impact-counter');
    if ($counter.length) {
        let count = 0;
        const target = 15000;
        const speed = 20;

        function updateCounter() {
            count += Math.ceil(target / 100);
            if (count >= target) {
                $counter.text(target.toLocaleString());
            } else {
                $counter.text(count.toLocaleString());
                setTimeout(updateCounter, speed);
            }
        }

        updateCounter();
    }

    // === SWIPER INITIALIZATION ===
    if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // === TYPING EFFECT ===
    const text = "Empowering Communities, Transforming Futures..";
    let i = 0;
    const typingSpeed = 50;

    function typeWriter() {
        if (i < text.length) {
            $('#headline').append(text.charAt(i));
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    typeWriter();

});
