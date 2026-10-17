const invitationData = {
    gender: null,
    outfit: null,
    place: null,
    gift: null
};

const outfits = {
    angel: {
        label: "فرشته",
        icon: "😇",
        css: "item-angel"
    },
    devil: {
        label: "شیطان",
        icon: "😈",
        css: "item-devil"
    },
    sport: {
        label: "اسپورت",
        icon: "⚽",
        css: "item-sport"
    },
    formal: {
        label: "رسمی",
        icon: "👔",
        css: "item-formal"
    },
    casual: {
        label: "کژوال",
        icon: "👕",
        css: "item-casual"
    },
    autumn: {
        label: "پاییزی",
        icon: "🧥",
        css: "item-autumn"
    },
    royal: {
        label: "سلطنتی",
        icon: "👑",
        css: "item-royal"
    },
    mysterious: {
        label: "مرموز",
        icon: "🕶️",
        css: "item-mysterious"
    }
};

/* استایل آیتم‌های لباس روی کاراکتر */
const characterStyle = document.createElement("style");

characterStyle.textContent = `
.avatar-stack {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 130px;
    overflow: visible;
}

.avatar-base {
    position: relative;
    z-index: 1;
    font-size: 85px;
    line-height: 1;
    filter: drop-shadow(0 8px 8px #0005);
}

.avatar-item {
    position: absolute;
    z-index: 2;
    line-height: 1;
    pointer-events: none;
    filter: drop-shadow(0 3px 3px #0005);
    animation: outfitPop 0.45s ease both;
}

.item-angel,
.item-devil {
    top: -5px;
    right: 22px;
    font-size: 37px;
}

.item-sport {
    bottom: 3px;
    left: 10px;
    font-size: 34px;
}

.item-formal,
.item-casual {
    top: 57px;
    left: calc(50% - 18px);
    font-size: 34px;
}

.item-autumn {
    top: 51px;
    left: calc(50% - 21px);
    font-size: 39px;
}

.item-royal {
    top: -12px;
    left: calc(50% - 22px);
    font-size: 43px;
}

.item-mysterious {
    top: 30px;
    left: calc(50% - 19px);
    font-size: 36px;
}

@keyframes outfitPop {
    from {
        opacity: 0;
        scale: 0.5;
    }

    to {
        opacity: 1;
        scale: 1;
    }
}
`;

document.head.appendChild(characterStyle);

/* ساخت برگ‌های پاییزی مستقل */
function setupFallingLeaves() {
    const container = document.querySelector(".falling-leaves");

    if (!container) return;

    const leafTypes = ["🍂", "🍁", "🍃"];

    container.replaceChildren();

    for (let i = 0; i < 22; i++) {
        const leaf = document.createElement("span");

        leaf.className = "leaf";

        leaf.textContent =
            leafTypes[Math.floor(Math.random() * leafTypes.length)];

        leaf.style.left = `${Math.random() * 100}%`;

        leaf.style.fontSize =
            `${16 + Math.random() * 16}px`;

        leaf.style.opacity =
            `${0.45 + Math.random() * 0.45}`;

        /* سرعت مستقل هر برگ */
        leaf.style.animationDuration =
            `${16 + Math.random() * 14}s`;

        /* شروع نامنظم؛ برگ‌ها با هم سقوط نمی‌کنند */
        leaf.style.animationDelay =
            `${-Math.random() * 28}s`;

        /* مسیر حرکت متفاوت */
        leaf.style.setProperty(
            "--drift",
            `${Math.round(Math.random() * 160 - 80)}px`
        );

        container.appendChild(leaf);
    }
}

setupFallingLeaves();

/* جابه‌جایی بین صفحه‌های دعوتنامه */
function nextStep(screenId) {
    const target = document.getElementById(screenId);

    if (!target) {
        console.error("صفحه پیدا نشد:", screenId);
        return;
    }

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    target.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* انتخاب جنسیت */
function selectGender(gender) {
    if (gender !== "female" && gender !== "male") {
        return;
    }

    invitationData.gender = gender;

    updateCharacter("character");
    updateCharacter("outfitCharacter");

    nextStep("invite");
}

/* نمایش کاراکتر و آیتم لباس */
function updateCharacter(elementId) {
    const character = document.getElementById(elementId);

    if (!character) return;

    const baseEmoji =
        invitationData.gender === "female"
            ? "👩"
            : invitationData.gender === "male"
                ? "👨"
                : "🧑";

    const outfit = invitationData.outfit
        ? outfits[invitationData.outfit]
        : null;

    character.innerHTML = `
        <span class="avatar-stack">
            <span class="avatar-base">${baseEmoji}</span>
            ${
                outfit
                    ? `<span class="avatar-item ${outfit.css}"
                             title="${outfit.label}">
                           ${outfit.icon}
                       </span>`
                    : ""
            }
        </span>
    `;
}

/* انتخاب یکی از هشت استایل */
function selectOutfit(outfitId) {
    if (!outfits[outfitId]) return;

    invitationData.outfit = outfitId;

    updateCharacter("outfitCharacter");
    updateCharacter("character");

    const continueButton =
        document.getElementById("outfitNext");

    if (continueButton) {
        continueButton.disabled = false;
    }
}

/* انتخاب مکان */
function selectPlace(place) {
    const allowedPlaces = [
        "کافه",
        "رستوران",
        "پارک",
        "مکان گردشگری"
    ];

    if (!allowedPlaces.includes(place)) return;

    invitationData.place = place;

    nextStep("mystery");
}

/* انتخاب هدیه */
function selectGift(gift) {
    if (gift !== "گل" && gift !== "شکلات") return;

    invitationData.gift = gift;

    nextStep("info");
}

/* تبدیل اعداد فارسی و عربی به انگلیسی */
function normalizeDigits(value) {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

    return value
        .replace(/[۰-۹]/g, digit =>
            persianDigits.indexOf(digit).toString()
        )
        .replace(/[٠-٩]/g, digit =>
            arabicDigits.indexOf(digit).toString()
        );
}

/* بررسی فرم پایانی */
function finishInvitation() {
    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const phoneRaw =
        document.getElementById("phone").value.trim();

    const phoneDigits =
        normalizeDigits(phoneRaw).replace(/\D/g, "");

    if (!firstName || !lastName || !phoneRaw) {
        alert("لطفاً نام، نام خانوادگی و شماره موبایل را وارد کن.");
        return;
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        alert("لطفاً شماره موبایل را بررسی کن.");
        return;
    }

    if (
        !invitationData.gender ||
        !invitationData.outfit ||
        !invitationData.place ||
        !invitationData.gift
    ) {
        alert("لطفاً مراحل دعوتنامه را کامل کن.");
        return;
    }

    const submission = {
        firstName,
        lastName,
        phone: phoneRaw,
        gender: invitationData.gender,
        outfit: outfits[invitationData.outfit].label,
        place: invitationData.place,
        gift: invitationData.gift
    };

    /*
      در این نسخه اطلاعات فقط آماده می‌شود.
      ارسال واقعی به صاحب سایت هنوز تنظیم نشده است.
    */
    console.log("Invitation data prepared:", submission);

    const finalTitle = document.querySelector("#final h1");
    const finalMessage = document.querySelector("#final .small");

    if (finalTitle) {
        finalTitle.textContent = "دعوتت آماده شد ❤️";
    }

    if (finalMessage) {
        finalMessage.textContent =
            "این نسخه آزمایشی است؛ ارسال اطلاعات هنوز فعال نشده.";
    }

    nextStep("final");
}

/* دکمه فراری «نه» */
const noButton = document.getElementById("noButton");

if (noButton) {
    const moveNoButton = () => {
        const container = noButton.parentElement;

        const maxLeft = Math.max(
            0,
            container.clientWidth - noButton.offsetWidth
        );

        const maxTop = Math.max(
            0,
            container.clientHeight - noButton.offsetHeight
        );

        noButton.style.left =
            `${Math.random() * maxLeft}px`;

        noButton.style.top =
            `${Math.random() * maxTop}px`;
    };

    noButton.style.left = "62%";
    noButton.style.top = "10px";

    noButton.addEventListener("mouseenter", moveNoButton);
    noButton.addEventListener("click", moveNoButton);

    noButton.addEventListener("touchstart", event => {
        event.preventDefault();
        moveNoButton();
    }, { passive: false });
}
