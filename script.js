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
    // 1. 기존 타이핑 효과 (유지)
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

    // 2. 🌟 카드 3D 틸트(Hover Tilt) 효과
    const cards = document.querySelectorAll(".project-card, .skill-box, .contact-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // 카드 내부에서의 마우스 X 위치
            const y = e.clientY - rect.top;  // 카드 내부에서의 마우스 Y 위치
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // 마우스 위치에 따라 회전 각도 계산 (숫자가 클수록 많이 꺾임)
            const rotateX = -((y - centerY) / centerY) * 12; 
            const rotateY = ((x - centerX) / centerX) * 12;
            
            // 3D 회전과 살짝 위로 떠오르는 효과 적용
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            // 마우스가 카드를 벗어나면 부드럽게 제자리로 복귀
            card.style.transition = "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
        });

        card.addEventListener("mouseenter", () => {
            // 마우스가 올라간 순간에는 부드러운 전환 효과 잠시 제거 (마우스 따라 즉시 반응하도록)
            card.style.transition = "none";
        });
    });
});
