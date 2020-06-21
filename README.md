# MusicConverter
A quick song downloader (YT -> MP3 &amp; OGG) and mapper (Minecraft sounds.json) written in Node.js

# How do I use this?
1. Grab [Node.js](https://nodejs.org) and also FFmpeg.
2. Edit the file list.txt and replace everything with the links you need (split by nextline)
3. Open up your terminal and type `npm install`.
4. Type `node index.js`, after that's done type `node metadata.js` and afterwards `node mapper.js`. These should be sufficient for you to do any work required. 

# How does it work?
> index.js
>> It downloads all the videos in the list simultaneously as MP3s and afterwards converts them into OGGs for Minecraft.

> metadata.js
>> It gets all the info for everything in the list from YouTube, and places them into metadata.json in order to place into [PrideUtils](https://github.com/BluSpring/PrideUtils) for the /play command.

> mapper.js
>> This tool maps the music files into Minecraft-ready sounds to place into a resource pack, and also maps them out into a sounds.json for Minecraft to use. If there are any issues during mapping, you may have to manually fix them.
