/*  
    This is a song mapper that maps a song from the downloads directory to
    a shortened version of the song file. Basically, here's how it works:

    The song "Porter Robinson - Something Comforting.ogg" will be copied over to the mcmusic directory,
    calling it "prsc.ogg".

    However, we won't be able to know what the song's name is, thus the song's name will be unable to be
    shown to the player. This mapper helps show what song file goes to what song.
*/

const fs = require('fs');

let quickMap = {};
let sounds = {};

fs.readdir('./downloads', (err, files) => {
    if(err)
        throw new Error(`Error while reading directory downloads - ${err.stack}`);

    if(files.length == 0)
        throw new Error(`The downloads folder is empty!`);

    Promise.all(files.map(file => {
        if(!file.endsWith('.ogg')) return;
        
        var shortened = shortenFile(file);
        fs.copyFile(`./downloads/${file}`, `./mcmusic/${shortened.shortened}`, (err) => {
            if(err)
                console.error(`An error occured while copying file ${file} - ${err.stack}`);

            console.log(`Mapped "${shortened.title}" to file "${shortened.shortened}"`);

            quickMap[shortened.shortened.replace('.ogg', '')] = shortened.title;
            fs.writeFileSync('./songmap.json', JSON.stringify(quickMap));
            sounds[`pride.music.${shortened.shorter}`] = {
                sounds: [
                    {
                        name: `pride/music/${shortened.shorter}`,
                        stream: true
                    }
                ]
            };
            fs.writeFileSync('./sounds.json', JSON.stringify(sounds));
            Promise.resolve();
        });
    }));
});

function shortenFile(file) {
    var shortenedFile = file.replace('.ogg', '').replace(/[-()_\[\]!]/g, '').split(/ /g).map(a => a[0]).join('').toLowerCase() + '.ogg';
    return {
        title: file.replace('.ogg', ''),
        shortened: shortenedFile,
        shorter: shortenedFile.replace('.ogg', '')
    };
}