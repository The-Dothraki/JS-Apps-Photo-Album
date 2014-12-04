var Actions = (function () {
    var Picture = Parse.Object.extend("Picture"),
        Category = Parse.Object.extend("Category"),
        Album = Parse.Object.extend("Album"),
        Comment = Parse.Object.extend("Comment"),
        sliderMargin = 0;

    function uploadPicture(name) {
        var file = validateFile('#image-file');
        var extension = getFileExtension(file.name);
        name += '.' + extension;
        file.name = name;

        var parseFile = new Parse.File(name, file);

        return parseFile;
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

    function addCommentToPicture(author, commentContent, picture) {
        var picComment;

        picComment = new PictureComment();
        picComment.set("author", author);
        picComment.set("commentContent", commentContent);
        picComment.set("picture", picture);

        return picComment.save();
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

    function sortPicturesByRating(picturesArray) {
        var fElement;
        var sElement;
        for (var i = 0; i < picturesArray.length; i++) {
            if (picturesArray[i].attributes.rating == undefined) {
                picturesArray.splice(i, 1);
                i--;
            }
        }
        for (i = 0; i < picturesArray.length-1; i++) {
            fElement = getNumAverage(picturesArray[i].attributes.rating);
            sElement = getNumAverage(picturesArray[i+1].attributes.rating);
            if (sElement > fElement) {
                var _tempSwap = picturesArray[i];
                picturesArray[i] = picturesArray[i+1];
                picturesArray[i+1] = _tempSwap;
                i = -1;
            }
        }
        return picturesArray;
    }

    function getNumAverage(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++){
            sum += parseInt(arr[i], 10);
        }
        return parseInt(sum / arr.length);
    }

    function sliderNext() {
        if (sliderMargin <= 750) {
            sliderMargin += 150;
        }
        else if (sliderMargin >= 750 && sliderMargin < 900) {
            sliderMargin = 900;
        }
        document.getElementById('carousel').style.marginLeft = "-"+sliderMargin+"px";
    }

    function sliderPrev() {
        if (sliderMargin >= 150) {
            sliderMargin -= 150;
        }
        else if (sliderMargin >= 0 && sliderMargin < 150) {
            sliderMargin = 0;
        }
        document.getElementById('carousel').style.marginLeft = "-"+sliderMargin+"px";
    }

    function getFileExtension (fileName) {
        var extension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();

        return extension;
    }

    function validateFile (inputId) {
        var fileUploadControl = $(inputId);
        var maxSize = fileUploadControl.data('max-size');

        if (fileUploadControl.get(0).files.length) {
            var fileSize = fileUploadControl.get(0).files[0].size / 1024;
            var file = fileUploadControl.get(0).files[0];

            if(fileSize <= maxSize) {
                var fileName = file.name;
                var extension = getFileExtension(fileName);
                var allowedExtensions = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];

                if (allowedExtensions.indexOf(extension) !== -1) {
                    return file;
                } else {                    
                    $('#allowed-file-types').css('color', 'red');
                    throw new Error('Invalid file format.');
                }
            } else {
                $('#max-file-size').css('color', 'red');
                throw new Error('File size is more then ' + maxSize + ' KB');
            }
        } else {
            throw new Error('Couldn\'t upload the picture!');
        }
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
        sortPicturesByRating: sortPicturesByRating,
        sliderNext: sliderNext,
        sliderPrev: sliderPrev
    }
}());