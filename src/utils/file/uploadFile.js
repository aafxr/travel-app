import {MAX_UPLOAD_FILE_SIZE} from "../../static/constants";

const maxUploadFileSize = MAX_UPLOAD_FILE_SIZE

/**
 * @param {File} file
 * @returns {Promise<FileReader>}
 */
export default function uploadFile(file) {
    return /**@type {Promise<FileReader>}*/new Promise((resolve, reject) =>{
        if(file.size > maxUploadFileSize) {
            console.log("File Size Exceeded");
            return reject(new Error("File Size Exceeded"));
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onprogress = function (data) {
            if (data.lengthComputable) {
                let progress = parseInt( ((data.loaded / data.total) * 100), 10 );
                console.log("progress:"+progress);
            }
        }

        reader.onload = function() {
            console.log("SUCCESS!!!");
            console.log(reader);
            resolve(reader)
        };

        reader.onerror = function() {
            console.log(reader.error);
            return reject(reader.error)
        };
    })
}