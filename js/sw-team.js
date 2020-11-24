// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
        .register("/service-worker.js")
        .then(function() {
            console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(function() {
            console.log("Pendaftaran ServiceWorker gagal");
        });
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var isFromSaved = urlParams.get("saved");

    var save = document.getElementById("save");
    var delbtn = document.getElementById("delete");

    if (isFromSaved) {
        var item = getSavedTeamById();
    } else {
        var item = getTeamById();
    }

    save.onclick = function() {
        console.log("Tombol FAB Save di klik.");
        item.then(function(team) {
            saveForLater(team);
        });
    };

    delbtn.onclick = function() {
        console.log("Tombol FAB Delete di klik.");
        item.then(function(team) {
            delSavedTeam(team);
        });
    };
});
