// nomal js functions

function onClear() {
	document.getElementById("vipurl").value = "";
}

function onPlay() {
	var vipurl = document.getElementById("vipurl").value;
	if (vipurl == "") {
		alert("请输入视频链接");
	} else {
		var selectedStream = document.getElementById("stream");
		var streamurl = selectedStream.options[selectedStream.selectedIndex].value;
		var play = document.getElementById("play");
		play.src = streamurl + vipurl;
	}
}