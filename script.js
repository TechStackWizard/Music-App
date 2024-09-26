console.log("Javascript for Spotify clone")
let currentSong = new Audio();
let songs;
let currfolder;
function convertSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0)
        return "00:00";
    // Calculate the number of minutes and seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // If remaining seconds are less than 10, add a leading zero for proper formatting
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }

    // Format the time as "minutes:seconds"
    return minutes + ":" + remainingSeconds;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`https://iamanshul91.github.io/Music-App/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let tds = div.getElementsByTagName('a')
    // console.log(tds)
    songs = [];
    for (let index = 0; index < tds.length; index++) {
        const element = tds[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = '';
    for (const song of songs) {
        // const songName = song.replace(".mp3", "").replaceAll("%20", " ");
        songUL.innerHTML = songUL.innerHTML + `<li class="bg-grey1 rounded">
                            <img class="invert logo-size" src="svgIMG/music.svg" alt="" srcset="">
                        <div class="songDetails">
                            <p>${song.replaceAll("%20", " ")}</p>
                            <p>Arjit Singh</p>
                        </div>
                        <div class="playControl flex">
                            <span>Playnow</span>
                            <img class="invert logo-size" src="svgIMG/playnow.svg" alt="" srcset="">
                        </div>
         </li>`;
    }
    // play a first song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songDetails").firstElementChild.innerHTML);
            playMusic(e.querySelector(".songDetails").firstElementChild.innerHTML);

        })
    });

    return songs;
    // console.log(songs)
}
const playMusic = (track, pause = false) => {
    
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        play.src = "svgIMG/pause.svg";
        currentSong.play();
    }
    // currentSong.play();
    // play.src = "svgIMG/pause.svg";
    const trackName = track.replace(".mp3", "");
    document.querySelector(".songInfo").innerHTML = decodeURI(trackName);
    document.querySelector(".duration").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    console.log("Display Albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchorTags = div.getElementsByTagName('a')
    // console.log(anchorTags)
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchorTags)
    // console.log(array)
    let libHeading = document.querySelector(".lib-heading");
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[1]
            // console.log(folder)
            let a = await fetch(`https://iamanshul91.github.io/Music-App/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card bg-grey1 rounded">

                        <img class="play" src="svgIMG/play.svg" alt="">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h5>${response.tittle}</h5>
                        <p>${response.discription}</p>
                        </div>`
        }
    }
    // load the playlist at the time of card clicked
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async item => {
            // if(screen.width)
            
            document.querySelector(".container-left").style.left = "0"
            document.querySelector(".cancel-btn").style.display = "initial"
            libHeading.children[1].innerHTML = item.currentTarget.dataset.folder.replaceAll("%20"," ")
            // console.log(item.currentTarget.dataset.folder.replaceAll("%20"," "));
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

}


async function main() {

    await getSongs("songs/Animal")
    playMusic(songs[0], true);
    // console.log(songs);

    // display all the albus on page
    displayAlbums();


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgIMG/pause.svg";

        }
        else {
            currentSong.pause();
            play.src = "svgIMG/playnow.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".duration").innerHTML = `${convertSecondsToTime(currentSong.currentTime)} / ${convertSecondsToTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    // Add eventListener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(e.offsetX, e.target.getBoundingClientRect())
        document.querySelector(".circle").style.left = (percent - 0.7) + "%";
        currentSong.currentTime = ((currentSong.duration) * (percent - 0.7)) / 100;
    })

    document.querySelector(".humburger").addEventListener("click", () => {
        // console.log("Humsbar clicked")
        document.querySelector(".container-left").style.left = "0"
        document.querySelector(".cancel-btn").style.display = "initial"
    })

    // Add event litener for close menu 
    document.querySelector(".cancel-btn").addEventListener("click", () => {
        document.querySelector(".container-left").style.left = "-100%"
    })

    // Add event litener for prvious song 
    previous.addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        console.log(decodeURI(currentSong.src), index)


    })
    // Add event litener for next song 
    next.addEventListener("click", () => {
        // currentSong.pause();
        console.log("Next Clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        console.log(decodeURI(currentSong.src), index)
        currentSong.play();


    })

    volumeline.addEventListener("change", (e) => {
        console.log(e.target.value);
        currentSong.volume = e.target.value / 100;
    })

    document.querySelector(".volume img").addEventListener("click", e=>{
        console.log(e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
            currentSong.volume = .6;
        }
    })
}

main()
