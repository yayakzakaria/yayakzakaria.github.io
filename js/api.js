const base_url = "https://api.football-data.org/v2/";
const API_TOKEN = "87cc9939603d406da82e26ffc0569f87";

// Blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
  document.getElementById("body-content").innerHTML = "<h2>Failed to load data!</h2>";
  document.getElementById("body-content").innerHTML += "<p>Please check your internet connection.</p>";
}

// Blok kode untuk melakukan request data json
function getTotalStanding(page) {
  if ("caches" in window) {
    caches.match(base_url + `competitions/${page}/standings`).then(function(response) {
      if (response !== undefined) {
        console.log("caches: " + response);
        response.json().then(function(data) {
          let teamsHTML = "";
          console.log(data);
          data.standings.forEach(stands => {
            if(stands.type === "TOTAL") {
              stands.table.forEach(table => {
                console.log(table);
                teamsHTML += `
                    <div class="col s12 m6 l4">
                      <div class="card light-blue lighten-5 hoverable">
                        <a href="./team.html?id=${table.team.id}">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${table.team.crestUrl}" alt="Logo Club" />
                          </div>
                        </a>
                        <div class="card-content">
                          <span class="card-title truncate">${table.team.name}</span>
                          <p>Position: <b>${table.position}</b></p>
                          <p class="truncate">Form: ${table.form}</p>
                        </div>
                      </div>
                    </div>
                    `;
                  })
            }
          })
          document.getElementById("progress").style.display = 'none';
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        });
      }
    });
  }

  fetch(base_url + `competitions/${page}/standings`, {
      headers: { 'X-Auth-Token': API_TOKEN },
      dataType: 'json',
      type: 'GET'
    })
    .then(status)
    .then(json)
    .then(data => {
      // Menyusun komponen card secara dinamis
      let teamsHTML = "";
      console.log(data);
      data.standings.forEach(stands => {
        if(stands.type === "TOTAL") {
          stands.table.forEach(table => {
            console.log(table);
            teamsHTML += `
                <div class="col s12 m6 l4">
                  <div class="card light-blue lighten-5 hoverable">
                    <a href="./team.html?id=${table.team.id}">
                      <div class="card-image waves-effect waves-block waves-light">
                        <img src="${table.team.crestUrl}" alt="Logo Club" />
                      </div>
                    </a>
                    <div class="card-content">
                      <span class="card-title truncate">${table.team.name}</span>
                      <p>Position: <b>${table.position}</b></p>
                      <p class="truncate">Form: ${table.form}</p>
                    </div>
                  </div>
                </div>
                `;
              })
        }
      })
      document.getElementById("progress").style.display = 'none';
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function(resolve, reject) {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + `teams/${idParam}`).then(function(response) {
        if (response !== undefined) {
          console.log("caches: " + response);
          response.json().then(function(data) {
            console.log("from caches: " + data);
            let teamHTML = `
              <div class="card light-blue lighten-5">
                <div class="card-image waves-effect waves-block waves-light">
                  <img src="${data.crestUrl}" alt="Logo Club" />
                </div>
                <div class="card-content">
                  <span class="card-title">${data.name}</span>
                  <p>Address: ${data.address}</p>
                  <p>Club Color: ${data.clubColors}</p>
                </div>
              </div>
              `;
            document.getElementById("progress").style.display = 'none';
            document.getElementById("save").style.display = 'block';
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          })
          .catch(error);
        }
      });
    }

    fetch(base_url + `teams/${idParam}`, {
        headers: { 'X-Auth-Token': API_TOKEN },
        dataType: 'json',
        type: 'GET'
      })
      .then(status)
      .then(json)
      .then(function(data) {
        console.log(data);
        // Menyusun komponen card secara dinamis
        let teamHTML = `
          <div class="card light-blue lighten-5">
            <div class="card-image waves-effect waves-block waves-light">
              <img src="${data.crestUrl}" alt="Logo Club" />
            </div>
            <div class="card-content">
              <span class="card-title">${data.name}</span>
              <p>Address: ${data.address}</p>
              <p>Club Color: ${data.clubColors}</p>
            </div>
          </div>
        `;
        document.getElementById("progress").style.display = 'none';
        document.getElementById("save").style.display = 'block';
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = teamHTML;

        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      })
      .catch(error);
  });
}

function getSavedTeams() {
  getAll().then(function(teams) {
    console.log(teams);
    // Menyusun komponen card secara dinamis
    let teamsHTML = "";
    if (teams.length === 0) {
      teamsHTML = "<h2>No Data Saved Currently</h2>";
      teamsHTML += "<p>Please save at least one team to display here.</p>";
    } else {
      teams.forEach(team => {
        teamsHTML += `
                  <div class="col s12 m6 l4">
                    <div class="card light-blue lighten-5 hoverable">
                      <a href="./team.html?id=${team.id}&saved=true">
                        <div class="card-image waves-effect waves-block waves-light">
                          <img src="${team.crestUrl}" alt="Logo Club" />
                        </div>
                      </a>
                      <div class="card-content">
                        <span class="card-title truncate">${team.name}</span>
                        <p class="truncate">Address: ${team.address}</p>
                        <p>Club Color: ${team.clubColors}</p>
                      </div>
                    </div>
                  </div>
                  `;
      });
    }
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("teams").innerHTML = teamsHTML;
  });
}

function getSavedTeamById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  
  return getById(idParam).then(function(team) {
    console.log(team);

    let teamHTML = `
      <div class="card light-blue lighten-5">
        <div class="card-image waves-effect waves-block waves-light">
          <img src="${team.crestUrl}" alt="Logo Club" />
        </div>
        <div class="card-content">
          <span class="card-title">${team.name}</span>
          <p>Address: ${team.address}</p>
          <p>Club Color: ${team.clubColors}</p>
        </div>
      </div>
      `;
    document.getElementById("progress").style.display = 'none';
    document.getElementById("delete").style.display = 'block';
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;

    // Kirim objek data saved team agar bisa dihapus dari indexed db
    return(team);
  });
}
