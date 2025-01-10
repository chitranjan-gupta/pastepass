document.addEventListener("DOMContentLoaded", function() {
  const saveBtn = document.getElementById("save-btn");
  const textInput = document.getElementById("copy-text");
  const clickpaste = document.getElementById("click-paste");
  const clipboard = document.getElementById('clipboard-text');
  const readBtn = document.getElementById('read-btn');
  const writeBtn = document.getElementById('write-btn');
  const clipboard_allow = document.getElementById('allow-clipboard');
  const speedBtn = document.getElementById('speed-btn');
  const loadBtn = document.getElementById('load-btn');
  const speed = document.getElementById('speed');

  chrome.storage.local.get(['clickpaste', 'savedText', 'clipboard_allow'], function(result) {
    if (result.clickpaste) {
      if(clickpaste){
        clickpaste.checked = result.clickpaste;
      }
    }
    if (result.savedText) {
      if(textInput){
        textInput.value = result.savedText;        
      }
    }
    if (result.clipboard_allow){
      if (clipboard_allow){
        clipboard_allow.checked = result.clipboard_allow;
      }
    }
  });

  saveBtn.addEventListener("click", function() {
    const text = textInput.value;
    chrome.storage.local.set({ savedText: text }, function () {
      console.log('Text saved!');
    });
  });

  readBtn.addEventListener('click', async function(){
    try{
      const text = await navigator.clipboard.readText();
      clipboard.value = text;
    }catch(err){
      console.log(err);
    }
  })

  writeBtn.addEventListener('click', async function(){
    try {
      await navigator.clipboard.writeText(clipboard.value || '');
    } catch (err) {
      console.log(err);
    }
  })

  speedBtn.addEventListener('click', async function(){
    try {
      chrome.storage.local.get(['speed_input'], async function(result){
        console.log(result)
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, { action: "speed_type", data: textInput.value, selector: result.speed_input || "input", speed: speed.value });
      });
    } catch (err) {
      console.log(err);
    }
  })

  loadBtn.addEventListener('click', async function(){
    try {
      const text = await navigator.clipboard.readText();
      textInput.value = text;
    } catch (err) {
      console.log(err);
    }
  })

  clickpaste.addEventListener('change', function(){
    chrome.storage.local.set({ clickpaste: clickpaste.checked }, function() {
      console.log(`Checkbox state saved: ${clickpaste.checked}`);
    });
  })

  clipboard_allow.addEventListener('change', function(){
    chrome.storage.local.set({ clipboard_allow: clipboard_allow.checked }, function() {
      console.log(`Checkbox state saved: ${clipboard_allow.checked}`);
    });
  })
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
  }
);