var Dom = (function () {
    var mainContainer = $("#album-list");

    function listAllAlbums() {
        Queries.getObjectAndPointer("Album", "Picture", function (result) {            

            result.forEach(function (pic, i) {
                var album = result[i];
                var li = $('<li>');
                var div = $('<div>');
                var h = $('<h3>');
                var footer = $('<footer>');
                var ul = $('<ul>');
                var displayedPictureCount = 0;

                li.attr('class', 'album ' + pic.objectId).attr('onclick', 'openAlbum()');

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
                footer.append($('<section>').attr('class', 'alb-comments-f').text(album.comments.length + ' com'))
                      .append($('<section>').attr('class', 'alb-rating-f').text(album.rating + ' / 10'));


                li.append(h)
                  .append(div)
                  .append(footer);
                mainContainer.append(li);       
            });
        });
    }



    return {
        listAlbums: listAllAlbums,

    }

})();