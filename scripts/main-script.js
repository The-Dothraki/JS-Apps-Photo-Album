function addPictureToAlbum(event) {
    var picName = $('#picture-name').val();

    var openedAlbum = $('#opened-album-title');
    var albumId = openedAlbum.attr('class');

    try {
        var validPicName = validateString(picName, 'Picture name');
        var picFile = Actions.uploadPicture(validPicName);

        Queries.getObjectById('Album', albumId)
            .then(function (album) {
                Actions.addPictureToAlbum(validPicName, picFile, album)
                    .then(function () {
                        Queries.getLastSaveObject('Picture', function (pic) {
                            createPictureItem(pic[0]);
                        });
                    });
                closePopup();
                Noty.success("The picture was successfully added.");
            });
    } catch (error) {
        Noty.error(error);
    }
}

function addCommentToAlbum(event) {
    var commentContent = $("#textareaAlbumComment").val();
    var commentOf = $("#name-for-album-comment").val().trim();

    var openedAlbum = $('#opened-album-title');
    var albumId = openedAlbum.attr('class');

    try {
        var validName = validateString(commentOf, 'Name');

        Queries.getObjectById("Album", albumId).then(function (album) {
            Actions.addCommentToAlbum(validName, commentContent, album);
        }).then(function (result) {
            emptyFields();
            Noty.success('The comment was successfully added."');
        });
    } catch (error) {
        Noty.error(error);
    }
}

function createAlbum(event) {
    var albumName = $("#album-name").val().trim(),
        a = document.getElementById("album-category"),
        categoryId = a.options[a.selectedIndex].value,
        regexValidate = new RegExp("(^[A-Za-z0-9]+[A-Za-z0-9 ][A-Za-z0-9 ]*$)");
    $("#album-name").val(albumName);
    if (!albumName || albumName.length > 25 || !regexValidate.test(albumName)) {
        Noty.error("Album name should be between 0 and 25 symbols and should contain only latin letters, numbers, intervals and dashes.");
    } else {
        Queries.getObjectById("Category", categoryId)
            .then(function (category) {
                Actions.createAlbum(albumName, category);
            })
            .then(function (result) {
                Noty.success("Album created");
                Queries.getLastSaveObject("Album", function (x) {
                    Dom.listAlbums(x);
                    openAlbum();
                    emptyFields();
                    Dom.openAnAlbum.call($('#' + x[0].objectId)[0]);

                });
                closePopup();
            });
    }
}

function rateAlbum() {
    var openedAlbum = $('#opened-album-title');
    var albumId = openedAlbum.attr("class");
    var rating = $("#rate-album-range").val();
    Actions.rateAlbum(albumId, parseInt(rating),
        function success() {
            Noty.success('The album was successfully rated with ' + rating + ' !');
            closePopup();
            emptyFields();
            var albumElement = $('#' + albumId);
            var changeElement = $(albumElement.first().children().eq(2)[0]).children()[1];
            Dom.changeRating(albumElement, changeElement, rating, "");

        }, function error(error) {
            Noty.error("Sorry, there was a problem");
        });
}

function ratePicture(event) {
    var pictureId = $('#popup-rate-picture form').attr('id');
    var rating = $("#rate-picture-range").val();

    Actions.ratePicture(pictureId, parseInt(rating),
        function success() {
            Noty.success('The picture was successfully rated with ' + rating + ' !');
            var picture = $('#album-images-container').children().filter(function () {
                return $(this).data('id') == pictureId;
            });
            
            var changeElement = $('#' + pictureId)[0];           

            Dom.changeRating(picture, changeElement, rating, "Rating: ");
            closePopup();
        }, function error(error) {
            Noty.error("Sorry, there was a problem");
        });
}

function addCommentToPicture(event) {

    var authorInput = $("#name-for-pic-comment"),
        commentInput = $("#comment-value"),
        author = validateString(authorInput.val(), "Author"),
        comment = commentInput.val(),
        pic;

    if (!comment || comment.length > 100) {
        Noty.error("Comment cannot be larger than 100 characters.")
        return;
    } else if (!author) {

    } else {
        openedImageId = $("#pic-shown").attr("data-id");

        Queries.getObjectById("Picture", openedImageId).then(function (picture) {
            pic = picture;
            Actions.addCommentToPicture(author, comment, picture);
        }).then(function (result) {
            Queries.getCommentsByPicture(pic).then(function (comments) {
                Dom.loadPictureComments(comments);
                authorInput.val("");
                commentInput.val("");
            });
        });
    }
}

function loadHomePage() {
    collapseAlbum();
    $("#back-button").toggleClass("back-button-change");
        
    changeSelectHTMLTagToDefaultState('#filters-category', 'all');
    changeSelectHTMLTagToDefaultState('#filters-rating-picture', 'Rating (ascending)');
    changeSelectHTMLTagToDefaultState('#filters-rating', 'Rating (ascending)');
}


function changeSelectHTMLTagToDefaultState(elementID, defaultOptionValue) {
    $(elementID).val(defaultOptionValue) // change displaying option
    $(elementID).trigger('change'); // trigger event
}

function createCategory() {
    var catName = validateString($('#category-name').val(), "Category name"); // Get from input field
    if (catName) {
        Noty.success("Category created");
        Actions.createCategory(catName);
        Dom.clearCategories();
        Dom.listCategotes();
        closePopup();
    }
}

function getSelectedTextFromSelect(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex === -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

function validateString(value, varName) {
    var trimmed = value.trim();
    var regexValidate = new RegExp("(^[A-Za-z0-9]+[A-Za-z0-9 ][A-Za-z0-9 ]*$)");

    if (!trimmed || trimmed.length > 25 || !regexValidate.test(trimmed)) {
        Noty.error(varName + " should be between 0 and 25 symbols and should contain only latin letters, numbers, intervals and dashes.");
    } else {
        return trimmed;
    }
}

// FRONT END SCRIPTS
function openAlbum() {
    $("#back-button").toggleClass("back-button-change");
    $("#back-button").css("display", "block");
    $("#album-opened-container").css("display", "block");
    $("#main-container").addClass("main-collapse");
    $("#add-album-button").css("display", "none");
    $("#add-picture-button").css("display", "block");
    $("#rate-album").css("display", "block");
    $("#add-category-button").css("display", "none");
}

function collapseAlbum() {
    $("#back-button").toggleClass("back-button-change");
    $("#back-button").css("display", "none");
    $("#main-container").removeClass("main-collapse");
    $("#album-opened-container").css("display", "none");
    $("#add-album-button").css("display", "block");
    $("#add-picture-button").css("display", "none");
    $("#rate-album").css("display", "none");
    $("#add-category-button").css("display", "block");
    $('#album-opened-container ul').remove();
    $('#album-opened-container h2').remove();
    $('#popup-album-comment-container').remove();
    $('#filters-rating-picture').hide();
    $('#filters-rating-picture').val("Rating (ascending)");
    $('#filters-rating').show();
    $('#filters-category').show();
    $('#bc').html("<span>Filters: </span>");
}

function loadPopup(that) {
    $("#pic-comments-list").html("");
    $("#popup-picture").css("display", "block");
    Dom.loadPicturePopup(that);
    setSize();
}

function emptyFields() {
    if ($("#name-for-album-comment")) {
        $("#name-for-album-comment").val('');
    }

    if ($("#textareaAlbumComment")) {
        $("#textareaAlbumComment").val('');
    }
  
    showVal(1, 'rate-picture-value');
    showVal(1, 'rate-album-value');
    $('#rate-album-range').val(1);
    $('#rate-picture-range').val(1);
    $("#album-name").val("");
    $("#picture-name").val("");
    $("#image-file").val("");
    $("#category-name").val("");
}

function closePopup() {
    $("#popup-picture").css("display", "none");
    $("#popup-add-album").css("display", "none");
    $("#popup-add-category").css("display", "none");
    $("#popup-add-picture").css("display", "none");
    $("#popup-rate-album").css("display", "none");
    $("#popup-rate-picture").css("display", "none");
    emptyFields();
}

function setSize() {
    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var img = $("#pic-shown");
    var pictureWidth = (img.width());
    var pictureHeight = (img.height());

    var widthContainer = viewportWidth - 200;
    var heightContainer = viewportHeight - 100;
    $("#popup-picture-container").css("width", (widthContainer.toString() + 'px'));
    $("#popup-picture-container").css("height", (heightContainer.toString() + 'px'));

    var aspectRatio = (pictureWidth) / (pictureHeight);

    $("#pic-all-comments").css("height", ((heightContainer - 260).toString() + 'px'));
    $("#popup-picture-image-container").css("width", ((widthContainer - 380).toString() + 'px'));
    $("#popup-picture-image-container").css("height", (heightContainer.toString() + 'px'));
    //if horizontal
    if ((widthContainer - 380) / heightContainer > aspectRatio) {
        img.css("max-height", "100%");
        img.css("max-width", "auto");
    } else {
        img.css("max-width", "100%");
        img.css("max-height", "auto");
    }
}

function loadAddAlbum() {
    $("#popup-add-album").css("display", "block");
}

function loadAddCategory() {
    $("#popup-add-category").css("display", "block");
}

function loadAddPicture() {
    $("#popup-add-picture").css("display", "block");
}

function loadRateAlbum() {
    $("#popup-rate-album").css("display", "block");
}

function loadRatePicture() {
    $("#popup-rate-picture").css("display", "block");
    $('#popup-rate-picture form').attr('id', this.id);
}

function showVal(newVal, id) {
    id = id.toString().replace('range', 'value');
    document.getElementById(id).innerHTML = "Rate: " + newVal;

    var parentId = id.split('-')[1];

    var divs = $('#' + 'popup-rate-' + parentId + ' .rate-scale')
    $(divs[0]).css('height', '100px');
    $(divs[0]).css('background-color', "rgba(0,0,0,0)");

    for (var i = newVal - 1; i < divs.length; i++) {
        $(divs[i]).css('height', '100px');
        $(divs[i]).css('background-color', "rgba(0,0,0,0)");
    }

    for (var i = 1; i < newVal; i++) {
        $(divs[parseInt(i)]).css('background-color', "rgba(0,0,0," + i / 10 + ")");
        $(divs[parseInt(i)]).css('height', i * 10 + "px");
    }
}

$(document).ready(function () {
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if (scroll > 0) {
            $("#main-header").addClass("fixed-header");
            $("#main").css("margin-top", "50px");
        }
        if (scroll == 0) {
            $("#main-header").removeClass("fixed-header");
            $("#main").css("margin-top", "80px");
        }
    });
    $(document).on("click", ".pic-hover", function () {
        loadPopup($(this));
    });
    $(document).on("click", ".slider-element", function () {
        openAlbum();
        Dom.openAnAlbum.call(this);
    });
});

function performSearch() {
    var keyword = $("#search-bar").val(),
        albumList = $('#album-list').children(),
        albumName;

    albumList.show();
    albumList.each(function(number, element) {
        albumName = $(element).children('h3.album-title').html().toLowerCase();
        if (albumName.indexOf(keyword) === -1) {
            $(element).hide();
        }
    });
}


function attachEventes() {
    $("#add-album-submit").on("click", createAlbum);
    $("#add-category-submit").on("click", createCategory);
    $("#add-picture-submit").on("click", addPictureToAlbum);
    $("#rate-album-submit").on("click", rateAlbum);
    $("#rate-picture-submit").on("click", ratePicture);
    $("#add-picture-comment-button").on("click", addCommentToPicture);
    $("#search-button").on("click", performSearch);

    $("#search").submit(function() {
        performSearch();
        return false;
    });

    $('#filters-category').change(function (data) {
        var selected;
        var albumList = $('#album-list').children();


        $("#filters-category option:selected").each(function() {
            selected = $(this).val();
        });

        if (selected !== 'all') {
            albumList.show();
            albumList.each(function (number, element) {
                if ($(element).data('container') !== selected) {
                    $(element).hide();
                }
            });
        } else {
            albumList.show();
        }
    });

    $('#filters-rating').change(function (data) {
        var selected;
        var albumList = $('#album-list').children();

        $("#filters-rating option:selected").each(function () {
            selected = $(this).val();
        });

        switch (selected) {
            case 'Rating (ascending)':
                albumList.sort(sortByRatingAsc);
                albumList.each(function (x, element) {
                    $('#album-list').append(element);
                });
                break;
            case 'Rating (descending)':
                albumList.sort(sortByRatingDes);
                albumList.each(function (x, element) {
                    $('#album-list').append(element);
                });
                break;
            case 'Date (ascending)':
                albumList.sort(sortByDateAsc);
                albumList.each(function (x, element) {
                    $('#album-list').append(element);
                });
                break;
            case 'Date (descending)':
                albumList.sort(sortByDateDes);
                albumList.each(function (x, element) {
                    $('#album-list').append(element);
                });
                break;

            default:
                break;
        }
    });

    $('#filters-rating-picture').change(function (data) {
        var selected;
        var pictureList = $('#album-images-container').children();

        $("#filters-rating-picture option:selected").each(function () {
            selected = $(this).val();
        });

        switch (selected) {
            case 'Rating (ascending)':
                pictureList.sort(sortByRatingAsc);
                pictureList.each(function (x, element) {
                    $('#album-images-container').append(element);
                });
                break;
            case 'Rating (descending)':
                pictureList.sort(sortByRatingDes);
                pictureList.each(function (x, element) {
                    $('#album-images-container').append(element);
                });
                break;
            case 'Date (ascending)':
                pictureList.sort(sortByDateAsc);
                pictureList.each(function (x, element) {
                    $('#album-images-container').append(element);
                });
                break;
            case 'Date (descending)':
                pictureList.sort(sortByDateDes);
                pictureList.each(function (x, element) {
                    $('#album-images-container').append(element);
                });
                break;

            default:
                break;
        }
    });

    $('#image-file').change(function () {
        $('#max-file-size').css('color', 'black');
        $('#allowed-file-types').css('color', 'black');
    });


    $('#main-container').on('click', '.album', Dom.openAnAlbum);


    function sortByRatingAsc(x, y) {
        var a = typeof ($(x).data('rating')) !== 'undefined' ? $(x).data('rating').reduce(function (pv, cv) {
            return parseInt(pv) + parseInt(cv);
        }, 0) / $(x).data('rating').length : -1;
        var b = typeof ($(y).data('rating')) !== 'undefined' ? $(y).data('rating').reduce(function (pv, cv) {
            return parseInt(pv) + parseInt(cv);
        }, 0) / $(y).data('rating').length : -1;

        if (a === b) {
            if ($(x).attr('id') < $(y).attr('id')) {
                return -1;
            }
            if ($(x).attr('id') > $(y).attr('id')) {
                return 1;
            }
        }

        return a - b;
    }

    function sortByRatingDes(x, y) {
        return sortByRatingAsc(y, x);
    }

    function sortByDateAsc(x, y) {
        var a = Date.parse($(x).data('date'));
        var b = Date.parse($(y).data('date'));

        return a - b;
    }

    function sortByDateDes(x, y) {
        return sortByDateAsc(y, x);
    }
}

function createPictureItem(pic) {
    var ul = $('#album-images-container');

    var url = pic.file.url;
    var picName = pic.name;
    var date = pic.createdAt.substr(0, 10);
    var dateArr = date.split('-');
    var picDate = "Date: " + dateArr[2] + '.' + dateArr[1] + '.' +
        dateArr[0];
    var picId = pic.objectId;

    var header = $('<header>');
    var h3 = $('<h3>');
    var section = $('<section>');
    var footer = $('<footer>');
    var img = $('<img>');
    var a = $('<a>');

    h3.text(picName);
    img.attr('src', url);
    a.attr('href', url).attr('download', picName).text('Download');

    header.append(h3);

    section.append(img)
        .append($('<div>')
            .attr('class', 'pic-hover')
            .attr('data-id', picId)
            .attr('data-src', url));

    footer.append($('<section>').attr('class', 'pic-date').text(picDate))
        .append($('<section>').attr('class', 'pic-download').append(a))
        .append($('<section>').attr('id', picId).attr('class', 'pic-rating').text('Rate me'));


    var li = $('<li>');
    li.data('date', pic.createdAt);
    li.data('id', pic.objectId);
    li.data('rating', 'undefined');

    ul.append(li.append(header).append(section).append(footer));
    appendPictureToAlbumInAlbumView(url)
}

function appendPictureToAlbumInAlbumView(picUrl) {
    var openedAlbum = $('#opened-album-title');
    var albumId = openedAlbum.attr('class');
    var pictureLiInAlbumView = $('#' + albumId + " div.album-pic-holder ul li");

    if (pictureLiInAlbumView.length < 4) {
        $('#' + albumId + " div.album-pic-holder ul")
            .first()
            .append($('<li>').append($('<img>').attr('src', picUrl)));
    } else {
        $('#' + albumId + " div.album-pic-holder ul")
            .first()
            .append($($('<li>').append($('<img>').attr('src', picUrl))).hide());
    }
}

$(function () {
    Actions.listAlbums();
    Dom.listCategotes();
    Dom.initSliderElements();
    attachEventes();
});