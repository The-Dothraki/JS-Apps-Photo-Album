var Queries = (function () {
    var Object,
      query,
      resultsQuery;

    function getObjectById(object, objectId) {
        resultsQuery = undefined;

        Object = Parse.Object.extend(object);
        query = new Parse.Query(Object);
        query.equalTo("objectId", objectId);

        return query.first();
    }

    function getObjectsByName(object, objectName) {
        resultsQuery = undefined;

        Object = Parse.Object.extend(object);
        query = new Parse.Query(Object);
        query.equalTo("name", objectName);

        return query.find();
    }

    function getPicturesByAlbum(album) {
        resultsQuery = undefined;

        Picture = Parse.Object.extend("Picture");
        query = new Parse.Query(Picture);
        query.equalTo("album", album);

        return query.find();
    }

    function getCommentsByAlbum(album) {
        resultsQuery = undefined;

        Comment = Parse.Object.extend("Comment");
        query = new Parse.Query(Comment);
        query.equalTo("album", album);

        return query.find();
    }

    function calcRatingByObject(objectId) {
        //TODO
    }

    /* object, pointedObject are names of tables,
      example : object is album and pointer is picture
      execute callback with parameter JSON object
      filter is optional. Filter is array of two [a]
      sort is optional. sort is array of two parameters {sort : asceding/desending,id: id}
    */
    function getObjectAndPointer(Album, Picture, callback, filter, sort) {

        var Album = Parse.Object.extend(Album);
        var queryAlbum = new Parse.Query(Album);

        var Picture = Parse.Object.extend(Picture);
        var queryPicture = new Parse.Query(Picture);

        queryAlbum.find({
            success: function (albumsResult) {
                var albums = {};
                console.time("q");
                albumsResult.forEach(function (x) {
                    var temp = x.toJSON();
                    temp['picture'] = [];
                    albums[x.id] = temp;

                });
                queryPicture.find({
                    success: function (pictureResults) {
                        pictureResults.forEach(function (x) {
                            albums[x.attributes.album.id]['picture'].push(x.toJSON());
                        });
                        arr = [];
                        for (var prop in albums) {
                            arr.push(albums[prop]);
                        }
                        arr.sort(function (x, y) {
                            var a = typeof (x.rating) !== 'undefined' ? x.rating.reduce(function (pv, cv) { return parseInt(pv) + parseInt(cv); }, 0) / x.rating.length : -1;
                            var b = typeof (y.rating) !== 'undefined' ? y.rating.reduce(function (pv, cv) { return parseInt(pv) + parseInt(cv); }, 0) / y.rating.length : -1;

                            return a - b;
                        });

                        localStorage.albums = JSON.stringify(arr);
                        callback(arr);
                        console.timeEnd("q");
                    }
                });
            }
        })

    }

    function updateObjectArrayField(tableName, fieldID, tableRow, addValue, success, error) {

        var TableName = Parse.Object.extend(tableName);
        var tableName = new TableName();
        tableName.id = fieldID;

        // Set a new value on quantity
        tableName.add(tableRow, addValue);

        // Save
        tableName.save(null, {
            success: function (tableName) {
                success(tableName);
            },
            error: function (tableName, error) {
                console.log(error);

                // The save failed.
                // error is a Parse.Error with an error code and description.
            }
        });
    }

    function getLastSaveObject(tableName, callback) {
        var pointerObj = Parse.Object.extend(tableName);

        query = new Parse.Query(pointerObj);
        query.descending('updatedAt');
        query.first({
            success: function (result) {
                var arr = [];
                arr.push(result.toJSON());
                callback(arr);
            }
        })
    }

    function getCommentsByPicture(picture) {
        resultsQuery = undefined;

        PictureComment = Parse.Object.extend("PictureComment");
        query = new Parse.Query(PictureComment);
        query.equalTo("picture", picture);

        return query.find();
    }

    return {
        getObjectById: getObjectById,
        getObjectsByName: getObjectsByName,
        getPicturesByAlbum: getPicturesByAlbum,
        getObjectAndPointer: getObjectAndPointer,
        getCommentsByAlbum: getCommentsByAlbum,
        updateObjectArrayField: updateObjectArrayField,
        getLastSaveObject: getLastSaveObject,
<<<<<<< HEAD
        getCommentsByPicture: getCommentsByPicture
=======
>>>>>>> cfb07b0cd330e218c233488167248839a8cb7b2b
    }
}());

