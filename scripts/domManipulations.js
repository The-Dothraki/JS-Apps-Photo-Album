var Dom = (function () {
    var mainContainer = $("#album-list");

    function listAllAlbums(albums) {

        albums.forEach(function (pic, i) {
            var album = albums[i];
            var li = $('<li>');
            var div = $('<div>');
            var h = $('<h3>');
            var footer = $('<footer>');
            var ul = $('<ul>');
            var displayedPictureCount = 0;

            li.attr('id', pic.objectId).attr('title', pic.name).attr('class', 'album').attr('onclick', 'openAlbum()');

            //h3
            h.attr('class', 'album-title').text(album.name);

            //div
            div.attr('class', 'album-pic-holder').append(ul);
            pic.picture.forEach(function (x) {
                var imgLi = $('<li>').append($('<img>').attr('src', x.file.url));

                //hide picture if album has more than
                if (++displayedPictureCount > 4) {
                    imgLi.hide();
                }
                ul.append(imgLi);

            });
            div.append($('<div>').attr('class', 'white-overlay'))
                .append($('<div>').attr('class', 'hover-black'))
                .append($('<div>').attr('class', 'icon-album-hover'));

            //footer
            var sum = 0;
            for (var i = 0; i < album.rating.length; i++) {
                sum += parseInt(album.rating[i], 10);
            }

            var avg = sum / album.rating.length;

            footer.append($('<section>').attr('class', 'alb-comments-f').text('Rating'))
                .append($('<section>').attr('class', 'alb-rating-f').text(avg.toFixed(2) + ' / 10'));


            li.append(h)
                .append(div)
                .append(footer);
            mainContainer.append(li);
        });
    }


    function openAnAlbum() {
        $(document).on('click', 'li', function () {
            var albumContainer = $("#album-opened-container");            
            var div = $('<div>');
            var h2 = $('<h2>');
            var li = $('<li>');
            var ul = $('<ul>');
            var albumName = this.title;
            var albumID = this.id;            

            div.attr('id', 'back-button').attr('onclick', 'collapseAlbum()')
                .attr('class', 'back-button-change').attr('style', 'display: block;');
            h2.attr('id', 'opened-album-title').attr('class', albumID).text(albumName);
            ul.attr('id', 'album-images-container');

            var Album = Parse.Object.extend("Album");
            var album = new Album();
            album.id = albumID;            

            Queries.getPicturesByAlbum(album).then(function (album) {
                for (var i = 0; i < album.length; i++) {
                    var url = album[i].attributes.file._url;
                    var picName = album[i].attributes.name;
                    var picDate = "Date: " + formatDate(album[i].createdAt);
                    var picRating = "Rating: " + album[i]._serverData.rating + " / 10";


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
                        .append($('<div>').attr('class', 'pic-hover').attr('onclick', 'loadPopup()'));

                    footer.append($('<section>').attr('class', 'pic-date').text(picDate))
                        .append($('<section>').attr('class', 'pic-download').append(a))
                        .append($('<section>').attr('class', 'pic-rating').text(picRating));

                    ul.append(($('<li>').append(header).append(section).append(footer)));
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
            });


            function formatDate(obj) {

                var months = ['01', '02', '03', '04', '05', '06',
                    '07', '08', '09', '10', '11', '12'
                ];

                return obj.getDate() + '.' + months[obj.getMonth()] +
                    '.' + obj.getFullYear();
            }

            albumContainer.append(h2).append(sectionCommentsContainer).append(clearDiv).append(ul);
        });
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

    };

    return {
        listAlbums: listAllAlbums,
        openAnAlbum: openAnAlbum,
        listCategotes: listCategotes,
    }

})();