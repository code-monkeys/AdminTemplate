if (typeof jQuery === "undefined") {
  throw new Error("AdminLTE requires jQuery");
}

$.AdminLTE = {};

$.AdminLTE.options = {
	//General animation speed for JS animated elements such as box collapse/expand and
	//sidebar treeview slide up/down. This options accepts an integer as milliseconds,
	//'fast', 'normal', or 'slow'
	animationSpeed: 500,
	//Sidebar push menu toggle button selector
  	sidebarToggleSelector: "[data-toggle='offcanvas']",
  	//Activate sidebar push menu
  	sidebarPushMenu: true,
	//Enable sidebar expand on hover effect for sidebar mini
	//This option is forced to true if both the fixed layout and sidebar mini
	//are used together
	sidebarExpandOnHover: false,
	//Control Sidebar Tree views
	enableControlTreeView: true,
	//Control Sidebar Options
	enableControlSidebar: true,
	controlSidebarOptions: {
		//Which button should trigger the open/close event
		toggleBtnSelector: "[data-toggle='control-sidebar']",
		//The sidebar selector
		selector: ".control-sidebar",
		//Enable slide over content
		slide: true
	},
	//The standard screen sizes that bootstrap uses.
	//If you change these in the variables.less file, change
	//them here too.
	screenSizes: {
		xs: 480,
		sm: 768,
		md: 992,
		lg: 1200
	}
};

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {

  //Extend options if external options exist
  if (typeof AdminLTEOptions !== "undefined") {
    $.extend(true,
      $.AdminLTE.options,
      AdminLTEOptions);
  }

  //Easy access to options
  var o = $.AdminLTE.options;

  //Set up the object
  _init();


	var $lis = $('.sidebar li.active');
	for(var j=0; j<$lis.length; j++){
		var $plis = $($lis[j]).parentsUntil(".sidebar-menu");
	  var endli = false;
	  for(var i=0; i<$plis.length; i++){
	  	if( $plis[i].nodeName === "UL" ){
	  		$($plis[i]).addClass("menu-open");
	  		$($plis[i]).css({"display":"block"});
	  	}else if($plis[i].nodeName === "LI"){
	  		$($plis[i]).addClass("active");
	  	}
	  }
	}

  //Activate the layout maker
  $.AdminLTE.layout.activate();

  //Enable sidebar tree view controls
  if (o.enableControlTreeView) {
    $.AdminLTE.tree('.sidebar');
  }
  //Activate sidebar push menu
  if (o.sidebarPushMenu) {
    $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
  }
/*
  var lis = $('li.active.menu-open').parents("li");
  var endli = false;
  for(var i=0; i<lis.length; i++){
  	if( !endli ){
  		$(lis[i]).addClass("active").addClass("menu-open") ;
  	}else{
  		break;
  	}
  	endli = $(lis[i]).hasClass("treeview") ? true : false;
  }
  */
  //$lis是jquery对象, $lis[i]不是
  /*
  var $lis = $('li.active.menu-open');
  for(var j=0; j<$lis.length; j++){
  	  var $plis = $($lis[j]).parents("li");
	  var endli = false;
	  for(var i=0; i<$plis.length; i++){
	  	if( !endli ){
	  		$($plis[i]).addClass("active") ;
	  	}else{
	  		break;
	  	}
	  	endli = $($plis[i]).hasClass("treeview") ? true : false;
	  }
  }
  
  var $lis = $('.sidebar li.active');
  for(var j=0; j<$lis.length; j++){
  	  var $plis = $($lis[j]).parentsUntil(".sidebar-menu");
	  var endli = false;
	  for(var i=0; i<$plis.length; i++){
	  	if( $plis[i].nodeName === "UL" ){
	  		$($plis[i]).addClass("menu-open");
	  		$($plis[i]).css({"display":"block"});
	  	}else if($plis[i].nodeName === "LI"){
	  		$($plis[i]).addClass("active");
	  	}
	  }
  }
  */
});


/* ----------------------------------
 * - Initialize the AdminLTE Object -
 * ----------------------------------
 * All AdminLTE functions are implemented below.
 */
function _init() {
  'use strict';

  /* Layout
   * ======
   * Fixes the layout height in case min-height fails.
   *
   * @type Object
   * @usage $.AdminLTE.layout.activate()
   *        $.AdminLTE.layout.fix()
   *        $.AdminLTE.layout.fixSidebar()
   */
  $.AdminLTE.layout = {
    activate: function () {
      var _this = this;
      _this.fix();
      _this.fixSidebar();
      _this.fixNavbar();
      //$('body, html, .wrapper').css('height', 'auto');

      //$(".main-sidebar").css("min-height","100%");

      $(window).resize(function () {
        _this.fix();
        _this.fixSidebar();
        _this.fixNavbar();
      });
    },
    fixNavbar : function(){
      var win_width = $("nav.navbar").innerWidth();
      if( win_width > 768){
        var navbarcollapse_width = $(".collapse.navbar-collapse").width();
        var navbarheader_width = $(".navbar-header").width();
        var navbar_custom_menu_width = $(".navbar-custom-menu").width();
        var max_collapse_width = win_width-navbarheader_width-navbar_custom_menu_width-50;
        if(max_collapse_width < navbarcollapse_width){
          //$(".collapse.navbar-collapse").attr({"style":"display:none;"});
          //$(".navbarnav-toggle").attr({"style":"display:block;"});
          //$(".collapse.navbar-collapse").attr({"style":"overflow: auto  !important;"+"width: "+(max_collapse_width)+"px;"});
          //$(".collapse.navbar-collapse > .nav").attr({"style":"width:1000px;"})
        }else{
          //$(".collapse.navbar-collapse").attr({"style":""});
          //$(".collapse.navbar-collapse > .nav").attr({"style":""});
        }
      }
    },
    fix: function () {
      // Remove overflow from .wrapper if layout-boxed exists
      $(".layout-boxed > .wrapper").css('overflow', 'hidden');
      //Get window height and the wrapper height
      var footer_height = $('.main-footer').outerHeight() || 0;
      var neg = $('.navbar').outerHeight() + footer_height;
      var window_height = $(window).height();
      var sidebar_height = $(".sidebar").height()+$('.navbar').outerHeight() || 0;
      //Set the min-height of the content and sidebar based on the
      //the height of the document.
      if ($("body").hasClass("fixed")) {
        $(".content-wrapper, .right-side").css('min-height', window_height - footer_height);
      } else {
        var postSetWidth;
        if (window_height >= sidebar_height) {
          $(".content-wrapper, .right-side").css('min-height', window_height - neg);
          postSetWidth = window_height - neg;
        } else {
          $(".content-wrapper, .right-side").css('min-height', sidebar_height);
          postSetWidth = sidebar_height;
        }

        //Fix for the control sidebar height
        var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
        if (typeof controlSidebar !== "undefined") {
          if (controlSidebar.height() > postSetWidth)
            $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
        }

      }
    },
    fixSidebar: function () {
      //Make sure the body tag has the .fixed class
      if (!$("body").hasClass("fixed")) {
        if (typeof $.fn.slimScroll != 'undefined') {
          $(".sidebar").slimScroll({destroy: true}).height("auto");
        }
        return;
      } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
        window.console.error("Error: the fixed layout requires the slimscroll plugin!");
      }
      //Enable slimscroll for fixed layout
      if ($.AdminLTE.options.sidebarSlimScroll) {
        if (typeof $.fn.slimScroll != 'undefined') {
          //Destroy if it exists
          $(".sidebar").slimScroll({destroy: true}).height("auto");
          //Add slimscroll
          $(".sidebar").slimScroll({
            height: ($(window).height() - $(".navbar").height()) + "px",
            color: "rgba(0,0,0,0.2)",
            size: "3px"
          });
        }
      }
    }
  };

  /* PushMenu()
   * ==========
   * Adds the push menu functionality to the sidebar.
   *
   * @type Function
   * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
   */
  $.AdminLTE.pushMenu = {
    activate: function (toggleBtn) {
      //Get the screen sizes
      var screenSizes = $.AdminLTE.options.screenSizes;

      //Enable sidebar toggle
      $(document).on('click', toggleBtn, function (e) {
        e.preventDefault();

        //Enable sidebar push menu
        if ($(window).width() > (screenSizes.sm - 1)) {
          if ($("body").hasClass('sidebar-collapse')) { //展开sidebar
            $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
          } else { //关闭sidebar
            $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
          }
        }
        //Handle sidebar push menu for small screens
        else {
          if ($("body").hasClass('sidebar-open')) { //关闭sidebar
            $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
          } else { //展开sidebar
            $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
          }
        }
      });

      $(".content-wrapper").click(function () {
        //Enable hide menu when clicking on the content-wrapper on small screens
        if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
          $("body").removeClass('sidebar-open');
        }
      });

      //Enable expand on hover for sidebar mini
      if ($.AdminLTE.options.sidebarExpandOnHover
        || ($('body').hasClass('fixed')
        && $('body').hasClass('sidebar-mini'))) {
        this.expandOnHover();
      }
    },
    expandOnHover: function () {
      var _this = this;
      var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
      //Expand sidebar on hover
      $('.main-sidebar').hover(function () {
        if ($('body').hasClass('sidebar-mini')
          && $("body").hasClass('sidebar-collapse')
          && $(window).width() > screenWidth) {
          _this.expand();
        }
      }, function () {
        if ($('body').hasClass('sidebar-mini')
          && $('body').hasClass('sidebar-expanded-on-hover')
          && $(window).width() > screenWidth) {
          _this.collapse();
        }
      });
    },
    expand: function () {
      $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
    },
    collapse: function () {
      if ($('body').hasClass('sidebar-expanded-on-hover')) {
        $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
      }
    }
  };

  /* Tree()
   * ======
   * Converts the sidebar into a multilevel
   * tree view menu.
   *
   * @type Function
   * @Usage: $.AdminLTE.tree('.sidebar')
   */
  $.AdminLTE.tree = function (menu) {
    var _this = this;
    var animationSpeed = $.AdminLTE.options.animationSpeed;
    $(document).off('click', menu + ' li a')
      .on('click', menu + ' li a', function (e) {
        //Get the clicked link and the next element
        var $this = $(this);
        var checkElement = $this.next();

        //Check if the next element is a menu and is visible
        if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
          //Close the menu
          checkElement.slideUp(animationSpeed, function () {
            checkElement.removeClass('menu-open');
            //Fix the layout in case the sidebar stretches over the height of the window
            _this.layout.fix();
          });
          checkElement.parent("li").removeClass("active");
        }
        //If the menu is not visible
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
          //Get the parent menu
          var parent = $this.parents('ul').first();
          //Close all open menus within the parent  先关闭其他以打开的tree, ul等于所有查找到的ul:visible元素
          var ul = parent.find('ul:visible').slideUp(animationSpeed);
          //Remove the menu-open class from the parent
          ul.removeClass('menu-open');
          //Get the parent li
          var parent_li = $this.parent("li");

          //Open the target menu and add the menu-open class
          checkElement.slideDown(animationSpeed, function () {
            //Add the class active to the parent li
            checkElement.addClass('menu-open');
            parent.find('li.active').removeClass('active');
            parent_li.addClass('active');
            //Fix the layout in case the sidebar stretches over the height of the window
            _this.layout.fix();
          });
        }
        //if this isn't a link, prevent the page from being redirected
        if (checkElement.is('.treeview-menu')) {
          e.preventDefault();
        }
      });
  }; //end tree;
};
