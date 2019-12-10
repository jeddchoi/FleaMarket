var width;
var card = $(".card-img-top");

function setResponsive() {
    width = card.width();
    card.css('height', width);
    if($(window).width() < 992) {
        $('#nav_fixed_icon').removeClass("order-2");
        $('.nav-margin').addClass("w-25");
    } else {
        $('#nav_fixed_icon').addClass("order-2");
        $('.nav-margin').removeClass("w-25");
    }
}
 
$(window).on('load', function() {
    setResponsive();
});
 
$(window).on('resize', function() {
    setResponsive();
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