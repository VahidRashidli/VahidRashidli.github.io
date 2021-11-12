"use strict";
const musicArr = [];
window.onload = () => {
    // start slick slider
    $('.slick').slick({
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
    });
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
    // change content when transitioning over sections
    $(".transitions section").on("click", (e) => {
        const targetedSection = e.target.closest("section")
        const container = targetedSection.closest(".container").nextElementSibling
        const img = $(container).find(".img")[0].children[0];
        const h1 = $(container).find(".right")[0].children[0]
        const p = $(container).find(".right")[0].children[1]
        const ul = $(container).find(".right")[0].children[2]
        const li1 = $(container).find(".right")[0].children[2].children[0]
        const li2 = $(container).find(".right")[0].children[2].children[1]
        const li3 = $(container).find(".right")[0].children[2].children[2]
        $(".transitions .active")[0].classList.remove("active")
        targetedSection.classList.add("active")
        if (targetedSection.classList.contains("second")) {
            img.src = "images/features/features-1.png"
            h1.textContent = "Campaigns Monitoring Tools"
            p.textContent = "Campaigns monitoring is a feature we've developed since the beginning because it's at the core of Tivo and basically to any marketing activity focused on results."
            li1.textContent = "Easily plan campaigns and schedule their starting date"
            li2.textContent = "Start campaigns and follow their evolution closely"
            li3.textContent = "Evaluate campaign results and optimize future actions"
        } else if (targetedSection.classList.contains("first")) {
            img.src = "images/features/features-1.png"
            h1.textContent = "List Building Is Easier Than Ever"
            p.innerHTML = "It's very easy to start using Tivo. You just need to fill out and submit the <a href=\"\">Sign Up Form</a> and you will receive access to the app and all of its features in no more than 24h."
            li1.textContent = "Create and embed on websites newsletter sign up forms"
            li2.textContent = "Manage forms and landing pages for your services"
            li3.textContent = "Add and remove subscribers using the control panel"
        } else if (targetedSection.classList.contains("third")) {
            img.src = "images/features/features-1.png"
            h1.textContent = "Analytics Control Panel"
            p.textContent = "Analytics control panel is important for every marketing team so it's beed implemented from the begging and designed to produce reports based on very little input information."
            li1.textContent = "If you set it up correctly you will get acces to great intel"
            li2.textContent = "Easy to integrate in your websites and landing pages"
            li3.textContent = "The generated reports are important for your strategy"
        }

    });

};

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