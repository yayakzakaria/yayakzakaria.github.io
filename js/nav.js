document.addEventListener("DOMContentLoaded", function() {

  // Activate sidebar nav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(elm => 
          elm.innerHTML = xhttp.responseText
        );

        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => 
            elm.addEventListener("click", event => {
              // Tutup sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              // Muat konten halaman yang dipanggil
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            })
          );
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  // Load page content
  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);

  function loadPage(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        const content = document.querySelector("#body-content");
        
        if (page === "saved") {
          getSavedTeams();
        } else if (page !== "home") {
          getTotalStanding(page);
        }

        switch(this.status) {
          case 200:
            content.innerHTML = xhttp.responseText;
            break;
          case 404: 
            content.innerHTML = "<h2>Maaf, Halaman tidak ditemukan (404).</h2>";
            break;
          default:
            content.innerHTML = "<h2>Maaf, Halaman tidak dapat diakses.</h2>";
        }
      }
    };
    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();
  }
});
