var Actions = (function () {
    var Picture = Parse.Object.extend("Picture"),
        Category = Parse.Object.extend("Category"),
        Album = Parse.Object.extend("Album"),
        Comment = Parse.Object.extend("Comment");

    function uploadPicture(name) {
        var fileUploadControl = document.getElementById("image-file");

        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var parseFile = new Parse.File(name, file);

            return parseFile;
        } else {
            throw new Error('Couldn\'t upload the picture!');
        }
    }

    function addPictureToAlbum(name, file, album) {
        var pic = new Picture();

        pic.set("name", name);
        pic.set("file", file);
        pic.set("album", album);

        return pic.save();
    }

    function createCategory(name) {
        var cat;

        cat = new Category();
        cat.set("name", name);

        return cat.save();
    }

    function createAlbum(name, category) {
        var album;

        album = new Album();
        album.set("name", name);
        album.set("category", category);

        return album.save();
    }

    function addCommentToPicture(picture, comment) {
        // TODO:
    }

    function addCommentToAlbum(commentOf, commentContent, album) {
        var comm = new Comment();

        comm.set("commentOf", commentOf);
        comm.set("commentContent", commentContent);
        comm.set("album", album);

        return comm.save();
    }

    function ratePicture(pictureId, rating, success, error) {
        Queries.updateObjectArrayField("Picture", pictureId, "rating", rating, success, error);
    }

    function rateAlbum(albumId, rating, success, error) {
        Queries.updateObjectArrayField("Album", albumId, "rating", rating, success, error);
    }

    function listAlbums() {
        Queries.getObjectAndPointer("Album", "Picture", function (result) {
            Dom.listAlbums(result)
        },
        null,
        { id: 'rating' }
        );

    }

    return {
        uploadPicture: uploadPicture,
        addPictureToAlbum: addPictureToAlbum,
        createAlbum: createAlbum,
        createCategory: createCategory,
        addCommentToPicture: addCommentToPicture,
        addCommentToAlbum: addCommentToAlbum,
        ratePicture: ratePicture,
        rateAlbum: rateAlbum,
        listAlbums: listAlbums,
    }
}());