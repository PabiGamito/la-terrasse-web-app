  // var htmlDiv = document.getElementById("rs-plugin-settings-inline-css");
  // var htmlDivCss = "";
  // if (htmlDiv) {
  //   htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
  // } else {
  //   var htmlDiv = document.createElement("div");
  //   htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
  //   document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
  // }


  /******************************************
                                                                                          -	PREPARE PLACEHOLDER FOR SLIDER	-
                                                                                        ******************************************/

  // var setREVStartSize = function() {
  //   try {
  //     var e = new Object,
  //       i = jQuery(window).width(),
  //       t = 9999,
  //       r = 0,
  //       n = 0,
  //       l = 0,
  //       f = 0,
  //       s = 0,
  //       h = 0;
  //     e.c = jQuery('#rev_slider');
  //     e.gridwidth = [1240];
  //     e.gridheight = [868];
  //
  //     e.sliderLayout = "fullscreen";
  //     e.fullScreenAlignForce = 'off';
  //     e.fullScreenOffsetContainer = '.book-table-wrapper';
  //     e.fullScreenOffset = '';
  //     if (e.responsiveLevels && (jQuery.each(e.responsiveLevels, function(e, f) {
  //         f > i && (t = r = f, l = e), i > f && f > r && (r = f, n = e)
  //       }), t > r && (l = n)), f = e.gridheight[l] || e.gridheight[0] || e.gridheight, s = e.gridwidth[l] || e.gridwidth[0] || e.gridwidth, h = i / s, h = h > 1 ? 1 : h, f = Math.round(h * f), "fullscreen" == e.sliderLayout) {
  //       var u = (e.c.width(), jQuery(window).height());
  //       if (void 0 != e.fullScreenOffsetContainer) {
  //         var c = e.fullScreenOffsetContainer.split(",");
  //         if (c) jQuery.each(c, function(e, i) {
  //           u = jQuery(i).length > 0 ? u - jQuery(i).outerHeight(!0) : u
  //         }), e.fullScreenOffset.split("%").length > 1 && void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 ? u -= jQuery(window).height() * parseInt(e.fullScreenOffset, 0) / 100 : void 0 != e.fullScreenOffset && e.fullScreenOffset.length > 0 && (u -= parseInt(e.fullScreenOffset, 0))
  //       }
  //       f = u
  //     } else void 0 != e.minHeight && f < e.minHeight && (f = e.minHeight);
  //     e.c.closest(".rev_slider_wrapper").css({
  //       height: f
  //     })
  //   } catch (d) {
  //     console.log("Failure at Presize of Slider:" + d)
  //   }
  // };
  //
  //
  // setREVStartSize();

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



  // var htmlDivCss = '	#rev_slider_1_1_wrapper .tp-loader.spinner4 div { background-color: #222a2c !important; } ';
  // var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
  // if (htmlDiv) {
  //   htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
  // } else {
  //   var htmlDiv = document.createElement('div');
  //   htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
  //   document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
  // }
  //
  //
  //
  //
  //
  // var htmlDivCss = unescape(".erinyen.tparrows%20%7B%0A%20%20cursor%3Apointer%3B%0A%20%20background%3A%23000%3B%0A%20%20background%3Argba%280%2C0%2C0%2C0.5%29%3B%0A%20%20min-width%3A70px%3B%0A%20%20min-height%3A70px%3B%0A%20%20position%3Aabsolute%3B%0A%20%20display%3Ablock%3B%0A%20%20z-index%3A100%3B%0A%20%20border-radius%3A35px%3B%20%20%20%0A%7D%0A%0A.erinyen.tparrows%3Abefore%20%7B%0A%20%20font-family%3A%20%22revicons%22%3B%0A%20%20font-size%3A20px%3B%0A%20%20color%3A%23fff%3B%0A%20%20display%3Ablock%3B%0A%20%20line-height%3A%2070px%3B%0A%20%20text-align%3A%20center%3B%20%20%20%20%0A%20%20z-index%3A2%3B%0A%20%20position%3Arelative%3B%0A%7D%0A.erinyen.tparrows.tp-leftarrow%3Abefore%20%7B%0A%20%20content%3A%20%22%5Ce824%22%3B%0A%7D%0A.erinyen.tparrows.tp-rightarrow%3Abefore%20%7B%0A%20%20content%3A%20%22%5Ce825%22%3B%0A%7D%0A%0A.erinyen%20.tp-title-wrap%20%7B%20%0A%20%20position%3Aabsolute%3B%0A%20%20z-index%3A1%3B%0A%20%20display%3Ainline-block%3B%0A%20%20background%3A%23000%3B%0A%20%20background%3Argba%280%2C0%2C0%2C0.5%29%3B%0A%20%20min-height%3A70px%3B%0A%20%20line-height%3A70px%3B%0A%20%20top%3A0px%3B%0A%20%20margin-left%3A0px%3B%0A%20%20border-radius%3A35px%3B%0A%20%20overflow%3Ahidden%3B%20%0A%20%20transition%3A%20opacity%200.3s%3B%0A%20%20-webkit-transition%3Aopacity%200.3s%3B%0A%20%20-moz-transition%3Aopacity%200.3s%3B%0A%20%20-webkit-transform%3A%20scale%280%29%3B%0A%20%20-moz-transform%3A%20scale%280%29%3B%0A%20%20transform%3A%20scale%280%29%3B%20%20%0A%20%20visibility%3Ahidden%3B%0A%20%20opacity%3A0%3B%0A%7D%0A%0A.erinyen.tparrows%3Ahover%20.tp-title-wrap%7B%0A%20%20-webkit-transform%3A%20scale%281%29%3B%0A%20%20-moz-transform%3A%20scale%281%29%3B%0A%20%20transform%3A%20scale%281%29%3B%0A%20%20opacity%3A1%3B%0A%20%20visibility%3Avisible%3B%0A%7D%0A%20%20%20%20%20%20%20%20%0A%20.erinyen.tp-rightarrow%20.tp-title-wrap%20%7B%20%0A%20%20%20right%3A0px%3B%0A%20%20%20margin-right%3A0px%3Bmargin-left%3A0px%3B%0A%20%20%20-webkit-transform-origin%3A100%25%2050%25%3B%0A%20%20border-radius%3A35px%3B%0A%20%20padding-right%3A20px%3B%0A%20%20padding-left%3A10px%3B%0A%20%7D%0A%0A%0A.erinyen.tp-leftarrow%20.tp-title-wrap%20%7B%20%0A%20%20%20padding-left%3A20px%3B%0A%20%20padding-right%3A10px%3B%0A%7D%0A%0A.erinyen%20.tp-arr-titleholder%20%7B%0A%20%20letter-spacing%3A%203px%3B%0A%20%20%20position%3Arelative%3B%0A%20%20-webkit-transition%3A%20-webkit-transform%200.3s%3B%0A%20%20transition%3A%20transform%200.3s%3B%0A%20%20transform%3AtranslateX%28200px%29%3B%20%20%0A%20%20text-transform%3Auppercase%3B%0A%20%20color%3A%23fff%3B%0A%20%20font-weight%3A600%3B%0A%20%20font-size%3A13px%3B%0A%20%20line-height%3A70px%3B%0A%20%20white-space%3Anowrap%3B%0A%20%20padding%3A0px%2020px%3B%0A%20%20margin-left%3A11px%3B%0A%20%20opacity%3A0%3B%20%20%0A%7D%0A%0A.erinyen%20.tp-arr-imgholder%20%7B%0A%20%20width%3A100%25%3B%0A%20%20height%3A100%25%3B%0A%20%20position%3Aabsolute%3B%0A%20%20top%3A0px%3B%0A%20%20left%3A0px%3B%0A%20%20background-position%3Acenter%20center%3B%0A%20%20background-size%3Acover%3B%0A%20%20%20%20%7D%0A%20.erinyen%20.tp-arr-img-over%20%7B%0A%20%20%20width%3A100%25%3B%0A%20%20height%3A100%25%3B%0A%20%20position%3Aabsolute%3B%0A%20%20top%3A0px%3B%0A%20%20left%3A0px%3B%0A%20%20%20background%3A%23000%3B%0A%20%20%20background%3Argba%280%2C0%2C0%2C0.5%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A.erinyen.tp-rightarrow%20.tp-arr-titleholder%20%7B%0A%20%20%20transform%3AtranslateX%28-200px%29%3B%20%0A%20%20%20margin-left%3A0px%3B%20margin-right%3A11px%3B%0A%20%20%20%20%20%20%7D%0A%0A.erinyen.tparrows%3Ahover%20.tp-arr-titleholder%20%7B%0A%20%20%20transform%3AtranslateX%280px%29%3B%0A%20%20%20-webkit-transform%3AtranslateX%280px%29%3B%0A%20%20transition-delay%3A%200.1s%3B%0A%20%20opacity%3A1%3B%0A%7D%0A");
  // var htmlDiv = document.getElementById('rs-plugin-settings-inline-css');
  // if (htmlDiv) {
  //   htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
  // } else {
  //   var htmlDiv = document.createElement('div');
  //   htmlDiv.innerHTML = '<style>' + htmlDivCss + '</style>';
  //   document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[0]);
  // }
