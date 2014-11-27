function addPictureToAlbum(event) {
    var picName = document.getElementById("picture-name").value;
    var albumId = "LAi8wXfsLm";

    try {
        var validPicName = validateString(picName, 'Picture name');
        var picFile = Actions.uploadPicture(validPicName);

        Queries.getObjectById("Album", albumId).then(function (album) {
                Actions.addPictureToAlbum(validPicName, picFile, album);
            }).then(function (result) {
                closePopup();
                alert('The picture was added to the album.');
            });
    } catch (error) {
        alert(error.message);
    }
}

function createAlbum(event) {
    var albumName = document.getElementById("album-name").value.trim(),
        a = document.getElementById("album-category"),
        categoryId = a.options[a.selectedIndex].value,
        regexValidate = new RegExp("(^[A-Za-z0-9]+[A-Za-z0-9 ][A-Za-z0-9 ]*$)");
    document.getElementById("album-name").value = albumName;
    console.log(albumName);
    if (!albumName || albumName.length > 25 || !regexValidate.test(albumName)) {
        alert("Album name should be between 0 and 25 symbols and should contain only latin letters, numbers, intervals and dashes.");
    }
    else {
        Queries.getObjectById("Category", categoryId)
            .then(function (category) {
                Actions.createAlbum(albumName, category);
            })
            .then(function (result) {
                console.log("Album created.");
                closePopup();
            });
    }
}

function createCategory() {
    var catName = "Cars"; // Get from input field

    Actions.createCategory(catName)
        .then(function(result) {
            console.log("Category created.");
        });
}

function getSelectedTextFromSelect(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex === -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

function validateString (value, varName) {
    var trimmed = value.trim();
    var regexValidate = new RegExp("(^[A-Za-z0-9]+[A-Za-z0-9 ][A-Za-z0-9 ]*$)");

    if (!trimmed || trimmed.length > 25 || !regexValidate.test(trimmed)) {
        throw new Error(varName + " should be between 0 and 25 symbols and should contain only latin letters, numbers, intervals and dashes.");
    } else {
        return trimmed;
    }
}

// FRONT END SCRIPTS
function openAlbum() {
    document.getElementById("back-button").classList.toggle("back-button-change");
    document.getElementById("back-button").style.display = "block";
    document.getElementById("main-container").classList.add("main-collapse");
    document.getElementById("album-opened-container").style.display = "block";
    document.getElementById("add-album-button").style.display = "none";
    document.getElementById("add-picture-button").style.display = "block";
    document.getElementById("rate-album").style.display = "block";
}

function collapseAlbum() {
    document.getElementById("back-button").classList.toggle("back-button-change");
    document.getElementById("back-button").style.display = "none";
    document.getElementById("main-container").classList.remove("main-collapse");
    document.getElementById("album-opened-container").style.display = "none";
    document.getElementById("add-album-button").style.display = "block";
    document.getElementById("add-picture-button").style.display = "none";
    document.getElementById("rate-album").style.display = "none";
}

function loadPopup() {
    document.getElementById("popup-picture").style.display = "block";
    setSize();
}

function closePopup() {
    document.getElementById("popup-picture").style.display = "none";
    document.getElementById("popup-add-album").style.display = "none";
    document.getElementById("popup-add-picture").style.display = "none";
}

function setSize() {
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var img = document.getElementById("pic-shown");
    var pictureWidth = (img.clientWidth);
    var pictureHeight = (img.clientHeight);

    var widthContainer = viewportWidth - 200;
    var heightContainer = viewportHeight -100;
    document.getElementById("popup-picture-container").style.width = widthContainer.toString()+'px';
    document.getElementById("popup-picture-container").style.height = heightContainer.toString()+'px';

    var aspectRatio = (pictureWidth)/(pictureHeight);

    console.log(widthContainer + " " + heightContainer + " " + pictureWidth + " " + pictureHeight);
    document.getElementById("popup-picture-image-container").style.width = (widthContainer-380).toString()+'px';
    document.getElementById("popup-picture-image-container").style.height = heightContainer.toString()+'px';
    if ((widthContainer-380)/heightContainer > aspectRatio) {
        document.getElementById("pic-shown").style.maxHeight = '100%';
    } else {
        document.getElementById("pic-shown").style.maxWidth = '100%';
    }

    if (aspectRatio >= 1) {
        var paddingTop = Math.abs((heightContainer-((widthContainer-380)/aspectRatio))/2).toString()+'px';
        console.log(paddingTop);
        document.getElementById("popup-picture-image-container").style.paddingTop = paddingTop;
    }

    document.getElementById("pic-all-comments").style.height = (heightContainer - 260).toString() + 'px';
}

function loadAddAlbum() {
    document.getElementById("popup-add-album").style.display = "block";
}

function loadAddPicture() {
    document.getElementById("popup-add-picture").style.display = "block";
}

function rateAlbum() {

}

$(document).ready(function() {
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            document.getElementById("main-header").classList.add("fixed-header");
            document.getElementById("main").style.marginTop = "50px";
        }
        if (scroll == 0) {
            document.getElementById("main-header").classList.remove("fixed-header");
            document.getElementById("main").style.marginTop = "80px";
        }
    });
})

document.getElementById("add-album-submit").addEventListener("click", createAlbum);
document.getElementById("add-picture-submit").addEventListener("click", addPictureToAlbum);