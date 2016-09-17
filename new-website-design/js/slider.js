function revslider_showDoubleJqueryError(sliderID) {
  var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
  errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
  errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
  errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
  errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>"
  jQuery(sliderID).show().html(errorMessage);
}
var tpj = jQuery;

var revapi1;
tpj(document).ready(function() {
  if (tpj("#rev_slider").revolution == undefined) {
    revslider_showDoubleJqueryError("#rev_slider");
  } else {
    revapi1 = tpj("#rev_slider").show().revolution({
      sliderType: "standard",
      jsFileLocation: "http://gustave2.gourmetwp.staging.wpengine.com/wp-content/plugins/revslider/public/assets/js/",
      sliderLayout: "fullscreen",
      dottedOverlay: "none",
      delay: 9000,
      navigation: {
        keyboardNavigation: "off",
        keyboard_direction: "horizontal",
        mouseScrollNavigation: "off",
        onHoverStop: "off",
        touch: {
          touchenabled: "on",
          swipe_threshold: 75,
          swipe_min_touches: 50,
          swipe_direction: "horizontal",
          drag_block_vertical: false
        },
        arrows: {
          style: "erinyen",
          enable: true,
          hide_onmobile: false,
          hide_onleave: false,
          tmp: '<div class="tp-title-wrap">  	<div class="tp-arr-imgholder"></div>    <div class="tp-arr-img-over"></div>	<span class="tp-arr-titleholder">{{title}}</span> </div>',
          left: {
            h_align: "left",
            v_align: "center",
            h_offset: 20,
            v_offset: 0
          },
          right: {
            h_align: "right",
            v_align: "center",
            h_offset: 20,
            v_offset: 0
          }
        }
      },
      gridwidth: 1240,
      gridheight: 868,
      lazyType: "none",
      parallax: {
        type: "scroll",
        origo: "enterpoint",
        speed: 400,
        levels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      },
      shadow: 0,
      spinner: "spinner4",
      stopLoop: "off",
      stopAfterLoops: -1,
      stopAtSlide: -1,
      shuffle: "off",
      autoHeight: "off",
      fullScreenAlignForce: "off",
      fullScreenOffsetContainer: ".book-table-wrapper",
      fullScreenOffset: "",
      disableProgressBar: "on",
      hideThumbsOnMobile: "off",
      hideSliderAtLimit: 0,
      hideCaptionAtLimit: 0,
      hideAllCaptionAtLilmit: 0,
      startWithSlide: 0,
      debugMode: false,
      fallbacks: {
        simplifyAll: "off",
        nextSlideOnWindowFocus: "off",
        disableFocusListener: false,
      }
    });
  }
}); /*ready*/
