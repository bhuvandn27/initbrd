
document.addEventListener('DOMContentLoaded', function() {

    // --- Hero Animation ---
    var textWrapper = document.querySelector('.ml1 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: false})
      .add({
        targets: '.ml1 .line',
        scaleY: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700
      })
      .add({
        targets: '.ml1 .line',
        translateX: [0, document.querySelector('.ml1 .letters').getBoundingClientRect().width + 10],
        easing: "easeOutExpo",
        duration: 700,
        delay: 100
      }).add({
        targets: '.ml1 .letter',
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=775',
        delay: (el, i) => 34 * (i+1)
      }).add({
        targets: '.subtitle',
        opacity: [0, 1],
        translateY: [-20, 0],
        easing: "easeOutExpo",
        duration: 1000,
        offset: '-=500' // Starts this animation while the previous one is finishing
      }).add({
        targets: '.ml1',
        opacity: 1, // Keep it visible after animation
      });


    // --- Scroll Animations ---
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Confetti Animation ---
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];

    const colors = ["#d1603d", "#fdf6f6", "#f2b263", "#f29e63", "#f28a63"];

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 6 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: Math.random() * 4 + 2
        };
        this.alpha = 1;
        this.friction = 0.98;
    }

    Particle.prototype.draw = function() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    };

    Particle.prototype.update = function() {
        this.velocity.y += 0.05; // gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.005;
        this.draw();
    };

    function createParticles() {
        for (let i = 0; i < 200; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * -50));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            if (particle.alpha > 0) {
                particle.update();
            } else {
                particles.splice(index, 1);
            }
        });

        if (particles.length <= 100) { // Replenish
             for (let i = 0; i < 5; i++) {
                particles.push(new Particle(Math.random() * canvas.width, -50));
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    createParticles();
    animate();
});