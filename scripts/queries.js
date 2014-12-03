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
    function getObjectAndPointer(object, pointer, callback, filter, sort) {
        var arr = [];
        var unique = [];

        object = object.toLowerCase();

        var pointerObj = Parse.Object.extend(pointer);
        pointer = pointer.toLowerCase();

        query = new Parse.Query(pointerObj);
        query.include(object)
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

                  //http://stackoverflow.com/questions/3762589/fastest-javascript-summation of array

                  arr.sort(function (x, y) {
                      return y[sort.id].reduce(function (pv, cv) { return pv + cv; }, 0) / y[sort.id].length - x.rating.reduce(function (pv, cv) { return pv + cv; }, 0) / x.rating.length;
                  });
                  callback(arr);
              },

              error: function () {
                  console.log("Queries.getObjectAndPointer has error")
              }
          });
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
        getCommentsByPicture: getCommentsByPicture
    }
}());