import icons from "../icons/icons";
import Swup from "swup";
import Swiper from "swiper";
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
      afterLoad: function (anchorLink, index) {
        var currentIndex = index.index;
        console.log(currentIndex);
        if (currentIndex === mainSection.length - 1) {
          downUpBtn.classList.add("indicator-down--up");
        } else {
          downUpBtn.classList.remove("indicator-down--up");
        }
        downUpBtn.addEventListener("click", () => {
          if (currentIndex === mainSection.length - 1) {
            fullpage_api.moveTo(1);
          } else {
            fullpage_api.moveTo(currentIndex + 2);
          }
        });
      },
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

  load() {
    console.log("load");
  },
  resized() {
    console.log("resized");
  },

  swiperTest() {
    const swiper = new Swiper(".swiper-container", {
      loop: true,
    });
  },

  init: function () {
    app.iconSpriteFn();
    app.load();
    app.fullpageFn();
    app.headerColorFn();
    app.headerLanguageFn();
    app.swiperTest();
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
