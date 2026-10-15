document.addEventListener("DOMContentLoaded", () => {
    // 1. 🌌 배경 파티클 및 옅은 점선 연결선 이펙트 (Canvas)
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 75; // 파티클 개수

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
    
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < 130) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / 130)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    
                    ctx.setLineDash([2, 4]); 
                    
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    
                    ctx.setLineDash([]); 
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

    const skillContainer = document.querySelector(".about-block .project-grid");
    if (skillContainer) {
        const boxesArray = Array.from(skillContainer.querySelectorAll(".skill-box"));
        boxesArray.sort((a, b) => {
            const dateA = a.getAttribute("data-start") || "9999-99";
            const dateB = b.getAttribute("data-start") || "9999-99";
            return dateA.localeCompare(dateB);
        });
        boxesArray.forEach(box => skillContainer.appendChild(box));
    }
    
    const currentDate = new Date(2026, 9); 

    let skillData = [];

    skillBoxes.forEach(box => {
        let startStr = box.getAttribute("data-start");
        if (startStr === "2026-010") startStr = "2026-10";

        if (startStr) {
            const [yearStr, monthStr] = startStr.split("-");
            const startYear = parseInt(yearStr, 10);
            const startMonth = parseInt(monthStr, 10) - 1;

            let totalMonths = (currentDate.getFullYear() - startYear) * 12 + (currentDate.getMonth() - startMonth);
            if (totalMonths < 0) totalMonths = 0;

            skillData.push({ box, totalMonths });
        }
    });

    const maxMonths = Math.max(...skillData.map(item => item.totalMonths), 1);

    skillData.forEach(item => {
        const { box, totalMonths } = item;
        const durationEl = box.querySelector(".skill-duration");

        let durationText = "";
        if (totalMonths === 0) {
            durationText = "Started this month";
        } else if (totalMonths < 12) {
            durationText = totalMonths === 1 ? `${totalMonths} month` : `${totalMonths} months`;
        } else {
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;
            durationText = months === 0 ? `${years} yr` : `${years} yr ${months} mo`;
        }

        if (durationEl) {
            durationEl.textContent = durationText;
        }

        let barContainer = box.querySelector(".skill-bar-container");
        if (!barContainer) {
            barContainer = document.createElement("div");
            barContainer.className = "skill-bar-container";
            barContainer.style.cssText = "width: 100%; height: 5px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; margin-top: 10px; overflow: hidden;";

            const barFill = document.createElement("div");
            barFill.className = "skill-bar-fill";
            barFill.style.cssText = "height: 100%; background: linear-gradient(90deg, #808080, #FFFFFF); width: 0%; transition: width 1.2s cubic-bezier(0.1, 1, 0.1, 1); border-radius: 3px;";
            barContainer.appendChild(barFill);

            box.appendChild(barContainer);
        }

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
            card.style.transition = "none";
            
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
    let lenis = null;
    
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.5, 
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 6. 📌 페이지 내 모든 주요 요소들에 순서(--i) 번호 부여
    const profileHero = document.querySelector(".profile-hero");
    if (profileHero) {
        Array.from(profileHero.children).forEach((child, index) => {
            child.style.setProperty('--i', index);
        });
    }

    const pageSections = document.querySelectorAll(".page-container > section");
    pageSections.forEach(section => {
        Array.from(section.children).forEach((child, index) => {
            child.style.setProperty('--i', index);
        });
    });

    const itemContainers = document.querySelectorAll(".project-grid, .about-details, .contact-links-list, main section div div");
    itemContainers.forEach(container => {
        const items = container.querySelectorAll(":scope > .project-card, :scope > .skill-box, :scope > .contact-card, :scope > .about-block, :scope > .contact-row, :scope > .team-member-card");
        if (items.length > 0) {
            items.forEach((item, index) => {
                item.style.setProperty('--i', index);
            });
        }
    });

    const footer = document.querySelector("footer");
    if (footer) {
        footer.style.setProperty('--i', 5); 
    }

    // 7. ✨ 스크롤이 해당 영역에 도달했을 때만 애니메이션이 실행되도록 하는 Intersection Observer 적용
    const animatedElements = document.querySelectorAll(`
        .project-card, 
        .skill-box, 
        .contact-card, 
        .about-block, 
        .contact-row, 
        .team-member-card,
        .profile-hero h1,
        .profile-hero h2,
        .profile-hero h3,
        .profile-hero p,
        .page-container h2,
        .page-container h3,
        .page-container p,
        .profile-hero .btn,
        .avatar-container,
        footer
    `);

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', 
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 🐙 Vercel 서버리스 함수를 통해 실제 GitHub 통계 가져오기
    async function loadRealGitHubStats() {
        try {
            const response = await fetch('/api/github');
            if (!response.ok) throw new Error('API 호출 실패');
            
            const data = await response.json();
            
            const commitEl = document.getElementById('commit-count');
            const repoEl = document.getElementById('repo-count');
            const prEl = document.getElementById('pr-count');
            const issueEl = document.getElementById('issue-count');
            const starEl = document.getElementById('star-count');
            
            if (commitEl) commitEl.textContent = data.totalCommits.toLocaleString();
            if (repoEl) repoEl.textContent = data.totalRepos.toLocaleString();
            if (prEl) prEl.textContent = data.totalPRs.toLocaleString();
            if (issueEl) issueEl.textContent = data.totalIssues.toLocaleString();
            if (starEl) starEl.textContent = data.totalStars.toLocaleString();
        } catch (error) {
            console.error("GitHub 통계 로드 실패:", error);
            ['commit-count', 'repo-count', 'pr-count', 'issue-count', 'star-count'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "-";
            });
        }
    }

    loadRealGitHubStats();

    loadRealGitHubStats();
});
