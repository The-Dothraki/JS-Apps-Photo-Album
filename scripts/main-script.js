function addPictureToAlbum() {
    var picName = "Snimka", // Get from input field
        picFile, // Get file before upload??
        albumId = "LAi8wXfsLm"; // Get from input field

    Queries.getObjectById("Album", albumId)
        .then(function(album) {
            Actions.addPictureToAlbum(picName, picFile, album);
        })
        .then(function(result) {
            console.log("Picture added to DB.");
        });
}

function createAlbum() {
    var albumName = "Album", // Get from input field
        categoryId = "ALkZwa2l2X"; // Get from select dropdown

    Queries.getObjectById("Category", categoryId)
        .then(function(category) {
            Actions.createAlbum(albumName, category);
        })
        .then(function(result) {
            console.log("Album created.");
        });
}

function createCategory() {
    var catName = "Cars"; // Get from input field

    Actions.createCategory(catName)
        .then(function(result) {
            console.log("Category created.");
        });
}
