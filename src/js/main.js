import icons from "../icons/icons";
const $ = require("jquery"); // if we need
import Swup from "swup";
import Swiper, { Mousewheel, Scrollbar, Autoplay } from "swiper";
Swiper.use([Mousewheel, Scrollbar, Autoplay]);
import "swiper/swiper-bundle.css";
import fullpage from "fullpage.js";

var app = {
  iconSpriteFn() {
    icons.forEach(iconSpriteFn);
    function iconSpriteFn(item, index) {
      const iconSprite = document.querySelector("#iconSprite");
      if (iconSprite) {
        iconSprite.innerHTML +=
          "<div class='icon-sprite__item'>" +
          "<span class='icon-sprite__number'>" +
          (index + 1) +
          "</span>" +
          "<div class='icon-sprite__preview'>" +
          item.iconSvg +
          "</div>" +
          "<div class='icon-sprite__name'>" +
          item.iconId +
          "</div>" +
          "</div>";
      }

      const icon = document.querySelectorAll(".icon");
      if (icon) {
        Array.prototype.forEach.call(icon, (el) => {
          let dataIconId = el.getAttribute("data-icon-id");
          if (dataIconId == item.iconId) {
            el.innerHTML = item.iconSvg;
          }
        });
      }
    }
  },

  fullpageFn() {
    const portfolioSwiper = new Swiper(".js-portfolio-slider", {
      loop: false,
      scrollbar: true,
      scrollOverflow: true,
      watchSlidesVisibility: true,
      speed: 700,
      mousewheel: {
        invert: false,
      },
      scrollbar: {
        el: ".js-portfolio-slider .swiper-scrollbar",
      },
      breakpoints: {
        320: {
          slidesPerView: 1.1,
          spaceBetween: 20,
        },
        577: {
          slidesPerView: 1.1,
          spaceBetween: 40,
        },
        769: {
          slidesPerView: 1.2,
          spaceBetween: 60,
        },
        993: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      },
    });

    const mainSection = document.querySelectorAll(".section");
    const downUpBtn = document.querySelector(".js-indicator-up-down");

    let mainSectionArrName = [];
    for (let index = 0; index < mainSection.length; index++) {
      const element = mainSection[index];
      const elementId = element.getAttribute("data-section-id");
      mainSectionArrName.push(elementId);
    }
    new fullpage("#fullpage", {
      anchors: mainSectionArrName,
      menu: "#mainMenu",
      autoScrolling: true,
      normalScrollElements: ".scroll-normal",
      responsiveWidth: 993,
      afterLoad: function (origin, destination, direction) {
        var currentIndex = destination.index;

        // header title inner html
        document.querySelector(".header__title").innerHTML = destination.anchor;

        // indicator up down fn
        if (destination.isLast == true) {
          downUpBtn.classList.add("indicator-down--up");
        } else {
          downUpBtn.classList.remove("indicator-down--up");
        }
        downUpBtn.addEventListener("click", () => {
          if (destination.isLast == true) {
            fullpage_api.moveTo(1);
          } else {
            fullpage_api.moveTo(currentIndex + 2);
          }
        });
        // portfolio fn
        if ($(window).width() > 993) {
          function swiperScrollLock() {
            if (portfolioSwiper.activeIndex == 0) {
              console.log("u are in portfolio and first slide");
              fullpage_api.setAllowScrolling(false, "down");
              setTimeout(() => {
                fullpage_api.setAllowScrolling(true, "up");
              }, 500);
            } else if (portfolioSwiper.activeIndex == 2) {
              fullpage_api.setAllowScrolling(false, "up");

              setTimeout(() => {
                fullpage_api.setAllowScrolling(true, "down");
              }, 500);
              console.log("last slider");
            } else if (portfolioSwiper.activeIndex == 1) {
              fullpage_api.setAllowScrolling(false);
            }
          }

          if (destination.anchor === "portfolio" && direction === "down") {
            swiperScrollLock();

            portfolioSwiper.on("slideChangeTransitionEnd", function () {
              swiperScrollLock();
            });
          } else if (destination.anchor === "portfolio" && direction === "up") {
            fullpage_api.setAllowScrolling(false, "up");
            console.log("portfolio direction up");
            setTimeout(() => {
              fullpage_api.setAllowScrolling(true, "down");
            }, 500);
          } else {
            setTimeout(() => {
              fullpage_api.setAllowScrolling(true);
            }, 500);
          }
          if (destination.anchor === "about") {
            setTimeout(() => {
              portfolioSwiper.slideTo(2);
            }, 400);
            portfolioSwiper.on("slideChangeTransitionEnd", function () {
              swiperScrollLock();
            });
          }
        }
      },
      onLeave: function (origin, destination, direction) {},
    });
  },

  createPreloaderFn(isActive) {
    var isActived = isActive;
    // console.log(isActive);
    var prelaoder = document.createElement("div");
    prelaoder.classList.add("preloader");
    prelaoder.appendChild(document.createElement("div"));
    prelaoder.querySelector("div").classList.add("preloader__icon");

    if (isActived === true) {
      document.body.appendChild(prelaoder);
    } else {
      document
        .querySelector(".preloader")
        .parentNode.removeChild(document.querySelector(".preloader"));
    }
  },

  headerColorFn() {
    const headerColorBtn = document.querySelector(".js-header-color-btn");
    if (headerColorBtn) {
      window.addEventListener("click", function (e) {
        if (document.querySelector(".header__color").contains(e.target)) {
          headerColorBtn.parentNode.classList.toggle("opened");
        } else {
          headerColorBtn.parentNode.classList.remove("opened");
        }
      });
      window.addEventListener("click", function (e) {
        if (
          document.querySelector(".header__color__wrapper").contains(e.target)
        ) {
          document
            .querySelector(".header__color__wrapper")
            .parentNode.classList.add("opened");
        }
      });
      const colorItem = document.querySelectorAll(".js-header-color");
      const themeColor = localStorage.getItem("themeColor");
      for (let index = 0; index < colorItem.length; index++) {
        const element = colorItem[index];
        const elementColor = element.getAttribute("style");
        const elementColorName = elementColor.slice(0, -1).split(": ");
        const colorItemActive = document.querySelectorAll(
          ".js-header-color.active"
        );
        element.addEventListener("click", (colorSet) => {
          localStorage.setItem("themeColor", "#fff500");
          colorSet = elementColorName[1];
          setTimeout(() => {
            document.documentElement.style.setProperty(
              "--color-primary",
              elementColorName[1]
            );
          }, 500);
          let colorItemActive = document.querySelectorAll(
            ".js-header-color.active"
          );
          colorItemActive.forEach((eActive) => {
            eActive.classList.remove("active");
          });
          if (colorSet == elementColorName[1]) {
            app.createPreloaderFn(true);
            localStorage.setItem("themeColor", elementColorName[1]);
            setTimeout(() => {
              app.createPreloaderFn(false);
              element.classList.add("active");
            }, 500);
          }
        });
        if (themeColor == elementColorName[1]) {
          colorItemActive.forEach((eActive) => {
            eActive.classList.remove("active");
          });
          element.classList.add("active");
        }
      }
      document.documentElement.style.setProperty("--color-primary", themeColor);
    }
  },

  headerLanguageFn() {
    const headerLanguageBtn = document.querySelector(".js-header-language-btn");
    if (headerLanguageBtn) {
      window.addEventListener("click", function (e) {
        if (document.querySelector(".header__language").contains(e.target)) {
          headerLanguageBtn.parentNode.classList.toggle("opened");
        } else {
          headerLanguageBtn.parentNode.classList.remove("opened");
        }
      });
      window.addEventListener("click", function (e) {
        if (
          document
            .querySelector(".header__language__wrapper")
            .contains(e.target)
        ) {
          document
            .querySelector(".header__language__wrapper")
            .parentNode.classList.add("opened");
        }
      });
    }
  },

  ShowMoreFn() {
    const showMoreParent = $(".show-more");
    const showMoreItem = $(".show-more > *");
    const showMoreWrp = `
    <div class="show-more__wrapper">
    </div>`;
    showMoreParent.each(function () {
      if (showMoreItem.length > 3) {
        var clonedItems = $(this)
          .find(showMoreItem)
          .slice(3, showMoreItem.length)
          .clone();
        $(this).append(
          `<span class="show-more__btn">+${
            $(this).find(showMoreItem).length - 3
          }</span>`
        );
        $(this).find(showMoreItem).slice(3, showMoreItem.length).remove();

        $(this).append(showMoreWrp);
        $(this).find(".show-more__wrapper").append(clonedItems);
        $(".show-more__wrapper > *").removeClass("disabled");
        $(window).click(function () {
          $(".show-more__wrapper").removeClass("active");
        });
        $(this)
          .find(".show-more__btn")
          .click(function (event) {
            $(this)
              .closest(".show-more")
              .find(".show-more__wrapper")
              .addClass("active");
            event.stopPropagation();
          });
      }
    });
  },

  aboutServicesSliderFn() {
    const aboutServicesSwiper = new Swiper(".js-about-services-slider", {
      loop: true,
      direction: "vertical",
      slidesPerView: 1,
      speed: 500,
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  },

  load() {
    console.log("load");
  },
  resized() {
    console.log("resized");
  },

  portfolioSliderFn() {},

  init: function () {
    app.iconSpriteFn();
    app.load();
    app.fullpageFn();
    app.headerColorFn();
    app.headerLanguageFn();
    app.ShowMoreFn();
    app.portfolioSliderFn();
    app.aboutServicesSliderFn();
  },
};

function docReadied(fn) {
  window.addEventListener("DOMContentLoaded", fn);
}
function docResized(fn) {
  window.addEventListener("resize", fn);
}
docReadied(() => {
  // const swup = new Swup({
  //   cache: true,
  // });
  // swup.on("contentReplaced", function () {
  //   swup.options.containers.forEach(() => {
  //     app.iconSpriteFn();
  //     app.swiperTest();
  //   });
  // });
  app.init();
});

docResized(() => {
  app.resized();
});

export default { docResized, docReadied };
