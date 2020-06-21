const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
/*const cookiefile = require('cookiefile');

const cookiemap = new cookiefile.CookieMap('cookies.txt');
const cookies = cookiemap.toRequestHeader().replace('Cookie: ', '');
*/
require('events').EventEmitter.prototype._maxListeners = 100;

fs.readFile('./list.txt', (err, data) => {
    if(err)
        throw new Error(`Error while reading list - ${err.stack}`);
    const dataa = data.toString();

    if(dataa.length == 0)
        throw new Error(`The list is empty!`);

    const links = dataa.split(os.EOL);
    links.forEach(link => {
        dl(link).then(a => {
            console.log(`${link} done.`);
        });
    });
});

async function dl(a) {
    return new Promise((res, rej) => {
        ytdl.getBasicInfo(a, (e, i) => {
            console.log(e);
            if (e)
                throw new Error(`Error while getting audio info of video ${a} - ${e.stack}`);

            try {
                const video = ytdl(a, {filter: "audioonly"});

                console.log(`Downloading audio of "${i.title}" (${i.video_url})...`);

                video.pipe(fs.createWriteStream(path.resolve(path.join(__dirname, `./downloads/${i.title.replace(/[/\\?%*:|"<>]/g, '-')}.mp3`))));

                video.on('end', () => {
                    console.log(`Successfully finished downloading the audio of "${i.title}". Converting to ogg...`);

                    ffmpeg()
                        .input(`./downloads/${i.title.replace(/[/\\?%*:|"<>]/g, '-')}.mp3`)
                        .audioCodec('copy')
                        .withAudioCodec('libvorbis')
                        .save(`./downloads/${i.title.replace(/[/\\?%*:|"<>]/g, '-')}.ogg`)
                        .on('end', () => {
                            console.log(`Finished converting audio of "${i.title}" to ogg.`);
                            res();
                        })
                        .on('error', (err) => {
                            throw new Error(`An error occured within FFMPEG while downloading "${i.title}" - ${err.stack}`);
                        });
                });
            } catch (err) {
                throw new Error(`Error while downloading video "${i.title}" (${a}) - ${err.stack}`);
            }
        });
    });
}