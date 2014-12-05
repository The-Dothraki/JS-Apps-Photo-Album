var Dom = (function () {
    var mainContainer = $("#album-list");

    function listAllAlbums(albums) {
        console.time("123");
        albums.forEach(function (album, i) {
            var li = $('<li>');
            var div = $('<div>');
            var h = $('<h3>');
            var footer = $('<footer>');
            var ul = $('<ul>');
            var displayedPictureCount = 0;

            li.attr('id', album.objectId)
                .attr('title', album.name)
                .data('container', album.category.objectId)
                .data('rating', album.rating)
                .data('date', album.createdAt)
                .attr('class', 'album').attr('onclick', 'openAlbum()');

            //h3
            h.attr('class', 'album-title').text(album.name);

            //div
            div.attr('class', 'album-pic-holder').append(ul);
            if (album.picture) {


                album.picture.forEach(function (x) {
                    var imgLi = $('<li>').append($('<img>').attr('src', x.file.url));

                    //hide picture if album has more than
                    if (++displayedPictureCount > 4) {
                        imgLi.hide();
                    }
                    ul.append(imgLi);

                });
            }
            div.append($('<div>').attr('class', 'white-overlay'))
                .append($('<div>').attr('class', 'hover-black'))
                .append($('<div>').attr('class', 'icon-album-hover'));

            //footer
            var footerText = typeof (album.rating) == "undefined" ? "Rate me" : averageOfArray(album.rating).toFixed(0);

            footer.append($('<section>').attr('class', 'alb-comments-f').text('Rating'))
                .append($('<section>').attr('class', 'alb-rating-f').text(footerText + ' / 10'));

            li.append(h)
                .append(div)
                .append(footer);
            mainContainer.append(li);
        });
        console.timeEnd("start");
        console.timeEnd("123");
    }


    function openAnAlbum() {
        $('#main-container').on('click', '.album', function () {
            var albumContainer = $("#album-opened-container");
            var div = $('<div>');
            var h2 = $('<h2>');
            var li = $('<li>');
            var ul = $('<ul>');
            var albumName = this.title;
            var albumID = this.id;

            $('#filters-category').hide();
            $('#filters-rating').hide();
            $('#filters-rating-picture').show();
            $('#bc').html("<span>Sort: </span>");


            div.attr('id', 'back-button').attr('onclick', 'collapseAlbum()')
               .attr('class', 'back-button-change').attr('style', 'display: block;');

            h2.attr('id', 'opened-album-title').attr('class', albumID).text(albumName);
            ul.attr('id', 'album-images-container');

            var Album = Parse.Object.extend("Album");
            var album = new Album();
            album.id = albumID;

            Queries.getPicturesByAlbum(album).then(function (picture) {
                picture.sort(function (x, y) {
                    var a = typeof (x._serverData.rating) !== 'undefined' ? x._serverData.rating.reduce(function (pv, cv) { return parseInt(pv) + parseInt(cv); }, 0) / x._serverData.rating.length : -1;
                    var b = typeof (y._serverData.rating) !== 'undefined' ? y._serverData.rating.reduce(function (pv, cv) { return parseInt(pv) + parseInt(cv); }, 0) / y._serverData.rating.length : -1;

                    if (a === b) {
                        if (x.objectId < y.objectId) {
                            return -1;
                        }

                        if (x.objectId > y.objectId) {
                            return 1;
                        }
                    }

                    return a - b;
                })

                for (var i = 0; i < picture.length; i++) {
                    var url = picture[i].attributes.file._url;
                    var picName = picture[i].attributes.name;
                    var picDate = "Date: " + formatDate(picture[i].createdAt);
                    var picRating = typeof (picture[i]._serverData.rating) == "undefined" ? "Rate me" :
                        "Rating: " + averageOfArray(picture[i]._serverData.rating).toFixed(0) + " / 10";
                    var picId = picture[i].id;



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
                        .append($('<section>').attr('id', picId).attr('class', 'pic-rating').text(picRating));


                    var li = $('<li>');
                    li.data('rating', picture[i]._serverData.rating);
                    li.data('date', picture[i].createdAt);

                    ul.append(li.append(header).append(section).append(footer));
                };
            });

            var sectionCommentsContainer = $('<section>');
            sectionCommentsContainer.attr('id', 'popup-album-comment-container');

            var sectionAllComments = $('<section>');
            sectionAllComments.attr('id', 'album-all-comments');



            var ulComments = $('<ul>');

            var divOnClick = $('<div>');
            divOnClick.attr('id', 'add-comment-button').attr('class', 'add-buttons').text('Add comment');
            divOnClick.on("click", addCommentToAlbum);

            var commentsForm = $('<form>');
            commentsForm.append($('<input>').attr('type', 'text').attr('id', 'name-for-album-comment').attr('placeholder', 'Enter your name'))
                .append($('<br>')).append($('<textarea>').attr('id', 'textareaAlbumComment').attr('placeholder', 'Enter a comment'))
                .append(divOnClick);

            var sectionAddAlbumComment = $('<section>');
            sectionAddAlbumComment.attr('id', 'add-album-comment')
                .append($('<span>').attr('class', 'small-album-title').text('Add a comment'))
                .append(commentsForm);

            var clearDiv = $('<div>');
            clearDiv.attr('id', 'clearDiv');

            Queries.getCommentsByAlbum(album).then(function (album) {
                for (var i = 0; i < album.length; i++) {
                    var commentOf = album[i].attributes.commentOf;
                    var commentContent = album[i].attributes.commentContent;
                    var commentDate = formatDate(album[i].createdAt);

                    var headerComments = $('<header>');
                    var articleComment = $('<article>');

                    headerComments.append($('<span>').attr('id', 'commentOf').text(commentOf))
                        .append($('<br>'))
                        .append($('<span>').attr('id', 'commentDate').text(commentDate));

                    articleComment.attr('id', 'album-comment-article').text(commentContent);

                    ulComments.append($('<li>').append(headerComments).append(articleComment));
                };
                sectionAllComments.append(ulComments);
                sectionCommentsContainer.append(sectionAllComments).append(sectionAddAlbumComment);

                $('#album-images-container').on('click', '.pic-rating', loadRatePicture);

            });

            albumContainer.append(h2).append(sectionCommentsContainer).append(clearDiv).append(ul);
        });
    }

    function averageOfArray(arr) {
        return arr.reduce(function (pv, cv) { return parseInt(pv) + parseInt(cv); }, 0) / arr.length;
    }

    function listCategotes() {
        Category = Parse.Object.extend("Category");
        var query = new Parse.Query(Category);
        query.find({
            success: function (results) {
                results.forEach(function (i) {
                    $(".categories-in-dropdown")
                      .append($('<option></option>')
                      .val(i.id)
                      .html(i.attributes.name));
                })
            }
        });

    }

    function initSliderElements() {
        Picture = Parse.Object.extend("Picture");
        var query = new Parse.Query(Picture);
        query.find({
            success: function (results) {
                var sortedPictures = Actions.sortPicturesByRating(results);
                console.log("HERE IS WHERE IT SHOULD BE ATTACHED TO DOM");
                sortedPictures.splice(10, sortedPictures.length - 10);
                sortedPictures.forEach(function (picture) {
                    var url = picture.attributes.file._url;
                    var id = picture.id;
                    $("#carousel").append('\n' +
                        '<li class="slider-element" data-id="' + id + '" data-src="' + url + '"><div><img src="' + url + '" /></div></li>')
                });
                console.log(sortedPictures);
            }
        })
    }

    function loadPicturePopup(pic) {
        var picId = pic.attr("data-id"),
            picSrc = pic.attr("data-src");

        $("#pic-shown")
            .attr("src", picSrc)
            .attr("data-id", picId);

        Queries.getObjectById("Picture", picId)
            .then(function (pic) {
                Queries.getCommentsByPicture(pic)
                    .then(function (comments) {
                        loadPictureComments(comments);
                    });
            });
    }

    function loadPictureComments(comments) {
        var ul = $("#pic-comments-list"),
            li,
            header,
            author,
            content,
            date,
            i;

        ul.html("");

        for (i in comments) {
            author = comments[i].attributes.author;
            content = comments[i].attributes.commentContent;
            date = formatDate(comments[i].createdAt);
            li = $("<li>");
            header = $("<header>")
                .append($("<span>").text(author))
                .append($("<span>").text(date));
            li.append(header)
                .append($("<article>").append(content));
            ul.append(li);
        }
    }

    function formatDate(obj) {

        var months = ['01', '02', '03', '04', '05', '06',
            '07', '08', '09', '10', '11', '12'
        ];

        return obj.getDate() + '.' + months[obj.getMonth()] +
            '.' + obj.getFullYear();
    }

    return {
        listAlbums: listAllAlbums,
        openAnAlbum: openAnAlbum,
        listCategotes: listCategotes,
        averageOfArray: averageOfArray,
        initSliderElements: initSliderElements,
        loadPicturePopup: loadPicturePopup,
        loadPictureComments: loadPictureComments
    }
})();