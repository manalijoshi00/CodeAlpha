let track_art = document.querySelector(".track-art");
let title = document.querySelector(".title");
let artist = document.querySelector(".artist");

let playpauseBtn = document.querySelector(".playpause-track");
let nextBtn = document.querySelector(".next-track");
let prevBtn = document.querySelector(".prev-track");

let barIcon = document.querySelector(".fa-bars");
let closeIcon = document.querySelector(".fa-times");

let musicPlaylist = document.querySelector(".music-playlist");
let playlistDiv = document.querySelector(".playlist-div");
let playList = document.querySelector(".playlist");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let wave = document.getElementById("wave");

let randomIcon = document.querySelector(".fa-random");

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement("audio");

barIcon.addEventListener("click", showPlayList);
closeIcon.addEventListener("click", hidePlayList);

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();

  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  title.textContent = track_list[track_index].name;
  artist.textContent = track_list[track_index].singer;

  updateTimer = setInterval(setUpdate, 1000);
  
  curr_track.addEventListener("ended", nextTrack);

}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);

function randomTrack() {
  console.log('Random button clicked');
  isRandom = !isRandom;
  if (isRandom) {
    randomIcon.classList.add('random-active');
  } else {
    randomIcon.classList.remove('random-active');
  }
}

function repeatTrack() {
  let curr_index = track_index;
  loadTrack(curr_index);
  playTrack();
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  track_art.classList.add('rotate');
  wave.classList.add('loader');
  playpauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  track_art.classList.remove('rotate');
  wave.classList.remove('loder')
  playpauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() { 
  if (isRandom) {
      playRandom();
  } else {
    if (track_index < track_list.length - 1)
      track_index += 1;
    else track_index = 0;
    loadTrack(track_index);
    playTrack();
  }
}

randomIcon.addEventListener('click', randomTrack);

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// Show PlayList
function showPlayList() {
  musicPlaylist.style.transform = "translateX(0)";
}
// Hide PlayList
function hidePlayList() {
  musicPlaylist.style.transform = "translateX(-100%)";
}

//Display Tracks in playlist
let counter = 1;
function displayTracks() {
  for (let i =0; i < track_list.length; i++) {
    console.log(track_list[i].name);
    let div = document.createElement("div");
    div.classList.add("playlist");
    div.innerHTML =  `
        <span class="song-index">${counter++}</span>
        <p class="single-song">${track_list[i].name}</p>
    `;
    playlistDiv.appendChild(div);
  }
  playFromPlaylist();
}

displayTracks();

//play song from the playlist
function playFromPlaylist() {
  playlistDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
    //  alert(e.target.innerHTML);
        let indexNum = track_list.findIndex((item, index) => {
          if (item.name === e.target.innerHTML) {
              return true;
          }
        });
        loadTrack(indexNum);
        playTrack();
        hidePlayList();
    }
  });
} 
