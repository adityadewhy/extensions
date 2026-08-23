
chrome.action.onClicked.addListener((tab) => {
  rotate(tab);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "rotate_videos") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) rotate(tabs[0]);
    });
  }
});

function rotate(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: rotateVideos
  });
}

function rotateVideos() {
  document.querySelectorAll("video").forEach(v => {
    let angle = parseInt(v.dataset.angle || "0", 10);
    angle = (angle + 90) % 360;
    v.dataset.angle = angle;

    v.style.transform = `rotate(${angle}deg)`;
    v.style.transformOrigin = "center center";
  });
}
