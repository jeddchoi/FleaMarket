function setResponsive() {
    var card = $(".card-img-top");
    var width = card.width();
    card.css('height', width);
    if($(window).width() < 992) {
        $('#nav_fixed_icon').removeClass("order-2");
    } else {
        $('#nav_fixed_icon').addClass("order-2");
    }
}

// footer position
function footerPosition() {
    var height = $("body").height();
    if(height < window.innerHeight) {
        $("footer").css({
            position: "fixed",
            height: "100px",
            bottom: "0",
            width: "100%"
        })
    } else {
        $("footer").removeAttr("style");
    }
}
 
$(window).on('load', function() {
    setResponsive();
    footerPosition();
});
 
$(window).on('resize', function() {
    setResponsive();
    footerPosition();
});

// Item Link
$(".card").click(function() {
    location.href = "#";
})

// Search Toggle
$("#search_input_box").hide();
$("#search").on("click", function () {
  $("#search_input_box").slideToggle();
  $("#search_input").focus();
});
$("#close_search").on("click", function () {
  $('#search_input_box').slideUp(500);
});

// Owl Carousel Function
var owl = $(".owl-carousel");
owl.owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    nav: false,
    center: true,
    navText: [
        '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>',
        '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>'
    ],
    responsive:{
        992:{
            nav: true
        }
    }
});

// File input
function bs_input_file() {
    $(".input-file").before(
        function () {
            if (!$(this).prev().hasClass('input-ghost')) {
                var element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0;'>");
                element.attr("name", $(this).attr("name"));
                element.change(function () {
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function () {
                    element.click();
                });
                $(this).find("button.btn-reset").click(function () {
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor", "pointer");
                $(this).find('input').mousedown(function () {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}
$(function () {
    bs_input_file();
});