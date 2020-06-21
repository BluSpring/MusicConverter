const ytdl = require('ytdl-core');
const fs = require('fs');
const os = require('os');

let metadatas = {};

fs.readFile("./list.txt", (e, d) => {
    const data = d.toString().split(os.EOL);
    data.forEach(link => {
        ytdl.getBasicInfo(link, (err, info) => {
            if (err)
                throw err;
            const short = shortenFile(info.title);
            metadatas[short.shortened] = {
                title: info.title,
                duration: info.length_seconds,
                url: info.video_url,
                uploader: info.player_response.videoDetails.author,
                short: short.shortened
            }

            fs.writeFileSync('./metadatas.json', JSON.stringify(metadatas));
            console.log(`Loaded and written metadata for "${info.title}"`);
        });
    });
});

function shortenFile(file) {
    var shortenedFile = file.replace(/[-()_\[\]!]/g, '').split(/ /g).map(a => a[0]).join('').toLowerCase();
    return {
        title: file,
        shortened: shortenedFile
    };
}