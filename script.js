document.addEventListener("DOMContentLoaded", () => {
    // 1. 메인 타이틀 자동 타이핑 효과
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = "";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80); // 타이핑 속도 조절
            }
        }
        
        setTimeout(typeWriter, 300); // 페이지 로드 후 0.3초 뒤 시작
    }

    // 2. 스크롤 시 카드가 부드럽게 나타나는 인터랙션 (Observer)
    const cards = document.querySelectorAll(".project-card, .skill-box, .contact-card");
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease";
        observer.observe(card);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. 타이핑 효과
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

    // 2. 🌟 3D 틸트 및 빛 반사 인터랙션
    const cards = document.querySelectorAll(".project-card, .skill-box, .contact-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // CSS 변수로 마우스 위치 설정 (빛 반사 효과에 사용)
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
});
