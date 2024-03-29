"use strict";
const musicArr = [];
window.onload = () => {
    // start slick slider
    $('.slick').slick({
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
    });
    document.querySelector("form").addEventListener("submit", validateForm);
    // load music cards if there is any 
    getItemsFromLocalStorage();
    // get displayed items when refreshed
    getItemsForDisplay()
        // display saved ones 
    $(".heart").click(() => {
            if ($(".saved-music-display").find(".row")[0].children.length !== 0) {
                $(".saved-music-display")[0].classList.toggle("display");
            }
        })
        // if anywhere other than .myheart is clicked then just hide it if it is opened
    $("body").click((e) => {
            if (!e.target.classList.contains("myheart") && !e.target.closest(".saved-music-display")) {
                if (!$(".saved-music-display")[0].classList.contains("display")) {
                    $(".saved-music-display").toggleClass("display");
                }
            }
        })
        // add fixed class to nav when the specified scrolling is reached
    $(window).scroll(() => {

        if ($(this).scrollTop() > 200) {
            $(".nav")[0].classList.add("position-fixed")
            $(".nav")[0].classList.add("bg-secondary")
        } else {
            $(".nav")[0].classList.remove("bg-secondary")
            $(".nav")[0].classList.remove("position-fixed")
        }

    });


};
const validateForm = function(e) {
    e.preventDefault();
    let errors = false;
    const form = e.target
    const fname = form.elements.fname;
    const email = form.elements.email;
    const textArea = form.elements.textArea;
    const REG_EXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (fname.value === "" || email.value === "" || textArea.value === "") {
        errors = true
        const h2 = $(`<h2 class="text-danger text-center mt-4">You must fill all the gaps!</h4>`)[0];
        form.insertAdjacentElement("beforeend", h2)
        setTimeout(() => {
            $(form).find(".text-danger").detach();
        }, 1500);

    } else if (!REG_EXP.test(email.value)) {
        errors = true
        const h2 = $(`<h2 class="text-danger text-center mt-4">Invalid Email!</h4>`)[0];
        form.insertAdjacentElement("beforeend", h2)
        setTimeout(() => {
            $(form).find(".text-danger").detach();
        }, 1500);
    }

    if (!errors) {
        const data = new FormData(form)
            // sending data to backend
        console.log(Object.fromEntries(data));
        form.reset();
    }

}

function getItemsFromLocalStorage() {
    let musicItems;
    if (JSON.parse(localStorage.getItem("music")) === null) {
        musicItems = [];
    } else {
        musicItems = JSON.parse(localStorage.getItem("music"));
        for (const musicObj of musicItems) {
            musicArr.push(musicObj);
        }
    }
    // display the number of saved musicCards
    $(".number")[0].textContent = musicArr.length
    return musicItems;
}

function getItemsForDisplay() {
    if (musicArr.length !== 0) {
        for (const musicCard of musicArr) {
            const imgSrc = musicCard.imgSrc;
            const title = musicCard.title;
            const subtitle = musicCard.subtitle;
            const col1 = $(`<div class="col-12 saved-music-display__img mb-3"></div>`)[0];
            $(col1).append(`<div><img src="${imgSrc}" alt=""</div>`);
            const col2 = $(`<div class="col-12 border-bottom mb-3 saved-music-display__title"></div>`)[0];
            $(col2).append(`<h4>${title}</h4> <h5>${subtitle}</h5>`);
            $(".saved-music-display")[0].children[0].children[0].append(col1, col2);
        }
    }

}