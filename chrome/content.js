chrome.paste_pass_clicked_element = null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	// console.log(request)
  	if(request.action === "speed_type"){
  		const selector = JSON.parse(request.selector);
			const inputElement = chrome.paste_pass_clicked_element || document.querySelector(typeof selector === "object" ? `${selector.tagName.toLowerCase()}${selector.type.length > 0 ? `[type=${selector.type}]`: ''}${selector.id.length > 0 ? `[id=${selector.id}]`: ''}${selector.name.length > 0 ? `[name=${selector.name}]`: ''}${selector.className.length > 0 ? `[class=${selector.className}]`: ''}` : 'input');
			if(inputElement){
				simulateTyping(inputElement, request.data, Number(request.speed) || 100);	
			}
  	}
  	// sendResponse("jess")
  	// chrome.runtime.sendMessage("sksk")
  }
);

document.addEventListener('click', (event) => {
	doSomething(event);
});

document.addEventListener('touchstart', (event) => {
	doSomething(event);
});


function doSomething(){
		if(event.target){
		if(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement){
			chrome.paste_pass_clicked_element = event.target;
			const speed_input = JSON.stringify({ tagName: event.target.tagName, id: event.target.id, name: event.target.name, type: event.target.type, className: event.target.className });
			console.log(speed_input)
			chrome.storage.local.set({ speed_input: speed_input }, function(){
				console.log("Saved speed input");
			});
			const input = event.target;
			const inputEvent = new Event('input', {
			  bubbles: true,
			  cancelable: true,
			});
			chrome.storage.local.get(['clickpaste', 'savedText', 'clipboard_allow'], function(result) {
				if(typeof result.clickpaste !== undefined && result.clickpaste){
					if(typeof result.clipboard_allow !== undefined && result.clipboard_allow){
				    	navigator.clipboard.readText().then((text) => {
				      		input.value += text || "No text saved";
				    	})
					}else{
			      		input.value += result.savedText || "No text saved";
					}
		      		input.dispatchEvent(inputEvent);
				}
	    	});
		}else if(!(event.target instanceof HTMLInputElement) && event.target.isContentEditable){
			const input = event.target;
			chrome.storage.local.get(['clickpaste', 'savedText', 'clipboard_allow'], function(result) {
				if(typeof result.clickpaste !== undefined && result.clickpaste){
					if(typeof result.clipboard_allow !== undefined && result.clipboard_allow){
				    	navigator.clipboard.readText().then((text) => {
				      		input.innerText += text || "No text saved";
				    	})
					}else{
			      		input.innerText += result.savedText || "No text saved";
					}
				}
	    	});
		}
	}
	if (!(document.querySelector(".custom-eye-button-paste-pass"))){
		showPasswordField()	
	}
}


function showPasswordField(){
	const fields = document.querySelectorAll("input[type=password]");
	const eye = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
	const eyeoff = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
	fields.forEach((field) => {
		const button = document.createElement("button");
		button.type = "button";
		button.classList.add("custom-eye-button-paste-pass")
		button.innerHTML = eye;

		button.addEventListener('click', function(){
			if(field.type === "text"){
				field.type = "password";
				button.innerHTML = eye;
			}else{
				field.type = "text";
				button.innerHTML = eyeoff;
			}
		})
		field.parentNode.insertBefore(button, field.nextSibling);
	})
}

showPasswordField()

function simulateTyping(inputElement, text = "", speed = 100) {
  let index = 0;

  function typeNextChar() {
    if (index < text.length) {
      inputElement.value += text[index];
      index++;
      setTimeout(typeNextChar, speed);
    }
  }

  typeNextChar();
}