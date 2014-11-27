var Actions = (function() {
    var Picture = Parse.Object.extend("Picture"),
        Category = Parse.Object.extend("Category"),
        Album = Parse.Object.extend("Album");

    function uploadPicture (name) {
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

    function addCommentToAlbum(album, comment) {
        // TODO:
    }

    function ratePicture(picture, rating) {
        // TODO:
    }

    function rateAlbum(album, rating) {
        // TODO:
    }

    return {
        uploadPicture: uploadPicture,
        addPictureToAlbum: addPictureToAlbum,
        createAlbum: createAlbum,
        createCategory: createCategory,
        addCommentToPicture: addCommentToPicture,
        addCommentToAlbum: addCommentToAlbum,
        ratePicture: ratePicture,
        rateAlbum: rateAlbum
    }
}());