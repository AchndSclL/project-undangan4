// Fungsi untuk men-disable scroll
 // Fungsi untuk men-disable scroll
 function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

// Fungsi untuk men-enable scroll
function enableScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

// Jalankan saat DOM sudah siap
document.addEventListener('DOMContentLoaded', function () {
  disableScroll(); // Kunci scroll saat pertama kali dimuat

  const openBtn = document.getElementById('openInvitation');
  const audio = document.getElementById('bgMusic');

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      enableScroll(); // Aktifkan scroll kembali

      // Coba mainkan musik
      if (audio) {
        audio.play().catch(function (error) {
          console.warn('Audio gagal diputar otomatis:', error);
        });
      }
    });
  }
});










// Fungsi untuk Nama Tamu yang Diundang
// Ambil query parameter dari URL
function getGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  return guestName;
}

// Tampilkan nama tamu jika ada
document.addEventListener('DOMContentLoaded', () => {
  const guestElement = document.querySelector('.guest-name');
  const guestName = getGuestName();

  if (guestName && guestElement) {
    guestElement.textContent = decodeURIComponent(guestName.replace(/\+/g, ' '));
  }
});



const weddingDate = new Date("2026-01-31T08:00:00").getTime();
  const countdownFunc = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  };
  setInterval(countdownFunc, 1000);





// Coppy Nomber
// Update tampilan rekening saat dropdown dipilih
// Tampilkan nomor rekening saat dipilih
function showSelectedAccount() {
  const select = document.getElementById("accountSelect");
  const display = document.getElementById("displayAccount");
  const selectedValue = select.value;

  if (selectedValue) {
    display.innerText = selectedValue;
    display.style.display = "block";
  } else {
    display.innerText = "";
    display.style.display = "none";
  }
}

// Salin nomor rekening ke clipboard
function copyAccountNumber() {
  const select = document.getElementById("accountSelect");
  const accountValue = select.value;
  const copySuccess = document.getElementById("copySuccess");

  if (!accountValue) {
    alert("Silakan pilih bank terlebih dahulu.");
    return;
  }

  // Salin ke clipboard
  navigator.clipboard.writeText(accountValue).then(() => {
    copySuccess.style.opacity = "1";

    setTimeout(() => {
      copySuccess.style.opacity = "0";
    }, 2000);
  }).catch(err => {
    console.error("Gagal menyalin:", err);
    alert("Gagal menyalin nomor rekening.");
  });
}


// RSVP Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rsvp-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const attendance = document.getElementById('attendance').value;

    if (!name || !attendance) {
      alert('Mohon lengkapi semua kolom.');
      return;
    }

    // Simpan ke localStorage
    const rsvpData = { name, attendance, timestamp: new Date().toISOString() };
    localStorage.setItem('rsvp', JSON.stringify(rsvpData));

    // Kirim ke Google Sheets
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz2Fa4FjFPJq20_ilaFDR3rxo8ml2tSHKXgVdyw1DPytm-M-asqQ1OMHmxtMYPZU8cDJw/exec';
    fetch(scriptURL, {
      method: 'POST',
      body: new URLSearchParams(rsvpData)
    })
    .then(response => {
      if (response.ok) {
        alert('Terima kasih! Kehadiran Anda telah dikonfirmasi.');
        form.reset();
      } else {
        throw new Error('Gagal mengirim data ke Google Sheets');
      }
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert('Terjadi kesalahan saat mengirim data. Coba lagi nanti.');
    });
  });
});

// Wedding Gift Dropdown Handler
function showSelectedAccount() {
  const select = document.getElementById('accountSelect');
  const display = document.getElementById('displayAccount');
  const selectedValue = select.value;

  if (selectedValue) {
    display.textContent = selectedValue;
  } else {
    display.textContent = '';
  }
}

// GuestWish
document.addEventListener("DOMContentLoaded", function () {
  // ======================== GUEST WISH ========================
  const form = document.getElementById("guestWishForm");
  const nameInput = document.getElementById("guestWishName");
  const messageInput = document.getElementById("guestWishMessage");
  const wishList = document.getElementById("wishList");
  const wishCounter = document.getElementById("wishCountValue");

  const scriptURL = "https://script.google.com/macros/s/AKfycbyp24McIhCmZTjo6HJp4BYfpwPcUOZHn4L1A4X6j-ntFuuie5a4ioejUwyjEXqa0HYtaw/exec";
  const renderedWishes = new Set();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name && message) {
      const wish = { name, message };
      sendToGoogleSheets(wish);
      form.reset();
    }
  });

  function addGuestWish({ name, message }) {
    const uniqueKey = `${name}::${message}`.toLowerCase();
    if (renderedWishes.has(uniqueKey)) return;

    const wishItem = document.createElement("div");
    wishItem.classList.add("wish-item");
    wishItem.innerHTML = `
      <p class="wish-message">"${message}"</p>
      <p class="wish-name">- ${name}</p>
    `;
    wishList.prepend(wishItem);
    renderedWishes.add(uniqueKey);
    updateWishCount();
  }

  function updateWishCount() {
    const count = document.querySelectorAll("#wishList .wish-item").length;
    wishCounter.textContent = count;
  }

  function sendToGoogleSheets(wish) {
    const formData = new FormData();
    formData.append("nama", wish.name);
    formData.append("pesan", wish.message);

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
      .then(() => {
        addGuestWish(wish);
      })
      .catch((error) => {
        console.error("Gagal mengirim ke Google Sheets:", error);
      });
  }

  function loadWishesFromGoogleSheets() {
    fetch(scriptURL)
      .then(res => res.json())
      .then(data => {
        data.reverse().forEach(wish => {
          addGuestWish({
            name: wish.nama,
            message: wish.pesan
          });
        });
      })
      .catch(err => console.error("Gagal mengambil data:", err));
  }

  loadWishesFromGoogleSheets();
});



// Sidebar

document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");
  const closeBtn = document.querySelector(".close-btn");
  const navbar = document.querySelector(".navbar-container");

  // Tampilkan Sidebar
  menuBtn.addEventListener("click", function () {
      sidebar.classList.add("show");
      navbar.classList.add("hide"); // Sembunyikan Navbar
  });

  // Tutup Sidebar
  closeBtn.addEventListener("click", function () {
      sidebar.classList.remove("show");
      navbar.classList.remove("hide"); // Tampilkan kembali Navbar
  });

  // Klik di luar sidebar untuk menutup
  document.addEventListener("click", function (event) {
      if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
          sidebar.classList.remove("show");
          navbar.classList.remove("hide");
      }
  });
});






  
  // Fungsi untuk email newsletter-form
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".newsletter-form");
    const emailInput = form.querySelector("input[type='email']");
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwVGxETEraLWcq5Np1llVlwnvjOIA2FFVlBUkuRXEJtrxvCVtXwCY2-G_q5mk6OwOwR/exec"; // Ganti dengan URL kamu

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email || !email.includes("@gmail.com")) {
        alert("Mohon masukkan alamat Gmail yang valid.");
        return;
      }

      // Simpan ke localStorage
      let savedEmails = JSON.parse(localStorage.getItem("newsletterEmails")) || [];
      savedEmails.push(email);
      localStorage.setItem("newsletterEmails", JSON.stringify(savedEmails));

      // Kirim ke Google Sheets
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(email)}`
      })
      .then(() => {
        alert("Terima kasih telah mendaftar!");
        form.reset();
      })
      .catch((error) => {
        console.error("Gagal mengirim ke Google Sheets:", error);
        alert("Terjadi kesalahan. Silakan coba lagi nanti.");
      });
    });
  });



  // Fungsi untuk contact whatsapp footer-section contact
  document.addEventListener("DOMContentLoaded", () => {
    const contactButton = document.querySelector(".contact-button");
    const phoneNumber = "+62 895-2348-4553";  // Ganti dengan nomor WhatsApp yang sesuai
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;  // Format link WhatsApp

    contactButton.addEventListener("click", (e) => {
      e.preventDefault();
      // Arahkan ke WhatsApp
      window.open(whatsappUrl, "_blank");
    });
  });







  // =======================
// DISABLE / ENABLE SCROLL
// =======================
// ======================= 
// DISABLE / ENABLE SCROLL
// =======================
function disableScroll() {
  document.body.classList.add('no-scroll');
}

function enableScroll() {
  document.body.classList.remove('no-scroll');
}

// =======================
// FUNGSI BUKA UNDANGAN
// =======================
let musicPlayed = false;

function openInvitation() {
  enableScroll();

  // Sembunyikan cover / hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.style.display = 'none';
  }

  // Aktifkan tombol musik
  const musicBtn = document.getElementById('musicToggle');
  if (musicBtn) {
    musicBtn.disabled = false;
    musicBtn.style.opacity = 1;
    musicBtn.style.pointerEvents = 'auto';
  }

  // Mulai musik (hanya sekali)
  if (!musicPlayed) {
    startMusic();
  }
}

// =======================
// BACKGROUND MUSIC SYSTEM
// =======================
function startMusic() {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music || !toggle) return;

  // Fade-in volume
  function fadeInAudio(audio) {
    audio.volume = 0;
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 1) {
        vol += 0.05;
        audio.volume = Math.min(vol, 1);
      } else {
        clearInterval(fade);
      }
    }, 100);
  }

  // Autoplay music (jika diizinkan)
  const tryAutoPlay = () => {
    music.play().then(() => {
      toggle.classList.add("playing");
      fadeInAudio(music);
    }).catch(() => {
      console.log("Autoplay diblokir oleh browser. Menunggu interaksi pengguna.");
    });
  };

  // Klik manual untuk toggle musik
  toggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => {
        toggle.classList.add("playing");
        fadeInAudio(music);
      }).catch((err) => {
        console.error("Gagal memutar musik:", err);
      });
    } else {
      music.pause();
      toggle.classList.remove("playing");
    }
  });

  // Fallback: play setelah klik pertama
  const interactionHandler = () => {
    if (music.paused) {
      music.play().then(() => {
        toggle.classList.add("playing");
        fadeInAudio(music);
      });
    }
    document.removeEventListener("click", interactionHandler);
  };
  document.addEventListener("click", interactionHandler);

  tryAutoPlay();
  musicPlayed = true;
}

// =======================
// INIT SAAT HALAMAN DIBUKA
// =======================
window.addEventListener("DOMContentLoaded", () => {
  disableScroll(); // Kunci scroll

  // Nonaktifkan tombol musik sementara
  const musicBtn = document.getElementById('musicToggle');
  if (musicBtn) {
    musicBtn.disabled = true;
    musicBtn.style.opacity = 0.5;
    musicBtn.style.pointerEvents = 'none';
  }

  // Deteksi tombol "Buka Undangan"
  const openBtn = document.getElementById('openInvitation');
  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }
});



  // Javascript Untuk Refresh Langsung Ke Cover Halamanan Undangan
  window.addEventListener("load", function () {
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "auto" }); // atau "smooth" kalau mau animasi
    }
  });


  window.addEventListener("load", function () {
    setTimeout(() => {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "auto" });
      }
    }, 300); // Delay 300ms
  });





  

  
