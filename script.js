const imagesFolder = "images_24"
document.getElementsByClassName("grid").item(0).style.backgroundImage = `url('static/${imagesFolder}/background.jpg')`

async function loadJSONFromFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  const nrOfCells = 25
  var todayCellInfo = null;
  const grid = document.querySelector(".grid");
  const currentDate = new Date();
  var parameter = 0;
  if (currentDate.getMonth() + 1 === 12) {
    parameter = parseInt(currentDate.getDate());

    //parameter = 17;
    // if (parameter > 24) {
    //   parameter = 24;
    // }

    const info = document.querySelector(".info-text");
    info.innerHTML = "Vajuta pildile all paremas nurgas, et näha seda suuremalt.";

  } else {
    const info = document.querySelector(".info-alert");
    info.innerHTML = "Esimene luuk avaneb juba 1.detsembril!";
  }
  var audioPlayers = [];
  const imageElement = document.createElement("img");
  imageElement.classList.add("image");

  // window.history.pushState({}, null, 'ho-ho-hoo!');

  function toggleCell(cell, audioPlayer, imageUrl) {
      imageElement.src = `static/${imagesFolder}/` + imageUrl;

      // var audioElem = document.querySelector(".audio-elem");
      // console.log(audioPlayer);
      // audioElem.src = audioPlayer.src;
      // audioElem.play();

      for (let player of audioPlayers) {
          if (player != audioPlayer) {
              player.pause();
              player.currentTime = 0; // Rewind to the start
              // Remove the "playing" class from all other cells
              const otherCell = player.parentElement;
              otherCell.classList.remove("playing");
          }
      }
      if (audioPlayer.paused) {
          audioPlayer.play();
          cell.classList.add("playing"); // Add the "playing" class
      } else {
          audioPlayer.pause();
          cell.classList.remove("playing"); // Remove the "playing" class
      }
  }

  function addMonitor(element, category, label) {
    element.addEventListener('click', function() {
      gtag('event', 'click', {
        'event_category': category,
        'event_label': label
      });
    });
  }

  try {
    const json = await loadJSONFromFile("text.json");

    for (let i = 1; i <= nrOfCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = i;

      if (i == nrOfCells) {
        addMonitor(cell, "img-cell-click", "img")

        cell.classList.add("image-container");
        let imgNr = parameter;
        if (imgNr > 24) {imgNr = 24};
        const imageUrl = `static/${imagesFolder}/` + json[imgNr - 1]['image'];
        imageElement.src = imageUrl;

        cell.appendChild(imageElement);

      } else {
        const textArea = document.createElement("div");
        textArea.classList.add("textArea");
        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = json[i - 1]['name'];
        textArea.appendChild(title);
        cell.appendChild(textArea);

        if (i <= parameter) {
          addMonitor(cell, "cell-click", "id")

          cell.classList.add("active");
          const textContent = document.createElement("p");
          textContent.textContent = json[i-1]['text'];
          textContent.classList.add("hidden-on-mobile");

          const audioPlayer = document.createElement("audio");
          audioPlayers.push(audioPlayer);
          audioPlayer.classList.add("audio-player");
          audioPlayer.src = "static/audio/" + json[i-1]['audio'];
          audioPlayer.controls = false;

          cell.addEventListener("click", function () {
            toggleCell(cell, audioPlayer, json[i-1]['image']);
          });

          textArea.appendChild(textContent);
          cell.appendChild(audioPlayer);

          if (i == parameter && i <= 25) {
            todayCellInfo = [cell, audioPlayer, json[i-1]['image']]
          }
        }
      }

      grid.appendChild(cell);

    }

    const calendar = document.querySelector(".grid");
    const imageContainer = document.querySelector(".image-container");
    const image = document.querySelector(".image");
    console.log(image);

    function toggleImageSize() {
      console.log('toggle', image);

      const isBigImage = calendar.querySelector("img.big-image");

      if (isBigImage) {
        image.style.opacity = 0;

        setTimeout(function () {
          image.classList.remove("big-image");
          image.remove();
          imageContainer.appendChild(image);
          image.style.opacity = 1;
        }, 1000);

      } else {
        image.classList.toggle("big-image");
        image.remove();
        calendar.appendChild(image);
        image.style.opacity = 0;

        setTimeout(function () {
          image.style.opacity = 1;
        }, 100);
      }
    }

    image.addEventListener("click", toggleImageSize);

    image.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });

    if (todayCellInfo != null) {
      toggleCell(todayCellInfo[0], todayCellInfo[1], todayCellInfo[2])
    } else {
      imageElement.src = `static/${imagesFolder}/24.jpg`;
    }

  } catch (error) {
    console.error("Overall error:", error);
  }
});

// For resizing image
document.addEventListener("DOMContentLoaded", function() {

});
