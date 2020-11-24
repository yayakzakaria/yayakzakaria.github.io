const dbPromised = idb.open("football", 1, function(upgradeDb) {
  upgradeDb.createObjectStore("teams", {keyPath: "id"});
});

function saveForLater(team) {
  dbPromised
    .then(function(db) {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      console.log(team);
      store.put(team);
      return tx.complete;
    })
    .then(function() {
      M.toast({html: 'Berhasil disimpan!', classes: 'rounded'});
      console.log("Simpan berhasil.");
    });
}

function delSavedTeam(team) {
  dbPromised
    .then(function(db) {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      console.log("delSavedTeam: ");
      console.log(team);
      store.delete(team.id);
      return tx.complete;
    })
    .then(function() {
      M.toast({html: 'Berhasil dihapus!', classes: 'rounded'});
      console.log("Hapus berhasil.");
      window.history.back();
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        console.log("getById: " + id);
        return store.get(parseInt(id));
      })
      .then(function(team) {
        resolve(team);
      });
  });
}
