var didScroll;
// on scroll, let the interval function know the user has scrolled
$(window).scroll(function(event){
  didScroll = true;
});
// run hasScrolled() and reset didScroll status
setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);
function hasScrolled() {
  if ( $(window).scrollTop() + $(".main-nav-container").height() >= $("#rev_slider").height() ) {
    $(".main-nav-container").addClass("small").css("margin-top", "-"+$(".main-nav-container .top-bar").height()+"px");
  } else {
    $(".main-nav-container").removeClass("small").css("margin-top", "0");
  }
}

$(".learn-more").click(function(){
  $('html, body').animate({
    scrollTop: $(".book-table-wrapper").offset().top
  }, 1000);
});
