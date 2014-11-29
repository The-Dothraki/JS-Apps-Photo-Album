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

    /* object, pointedObject are names of tables,
      example : object is album and pointer is picture
      return JSON
    */
    function getObjectAndPointer(object, pointer, callback) {
        var arr = [];
        var unique = [];

        object = object.toLowerCase();

        var parseObj = Parse.Object.extend(pointer);
        pointer = pointer.toLowerCase();

        new Parse.Query(parseObj)
          .include(object)
          .find({
              success: function (data) {
                  for (var i = 0; i < data.length; i++) {

                      var obj = data[i].get(object).toJSON();
                      var point = data[i].toJSON();

                      if (unique.indexOf(obj.objectId) === -1) {
                          obj[pointer] = [];
                          obj[pointer].push(point);
                          arr.push(obj);
                          unique.push(obj.objectId);
                      } else {
                          var result = arr.filter(function (x) {
                              return x.objectId == point[object].objectId;
                          });
                          result[0][pointer].push(point);
                      }
                  }
                  callback(arr);
              },

              error: console.log("Queries.getObjectAndPointer has error")
          });
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
        getPicturesByAlbum: getPicturesByAlbum,
        getObjectAndPointer: getObjectAndPointer
    }
}());