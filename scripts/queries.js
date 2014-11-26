var Queries = (function() {
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
    (function () {
        Category = Parse.Object.extend("Category");
        var query = new Parse.Query(Category);
        query.find({
            success: function (results) {
                console.log(results);
                results.forEach(function (i) {
                    $(".categories-in-dropdown")
                        .append($('<option></option>')
                        .val(i.id)
                        .html(i.attributes.name));
                })
            }
        });

    })();

    return {
        getObjectById: getObjectById,
        getObjectsByName: getObjectsByName,
        getPicturesByAlbum: getPicturesByAlbum
    }
}());