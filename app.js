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



    function equalizeSides() {
        const $left = $('.side.left');
        const $right = $('.side.right');

        // Reset height to auto before recalculating
        $left.height('auto');
        $right.height('auto');

        const maxHeight = Math.max($left.outerHeight(), $right.outerHeight());

        $left.height(maxHeight);
        $right.height(maxHeight);
    }

    // Run on load and resize
    equalizeSides();
    $(window).on('resize', equalizeSides);



    let currentStep = 1;
    const totalSteps = $(".donation-step").length;

    function updateStep(step) {
        $(".donation-step").addClass("hidden").eq(step - 1).removeClass("hidden");

        const percent = (step / totalSteps) * 100;
        $("#progress-fill").css("width", percent + "%");
        $("#progress-label").text(`Step ${step} of ${totalSteps}`);

        // Smooth scroll into view
        $('html, body').animate({
            scrollTop: $("#donate-form").offset().top - 100
        }, 600);
    }

    $(".next-step").on("click", function () {
        const $stepContainer = $(".donation-step").eq(currentStep - 1);
        let valid = true;
    
        // Validate required fields
        $stepContainer.find("input[required], textarea[required], select[required]").each(function () {
            if (!$(this).val().trim()) {
                $(this).addClass("border-red-500");
                valid = false;
            } else {
                $(this).removeClass("border-red-500");
            }
        });
    
        // Step 1 specific: validate amount
        if (currentStep === 1) {
            const amount = $("#donation-amount").val();
            const custom = $("#custom-amount").val();
    
            if (amount === "other" && (!custom || parseFloat(custom) <= 0)) {
                $("#amount-error").removeClass("hidden");
                $("#custom-amount").addClass("border-red-500").focus();
                valid = false;
            } else {
                $("#amount-error").addClass("hidden");
                $("#custom-amount").removeClass("border-red-500");
            }
        }
    
        if (!valid) return;
    
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
        }
    });
    

    $("#donation-amount").on("change", function () {
        if ($(this).val() === "other") {
            $("#custom-amount").removeClass("hidden").focus();
        } else {
            $("#custom-amount").addClass("hidden").val(""); // reset if not used
        }
    });

    $("#custom-amount").on("input", function () {
        if ($(this).val() > 0) {
            $("#amount-error").addClass("hidden");
            $(this).removeClass("border-red-500");
        }
    });

    $("#donation-form").on("submit", function (e) {
        e.preventDefault();

        const selectedAmount = $("#donation-amount").val();
        const customAmount = $("#custom-amount").val();
        const paymentMethod = $("input[name='payment_method']:checked").val();

        // Hide error initially
        $("#amount-error").addClass("hidden");

        if (selectedAmount === "other") {
            if (!customAmount || parseFloat(customAmount) <= 0) {
                $("#amount-error").removeClass("hidden");
                $("#custom-amount").addClass("border-red-500");
                return;
            } else {
                $("#custom-amount").removeClass("border-red-500");
            }
        }

        // Ensure payment method is selected
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // Proceed if valid
        const $btn = $(this).find("button[type='submit']");
        $btn.prop("disabled", true).html(
            `<svg class="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"></circle>
                <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
             </svg> Processing...`
        );

        // Simulate submission (e.g., after a successful API call or form submission)
        setTimeout(() => {
            // Reset form
            $("#donation-form")[0].reset();
            $("#custom-amount").addClass("hidden");
            $("#amount-error").addClass("hidden");
            currentStep = 1;
            updateStep(currentStep);

            // Show success modal
            $("#success-modal").removeClass("hidden");

            // Show the "Start Over" button
            $("#start-over-form").removeClass("hidden");

            // Reset button state
            $btn.prop("disabled", false).html("Donate Now");
        }, 2000);
    });

    // Close success modal
    $("#close-modal").on("click", function () {
        $("#success-modal").addClass("hidden");
        $("#start-over-form").addClass("hidden");  // Hide the start-over button when closing the modal
    });

    // Start Over functionality
    $("#start-over-form").on("click", function () {
        // Reset everything
        $("#donation-form")[0].reset();
        $("#custom-amount").addClass("hidden");
        $("#amount-error").addClass("hidden");
        currentStep = 1;
        updateStep(currentStep);

        // Hide success modal and "Start Over" button
        $("#success-modal").addClass("hidden");
        $(this).addClass("hidden");
    });

    updateStep(currentStep); // Init




});
