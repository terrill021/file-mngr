
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {

     document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        function onErrorLoadFs () {
            console.log("onErrorLoadFs")
        }

        function getSampleFile(dirEntry) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                if (this.status == 200) {

                    var blob = new Blob([this.response], { type: 'image/png' });
                    saveFile(dirEntry, blob, "downloadedImage.png");
                }
            };
            xhr.send();
        }

        function saveFile(dirEntry, fileData, fileName) {

            dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

                writeFile(fileEntry, fileData);

            }, (e) => {console.log("onErrorCreateFile", e )});
        }

        function writeFile(fileEntry, dataObj, isAppend) {

            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {

                fileWriter.onwriteend = function() {
                    console.log("Successful file write...");
                    if (dataObj.type == "image/png") {
                        readBinaryFile(fileEntry);
                    }
                    else {
                        readFile(fileEntry);
                    }
                };

                fileWriter.onerror = function(e) {
                    console.log("Failed file write: " + e.toString());
                };

                fileWriter.write(dataObj);
            });
        }


        function readBinaryFile(fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function() {

                    console.log("Successful file write: " + this.result);
                    console.log(fileEntry.fullPath + ": " + this.result);

                    var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
                    displayImage(blob);
                };

                reader.readAsArrayBuffer(file);

            }, (e) => {console.log("onErrorReadFile ", e)});
        }

        function displayImage(blob) {

            // Displays image if result is a valid DOM string for an image.
            var elem = document.getElementById('imageFile');
            // Note: Use window.URL.revokeObjectURL when finished with image.
            elem.src = window.URL.createObjectURL(blob);
        }    

        function displayImageByFileURL(fileEntry) {
            var elem = document.getElementById('imageFile');
            elem.src = fileEntry.toURL();
        }

        window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            getSampleFile(fs.root);

        }, onErrorLoadFs);
               
    }
};