if (process.argv.slice(2).length == 0)
    return console.error(`You didn't give any arguments!`);

const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const args = process.argv.slice(2);
console.log(args)

ytdl.getBasicInfo(args[0], (e, i) => {
    console.log(e);
    if(e)
        throw new Error(`Error while getting audio info of video ${args[0]} - ${e.stack}`);

    try {
        const video = ytdl(args[0], {filter: "audioonly"});

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
                    process.exit();
                })
                .on('error', (err) => {
                    throw new Error(`An error occured within FFMPEG while downloading "${i.title}" - ${err.stack}`);
                });
        });
    } catch (err) {
        throw new Error(`Error while downloading video "${i.title}" (${args[0]}) - ${err.stack}`);
    }
});