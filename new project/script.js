let playmusic = new Audio();
let songs;
let queue = [];
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
//main function is responsible for fetching the music folder
async function main(folder) {
    let a = await fetch(`https://github.com/rohitsinghpanwar/Spotify-Clone-Web-Project/tree/main/new%20project/songs/${folder}/`);
    
    let response = await a.text();
    let b = document.createElement("div");
    b.innerHTML = response;
    let c = b.getElementsByTagName("a");
    songs = [];
    currfolder = folder;
    for (let i = 0; i < c.length; i++) {
        const element = c[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li class="music">
        
        <p>${song.replaceAll("%20", " ")}</p>
        <img class="img" id="panther" src="logo/play-button.png"  alt="">
        <img class="img" id="lion" src="logo/add.png"  alt="">
        </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.querySelector("#panther").addEventListener("click", element => {
            sang(e.querySelector("p").innerHTML.replaceAll(" ", "%20"))


        })
        e.querySelector("#lion").addEventListener("click", () => {
            queue.push(e.querySelector("p").innerHTML.replaceAll(" ", "%20"));
           if( confirm(`${e.querySelector("p").innerHTML} Added to Queue`)){
            queue.push(e.querySelector("p").innerHTML.replaceAll(" ", "%20"));
            e.style.background="green";
           }
            
        })
    })
    return songs;
}
// this funtion is the sole of whole website cause it plays the music
function sang(crakk, pause = false) {
    playmusic.src = `https://github.com/rohitsinghpanwar/Spotify-Clone-Web-Project/tree/main/new%20project/songs/${currfolder}/` + crakk;

    if (!pause) {
        playmusic.play()
        play.src = "logo/pause.svg"
        document.querySelector("#playpause").style.display = "flex";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(crakk)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
//main function is responsible for play,pause,previous,next and continue song play
async function playit() {
    await displayAlbums();
    play.addEventListener("click", () => {
        if (playmusic.paused) {
            playmusic.play()
            play.src = "logo/pause.svg"
        }
        else {
            playmusic.pause()
            play.src = "logo/play.svg"
        }
    })

    playmusic.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(playmusic.currentTime)} / ${secondsToMinutesSeconds(playmusic.duration)}`
        document.querySelector(".circle").style.left = (playmusic.currentTime / playmusic.duration) * 100 + "%";

    })
    document.querySelector("#volume").addEventListener("click", () => {
        if (!playmusic.muted) {
            volume.src = "logo/volume-x.svg"
            playmusic.muted = true;
        }
        else {
            volume.src = "logo/volume.svg"
            playmusic.muted = false;
        }

    })

    document.querySelector("#volbar").addEventListener("input", (e) => {
        playmusic.volume = parseInt(e.target.value) / 100
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        playmusic.currentTime = ((playmusic.duration) * percent) / 100
    })
    previous.addEventListener("click", () => {

        let index = songs.indexOf(playmusic.src.split(`/${currfolder}/`)[1]);
        let j = index - 1;
        if (j >= 0) {
            sang(songs[j]);
        }
    });
    next.addEventListener("click", () => {
        let index = songs.indexOf(playmusic.src.split(`/${currfolder}/`)[1]);

        let j = index + 1;
        if (j < songs.length) {
            sang(songs[j]);
        }
    });
    playmusic.onended = () => {
        if (queue.length > 0) {
            let i = 0;
            while(i<queue.length){
              sang(queue[i]);
              i++;
            }
            queue=[];
        }
        else {
            let index = songs.indexOf(playmusic.src.split(`/${currfolder}/`)[1]);
            let j = index + 1;
            if (j < songs.length) {

                sang(songs[j]);
            }
        }
        play.src="logo/play.svg";
    }
}
// this function is responsible for displaying contents of albums 
async function displayAlbums() {
    let a = await fetch("https://github.com/rohitsinghpanwar/Spotify-Clone-Web-Project/tree/main/new%20project/songs")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0];
            let foldersongs = await fetch(`http://127.0.0.1:5500/new%20project/songs/${folder}/info.json`);
            let response = await foldersongs.json();
            let cardcontainer = document.querySelector("#mdis");
            cardcontainer.innerHTML = cardcontainer.innerHTML + `
          <div class="card" data-folder="${folder}">
            <img src="https://github.com/rohitsinghpanwar/Spotify-Clone-Web-Project/tree/main/new%20project/songs/${folder}/cover.jpg" alt="">
            <i>${response.artist}</i>
            <i>${response.title}</i>
          </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await main(item.currentTarget.dataset.folder);

        })

    })
}
main("dua");
playit();

// const search = document.querySelector("input");
// search.addEventListener("input", () => {
//     // var audio=new Audio(`http://127.0.0.1:5500/new%20project/songs/${}.mp3`);
//     // audio.play();
// })
const cancel = document.querySelector("#cancel");
const header = document.querySelector("header");

function myFunction(x) {
    if (x.matches) {
        document.querySelector("#link").addEventListener("click", () => {
            header.style.height = "60vh"
            cancel.style.display = "initial"
        });
        cancel.addEventListener("click", () => {
            header.style.height = "16vh"
            cancel.style.display = "none";
        })

    }
}
var x = window.matchMedia("(orientation:portrait)")
myFunction(x);
x.addEventListener("change", function () {
    myFunction(x);
});

