"use strict";
const musicArr = [];
window.onload = () => {
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
        // start slick slider
    $('.slick').slick({
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
    });
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

    // load default music content
    fetch("https://shazam.p.rapidapi.com/songs/list-artist-top-tracks?id=40008598&locale=en-US", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "shazam.p.rapidapi.com",
                "x-rapidapi-key": "e0b050394amshc3ba3cb15438630p169307jsn2d655a06a165"
            }
        })
        .then(response => response.json())
        .then(trackArr => {
            const tracks = trackArr.tracks;
            for (const track of tracks) {
                const col = $(`
                    <div class="col mr-4  mb-4">
                    <div class="musicCard my-3">
                    <div class="musicCard__heart"><i class="far fa-heart"></i></div>
                    <div class="musicCard__top mb-3">
                    <img src="${track.images.coverart}" alt="music picture">
                    </div>
                    <div class="musicCard__content">
                    <h2 class="text-center mt-3">${track.title}</h2>
                    <h4 class="text-center mb-3">${track.subtitle}</h4>
                   <div> <audio src="${track.hub.actions[1].uri}" controls></audio></div>
                    </div>
                    </div>
                    </div>`)[0];
                $(".music").find(".row").append(col);
                $(col).find(".musicCard__heart i").click(addToLocalStorage);
                getSavedMusic();
            }
        })

    .catch(err => {
        console.error(err);
    });

    // load searched music
    $(".button").on("click", () => {
        const searchedMusic = $("#search")[0];
        $(".music").find(".row").empty();
        fetch("https://shazam.p.rapidapi.com/search?term=" + searchedMusic.value + "&locale=en-US&offset=0&limit=5", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "shazam.p.rapidapi.com",
                    "x-rapidapi-key": "e0b050394amshc3ba3cb15438630p169307jsn2d655a06a165"
                }
            })
            .then(response => response.json())
            .then(trackArr => {
                if (JSON.stringify(trackArr) === '{}') { // if there is no track then inform the user
                    const alertDiv = $(`<div class="container feedback"><div class="row"><div class="col-12"><h3 class="text-danger text-center">Looks like we couldn't find anything :( </h3></div></div></div>`)[0];
                    $(".music").prepend(alertDiv);
                } else {
                    $(".feedback").detach();
                    const tracks = trackArr.tracks.hits;
                    for (const track of tracks) {
                        const col = $(`
                        <div class="col mr-4 mb-4">
                        <div class="musicCard my-3">
                        <div class="musicCard__heart"><i class="far fa-heart"></i></div>
                        <div class="musicCard__top mb-3">
                        <img src="${track.track.images.coverart}" alt="music picture">
                        </div>
                        <div class="musicCard__content">
                        <h2 class="text-center mt-3">${track.track.title}</h2>
                        <h4 class="text-center mb-3">${track.track.subtitle}</h4>
                       <div> <audio src="${track.track.hub.actions[1].uri}" controls></audio></div>
                        </div>
                        </div>
                        </div>`)[0];
                        $(".music").find(".row").append(col);
                        $(col).find(".musicCard__heart i").click(addToLocalStorage);
                        getSavedMusic();
                    }
                }
            })

        .catch(err => {
            console.error(err);
        });
        $("form")[0].reset();
    });



};

function addToLocalStorage(e) {
    const heartIcon = e.target;
    const musicCard = e.target.closest(".musicCard");
    const imgSrc = musicCard.children[1].children[0].src;
    const title = musicCard.children[2].children[0].textContent;
    const audioSrc = musicCard.children[2].children[2].children[0].src;
    const subtitle = musicCard.children[2].children[1].textContent;
    const music = {
        imgSrc: imgSrc,
        title: title,
        audioSrc: audioSrc,
        subtitle: subtitle,
    }

    if (musicArr.length === 0) {
        heartIcon.classList.replace("far", "fas")
        musicArr.push(music)
        localStorage.setItem("music", JSON.stringify(musicArr));
        displayItems(e)
        $(".number")[0].textContent = musicArr.length
    } else {

        if (musicArr.some(m => m.title === title && m.imgSrc === imgSrc)) {
            const indexToRemove = musicArr.findIndex(m => m.title === title && m.imgSrc === imgSrc)
            heartIcon.classList.replace("fas", "far");
            removeFromDisplay(e)
            musicArr.splice(indexToRemove, 1);
            localStorage.setItem("music", JSON.stringify(musicArr));
            $(".number")[0].textContent = musicArr.length
        } else {
            displayItems(e)
            heartIcon.classList.replace("far", "fas")
            musicArr.push(music)
            localStorage.setItem("music", JSON.stringify(musicArr));
            $(".number")[0].textContent = musicArr.length
        }

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

function getSavedMusic() {
    const musicCards = document.querySelectorAll(".musicCard");
    for (const musicCard of musicCards) {
        const imgSrc = musicCard.children[1].children[0].src;
        const title = musicCard.children[2].children[0].textContent
        const subtitle = musicCard.children[2].children[1].textContent
        if (musicArr.some(m => m.imgSrc === imgSrc && m.title === title && m.subtitle === subtitle)) {
            $(musicCard).find("i")[0].classList.replace("far", "fas");
        }
    }

}

function displayItems(e) {
    const heartIcon = e.target;
    const musicCard = e.target.closest(".musicCard");
    const imgSrc = musicCard.children[1].children[0].src;
    const title = musicCard.children[2].children[0].textContent;
    const subtitle = musicCard.children[2].children[1].textContent;
    const col1 = $(`<div class="col-12 saved-music-display__img mb-3"></div>`)[0];
    $(col1).append(`<div><img src="${imgSrc}" alt=""</div>`);
    const col2 = $(`<div class="col-12 border-bottom mb-3 saved-music-display__title"></div>`)[0];
    $(col2).append(`<h4>${title}</h4> <h5>${subtitle}</h5>`);
    $(".saved-music-display")[0].children[0].children[0].append(col1, col2);
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

function removeFromDisplay(e) {
    const heartIcon = e.target;
    const musicCard = e.target.closest(".musicCard");
    const imgSrc = musicCard.children[1].children[0].src;
    const title = musicCard.children[2].children[0].textContent;
    const subtitle = musicCard.children[2].children[1].textContent;
    if ($(".saved-music-display").find(".row")[0].children.length !== 0) {
        for (const iterator of $(".saved-music-display__title")) {
            if (iterator.children[0].textContent === title && iterator.children[1].textContent === subtitle) {
                $(iterator).prev().detach();
                $(iterator).detach();
            }
        }
        if ($(".saved-music-display").find(".row")[0].children.length === 0) {
            $(".saved-music-display")[0].classList.add("display");
        }
    }
}