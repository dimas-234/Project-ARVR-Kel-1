// variabel global untuk nilai awal counter
let score = 0;
// Komponen untuk menangani suara dan skor
AFRAME.registerComponent('tongkat-sound', {
  init: function () {
    const batSound = document.querySelector("#batSound"); // Mencari elemen suara
    const el = this.el;

    // Mendengarkan event 'collide' yang menandakan tabrakan
    el.addEventListener("collide", (event) => {
      // Cek jika yang bertabrakan adalah bola
      if (event.detail.body && event.detail.body.el && event.detail.body.el.id.startsWith('bola-')) {
        // Tingkatkan skor
        score++;
        console.log('Skor bertambah:', score);

        // Update teks skor di layar
        const scoreDisplay = document.querySelector('#score-display');
        scoreDisplay.setAttribute('value', `Score: ${score}`);

        // Putar suara saat tabrakan terdeteksi
        if (batSound) {
          batSound.play();
          console.log("Suara Bat Hits diputar!");
        } else {
          console.error("Suara Bat Hits tidak ditemukan.");
        }
      }
    });
  }
});

 // Komponen untuk tombol play
 AFRAME.registerComponent("play", {
    init: function () {
      const myEL = document.querySelector("#yellow"); // Elemen dengan komponen sound
      this.el.addEventListener("click", function () {
        if (myEL.components.sound) {
          myEL.components.sound.playSound(); // Memutar suara
          console.log("Lagu diputar");
        } else {
          console.error("Komponen sound tidak ditemukan pada elemen #yellow");
        }
      });
    },
  });

  // Komponen untuk tombol stop
  AFRAME.registerComponent("stop", {
    init: function () {
      const myEL = document.querySelector("#yellow"); // Elemen dengan komponen sound
      this.el.addEventListener("click", function () {
        if (myEL.components.sound) {
          myEL.components.sound.stopSound(); // Menghentikan suara
          console.log("Lagu dihentikan");
        } else {
          console.error("Komponen sound tidak ditemukan pada elemen #yellow");
        }
      });
    },
  });

  AFRAME.registerComponent('hapus-semua', {
    init: function () {
        const button = this.el; // Tombol pemicu
        const scene = document.querySelector('a-scene'); // Scene utama

        button.addEventListener('click', function () {
            // Cari semua objek dengan ID yang mengandung "bat-" atau "bola-"
            const bats = scene.querySelectorAll("[id^='bat-']");
            const bolas = scene.querySelectorAll("[id^='bola-']");

            // Hapus semua tongkat
            bats.forEach((bat) => {
                scene.removeChild(bat);
                console.log(`Menghapus tongkat: ${bat.id}`);
            });

            // Hapus semua bola
            bolas.forEach((bola) => {
                scene.removeChild(bola);
                console.log(`Menghapus bola: ${bola.id}`);
            });

            // Reset skor
            score = 0;
            const scoreDisplay = document.querySelector('#score-display');
            scoreDisplay.setAttribute('value', `Score: ${score}`);
            console.log('Semua tongkat, bola, dan skor telah direset!');
        });
    }
});

        AFRAME.registerComponent('tongkatgenerator', {
          init: function () {
              const button = this.el; // Akses tombol
              const scene = document.querySelector("a-scene"); // Akses scene utama
              let tongkatCounter = 0; // Counter untuk memberikan id unik pada tongkat
      
              button.addEventListener("click", function () {
                  // Buat elemen tongkat baru (GLTF sebagai parent)
                  const newTongkat = document.createElement("a-entity");
      
                  // Buat id unik untuk tongkat
                  const tongkatId = `bat-${tongkatCounter++}`;
                  newTongkat.setAttribute("id", tongkatId); // Tambahkan id unik
      
                  // Tambahkan atribut ke GLTF
                  newTongkat.setAttribute("gltf-model", "#bat");
                  newTongkat.setAttribute("position", "-50 1.2 40"); // Posisi awal
                  newTongkat.setAttribute("scale", "0.03 0.03 0.03");
                  newTongkat.setAttribute("rotation", "0 0 0");
                  newTongkat.setAttribute("class", "throwable");
      
                  // Tambahkan dynamic-body ke GLTF (fisik utama)
                  newTongkat.setAttribute("dynamic-body", {
                      mass: 3,
                      angularDamping: 0.9,
                      linearDamping: 0.5
                  });

                  // Tambahkan komponen 'tongkat-sound' untuk memutar suara saat tabrakan
                  newTongkat.setAttribute('tongkat-sound', '');
      
                  // Buat kerucut sebagai child untuk debug atau tambahan
                  const coneCollider = document.createElement("a-cone");
                  coneCollider.setAttribute("position", "0 -1.2 0"); // Posisi relatif terhadap GLTF
                  coneCollider.setAttribute("rotation", "180 0 0"); // Membalik kerucut
                  coneCollider.setAttribute("radius-top", "0.1"); // Bagian bawah lebih langsing
                  coneCollider.setAttribute("radius-bottom", "0.3"); // Bagian atas lebih lebar
                  coneCollider.setAttribute("height", "2.5"); // Tinggi kerucut
                  coneCollider.setAttribute("color", "grey"); // Opsional: debug
      
                  // Tambahkan kerucut ke GLTF
                  newTongkat.appendChild(coneCollider);
      
                  // Tambahkan tongkat ke dalam scene
                  scene.appendChild(newTongkat);
      
                  // Debug: Konfirmasi tongkat muncul
                  setTimeout(() => {
                      const tongkatBody = newTongkat.body;
                      if (tongkatBody) {
                          console.log(`Tongkat ${tongkatId} berhasil muncul dengan GLTF sebagai parent!`);
                      }
                  }, 100);
              });
          }
      });
       
      
  
        AFRAME.registerComponent("bolagenerator", {
          init: function () {
            const button = this.el; // Tombol pemicu
            const scene = document.querySelector("a-scene"); // Scene utama
            let bolaCounter = 0; // Counter untuk ID bola unik
  
            button.addEventListener("click", function () {
              let countdown = 3; // Waktu hitung mundur
              const countdownText = document.createElement("a-text"); // Elemen teks countdown
  
              // Tambahkan elemen teks countdown ke scene
              countdownText.setAttribute("value", `Get ready: ${countdown}`);
              countdownText.setAttribute("position", "-50 4 20");
              countdownText.setAttribute("color", "#FFFFFF");
              countdownText.setAttribute("align", "center");
              countdownText.setAttribute("scale", "3 3 3");
              scene.appendChild(countdownText);
  
              // Interval untuk mengupdate teks hitung mundur
              const interval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                  countdownText.setAttribute("value", `Get ready: ${countdown}`);
                } else {
                  // Hentikan interval dan hapus teks
                  clearInterval(interval);
                  scene.removeChild(countdownText);
  
                  // Buat bola baru setelah countdown selesai
                  const newBola = document.createElement("a-entity");
  
                  // Tambahkan ID unik untuk bola
                  const bolaId = `bola-${bolaCounter++}`;
                  newBola.setAttribute("id", bolaId);
  
                  // Tambahkan model GLTF
                  newBola.setAttribute("gltf-model", "#bola");
  
                  // Tentukan posisi acak ketinggian bola
                  const randomY = Math.random() + 3; // Ketinggian antara 3-4
                  newBola.setAttribute("position", `-50 ${randomY} 18`);
                  newBola.setAttribute("scale", "0.1 0.1 0.1");
  
                  // Tambahkan physics body dengan tipe sphere
                  newBola.setAttribute("dynamic-body", {
                    shape: "sphere", // Pastikan bentuknya sphere
                    mass: 0.3, // Massa bola
                    radius: 1
                  });
  
                  // Tambahkan kelas untuk identifikasi
                  newBola.setAttribute("class", "throwable");
  
                  // Tambahkan bola ke dalam scene
                  scene.appendChild(newBola);
  
                  // Tambahkan gaya dorongan ke bola setelah physics stabil
                  setTimeout(() => {
                    const bolaBody = newBola.body;
                    if (bolaBody) {
                      const force = new CANNON.Vec3(0, 0, 13);
                      bolaBody.applyImpulse(force, new CANNON.Vec3(0, 0, 0));
                      console.log(`Bola ${bolaId} muncul dan ditembakkan!`);
                    }
                  }, 100);
                }
              }, 1000); // Update setiap detik
            });
          },
        });
  
  
  
  
        AFRAME.registerComponent('refresh-obj', {
          init: function () {
            this.el.addEventListener('click', function () {
              var myGBcursor = document.querySelector('#myGBcursor');
              myGBcursor.components.raycaster.refreshObjects();
            });
          }
        });
  
        AFRAME.registerComponent("camera-fun", {
          init: function () {
            let rtWidth = 1024;
            let rtHeight = 768;
  
            // render the scene to this texture (which goes on to an object in a different scene; avoid "WebGL feedback loop error")
            this.renderTarget0 = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
            this.renderTarget0.texture.magFilter = THREE.NearestFilter;
            this.renderTarget0.texture.minFilter = THREE.NearestFilter;
            this.renderTarget0.texture.generateMipmaps = false;
  
            this.renderTarget1 = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
            this.renderTarget1.texture.magFilter = THREE.NearestFilter;
            this.renderTarget1.texture.minFilter = THREE.NearestFilter;
            this.renderTarget1.texture.generateMipmaps = false;
  
            // separate scene #1 for texture processing
            const quad = new THREE.Mesh(
              new THREE.PlaneGeometry(2, 2),
              new THREE.MeshBasicMaterial({ map: this.renderTarget0.texture }));
  
            this.rtScene = new THREE.Scene();
            this.rtScene.add(quad);
            this.rtCamera = new THREE.OrthographicCamera();
            this.rtCamera.position.z = 0.1;
  
            // aspect ratio corrections
            let renderer = this.el.sceneEl.renderer;
            let size = new THREE.Vector2();
            renderer.getSize(size);
  
            let box = document.getElementById("box");
            box.setAttribute("material", "src", this.renderTarget1.texture);
            box.setAttribute("width", size.x / size.y);
            box.setAttribute("depth", size.x / size.y);
  
            this.el.sceneEl.renderer.xr.addEventListener('sessionstart', function () {
              console.log("session started");
              renderer.getSize(size);
              box.setAttribute("width", size.x / size.y);
              box.setAttribute("depth", size.x / size.y);
            });
  
            this.el.sceneEl.renderer.xr.addEventListener('sessionend', function () {
              console.log("session ended");
              renderer.getSize(size);
              box.setAttribute("width", size.x / size.y);
              box.setAttribute("depth", size.x / size.y);
            });
  
  
          },
  
          tick: function (t, dt) {
            // temporarily disable XR to prevent screen flickering
            const scene = this.el.sceneEl.object3D;
            const camera = this.el.sceneEl.camera;
            const renderer = this.el.sceneEl.renderer;
            const currentRenderTarget = renderer.getRenderTarget();
            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
  
            renderer.xr.enabled = false;
            renderer.shadowMap.autoUpdate = false;
  
            // do extra rendering
  
            // make a copy of the main scene in target 0
            renderer.setRenderTarget(this.renderTarget0);
            renderer.render(scene, camera);
  
            // make a copy for rt1 which is used by an object in the main scene
            renderer.setRenderTarget(this.renderTarget1);
            renderer.render(this.rtScene, this.rtCamera);
  
            // enable XR
            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
            renderer.setRenderTarget(currentRenderTarget);
          }
        });