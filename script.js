document.addEventListener("DOMContentLoaded", () => {
    // 1. 🌌 배경 파티클 및 은은한 연결선 이펙트 (Canvas)
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 45; // 파티클 개수

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.2 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function handleParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // 파티클 사이 거리가 가까우면 은은한 선으로 연결
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - distance / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(handleParticles);
    }
    handleParticles();

    // 2. 메인 타이틀 자동 타이핑 효과 (홈 화면 전용)
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = "";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        setTimeout(typeWriter, 300);
    }

    // 3. 📊 기술 스택 기간 계산 및 바(Bar) 그래프 렌더링
    const skillBoxes = document.querySelectorAll(".skill-box");
    // 현재 기준 날짜 (2026년 10월)
    const currentDate = new Date(2026, 9); 

    let skillData = [];

    skillBoxes.forEach(box => {
        let startStr = box.getAttribute("data-start");
        // HTML 오타 보정 ("2026-010" -> "2026-10")
        if (startStr === "2026-010") startStr = "2026-10";

        if (startStr) {
            const [yearStr, monthStr] = startStr.split("-");
            const startYear = parseInt(yearStr, 10);
            const startMonth = parseInt(monthStr, 10) - 1; // 0-based index (0~11)

            // 총 개월 수 계산
            let totalMonths = (currentDate.getFullYear() - startYear) * 12 + (currentDate.getMonth() - startMonth);
            if (totalMonths < 0) totalMonths = 0;

            skillData.push({ box, totalMonths });
        }
    });

    // 가장 기간이 긴 기술을 100% 기준으로 산정 (최소값 1보장)
    const maxMonths = Math.max(...skillData.map(item => item.totalMonths), 1);

    skillData.forEach(item => {
        const { box, totalMonths } = item;
        const durationEl = box.querySelector(".skill-duration");

        // 텍스트 포맷팅 (년/개월)
        let durationText = "";
        if (totalMonths === 0) {
            durationText = "Started this month";
        } else if (totalMonths < 12) {
            durationText = `Studying for ${totalMonths} months`;
        } else {
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;
            durationText = months === 0 ? `${years} year experience` : `${years} year and ${months} months of experience`;
        }

        if (durationEl) {
            durationEl.textContent = durationText;
        }

        // 바(Bar) 컨테이너 및 채우기 요소 동적 생성
        let barContainer = box.querySelector(".skill-bar-container");
        if (!barContainer) {
            barContainer = document.createElement("div");
            barContainer.className = "skill-bar-container";
            barContainer.style.cssText = "width: 100%; height: 5px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; margin-top: 10px; overflow: hidden;";

            const barFill = document.createElement("div");
            barFill.className = "skill-bar-fill";
            barFill.style.cssText = "height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); width: 0%; transition: width 1.2s cubic-bezier(0.1, 1, 0.1, 1); border-radius: 3px;";
            barContainer.appendChild(barFill);

            box.appendChild(barContainer);
        }

        // 비율 계산 (최소 6%는 보이도록 설정)
        const percentage = Math.round((totalMonths / maxMonths) * 100);
        const barFill = barContainer.querySelector(".skill-bar-fill");
        setTimeout(() => {
            barFill.style.width = `${Math.max(percentage, 6)}%`;
        }, 150);
    });

    // 4. 🌟 카드 3D 틸트 및 마우스 반사(Sheen) 효과
    const cards = document.querySelectorAll(".project-card, .skill-box, .contact-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = -((y - centerY) / centerY) * 12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition = "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });

        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });

    // 5. 🛞 Lenis 관성 부드러운 스크롤 효과
    const lenis = new Lenis({
        duration: 3, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
});
