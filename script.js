var inputs = {};
var touchingHitBox = false;
var hitboxes = [];
var steps = {
    touchGuideNPC: false
}
const npcDialogs = {
    "Rehber": {
        index: 0,
        msgs: [
            "Rehber: Merhaba! Nasıl gidiyor?",
            "Rehber: Biliyorum, dersler sıkıcı... Ama Çorum'da yapabileceğin çok şey var!"
        ]   
    }
}
const char = document.querySelector(".char");
var ongoingDialog = false;

document.querySelectorAll(".hitboxes .box").forEach(item => {
    hitboxes.push(item);
});

window.addEventListener("load", async () => {
    const assets = await preload();
    document.querySelectorAll("[preload]").forEach(item => {
        item.src = assets[item.className];
    });
    window.scrollTo(725, 0);
    char.style.top = "50%";
    char.style.left = "50%";
    document.body.addEventListener("keydown", event => {
        inputs[event.keyCode] = true;
    });
    document.body.addEventListener("keyup", event => {
        inputs[event.keyCode] = false;
    });
    document.querySelector(".market .kapat").onclick = () => {
        document.querySelector(".market").style.display = "none";
    }
    document.querySelector(".uyari button#no").onclick = () => {
        uyari(0);
    }
    setInterval(() => {
        if (touches(char, document.querySelector("[data-name=Rehber]")) && !steps.touchGuideNPC) {
            diyalog("İnsanlarla konuşmak için yanlarına gidip Enter tuşuna bas.".replaceAll(" ", "\x0a"));
            steps.touchGuideNPC = true;
        }
        touchingHitBox = false;
        document.querySelectorAll(".hitboxes .box.col, img[data-npc]").forEach(item => {
            if (touches(item, char)) touchingHitBox = [item, (
                item.getBoundingClientRect().top > char.getBoundingClientRect().top ?
                "top" : "bottom"
            ), (
                item.getBoundingClientRect().left > char.getBoundingClientRect().left ?
                "left" : "right"
            )];
        });
        if (inputs[87]) {
            if (touchingHitBox && touchingHitBox[1] === "bottom") return;
            if (window.scrollY != 0 && char.style.top == "50%") window.scrollBy(0, -1);
            else if (parseInt(char.getBoundingClientRect().top) > 2.5) char.style.top = `${parseFloat(char.style.top.replace("%", "")) - .25}%`;
        }
        else if (inputs[83]) {
            if (touchingHitBox && touchingHitBox[1] === "top") return;
            if (window.scrollY != screen.height && char.style.top == "50%") window.scrollBy(0, 1);
            else if (parseInt(char.getBoundingClientRect().bottom) < screen.height - 250) char.style.top = `${parseFloat(char.style.top.replace("%", "")) + .25}%`;
        }
        else if (inputs[65]) {
            if (touchingHitBox && touchingHitBox[2] === "right") return;
            if (window.scrollX != 0 && char.style.left == "50%") window.scrollBy(-1, 0);
            else if (parseInt(char.getBoundingClientRect().left) > 2.5) char.style.left = `${parseFloat(char.style.left.replace("%", "")) - .125}%`;
            char.style.transform = "translate(-50%, -50%) scale(-.2, .2)";
        }
        else if (inputs[68]) {
            if (touchingHitBox && touchingHitBox[2] === "left") return;
            if (window.scrollX != screen.width && char.style.left == "50%") window.scrollBy(1, 0);
            else if (parseInt(char.getBoundingClientRect().right) < screen.width - 250) char.style.left = `${parseFloat(char.style.left.replace("%", "")) + .125}%`;
            char.style.transform = "translate(-50%, -50%) scale(.2, .2)";
        }
        if (touches(hitboxes[6], char)) {
            document.querySelector(".ui .konum").innerText = "Çocuk Parkı";
        }
        else if (touches(hitboxes[5], char)) {
            document.querySelector(".ui .konum").innerText = "Pazar";
        }
        else if (touches(hitboxes[2], char)) {
            uyari("<strong>B102'ye</strong> girmek istediğine emin misin?");
            document.querySelector("button#ok").onclick = () => {
                uyari(0);
                document.querySelector(".market").style.display = "flex";
                diyalog("Yakında açılıyoruz - B102".replaceAll(" ", "\x0a"));
            }
        }
        else if (!touches(hitboxes[2], char) && document.querySelector(".uyari").style.opacity == 1) {
            uyari(0);
        }
        else {
            document.querySelector(".ui .konum").innerText = "Cadde";
        }
    });
});

const preload = async (dir = "./data.json") => {
    const first = await fetch(dir);
    return first.json();
}

const touches = (a, b) => {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();
    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

const uyari = (msg) => {
    if (msg === 0) {
        hide(document.querySelector(".uyari"));
        document.querySelector(".uyari button#ok").addEventListener("click", () => {});
        setTimeout(() => {
            document.querySelector(".uyari p#mesaj").setHTML("");
        }, 500);
        return
    }
    document.querySelector(".uyari p#mesaj").setHTML(msg);
    show(document.querySelector(".uyari"));
}

const show = (item) => {
    item.style.pointerEvents = "all";
    item.style.opacity = "1";
}

const hide = (item) => {
    item.style.pointerEvents = "none";
    item.style.opacity = "0";
}

const canDegistir = (val) => {
    document.querySelector(".ui meter#can").value += val;
}

const diyalog = (msg) => {
    document.querySelector(".diyalog").innerHTML = "";
    if (msg === 0) {
        document.querySelector(".diyalog").style.display = "none";
        ongoingDialog = false;
        return;
    }
    ongoingDialog = msg;
    document.querySelector(".diyalog").style.display = "block";
    let i = 0;
    typewrite(msg, i);
}

const typewrite = (txt, i) => {
    if (i == txt.length || ongoingDialog != txt) {
        ongoingDialog = false;
        return;
    }
    document.querySelector(".diyalog").innerHTML += ongoingDialog[i];
    i++;
    setTimeout(() => {
        typewrite(txt, i);
    }, 50);
}

const gorevTamam = (isim) => {
    document.querySelector(`.gorevler ul li#${isim}`).setAttribute("data-ok", true);
}

document.body.addEventListener("keydown", event => {
    if (event.keyCode === 32) {
        if (ongoingDialog) return;
        diyalog(0);
        document.querySelectorAll("[data-npc]").forEach(npc => {
            if (touches(char, npc) && npcDialogs[npc.getAttribute("data-name")]["index"] != 0) {
                diyalog(npcDialogs[npc.getAttribute("data-name")]["msgs"][npcDialogs[npc.getAttribute("data-name")]["index"]]);
                if (npcDialogs[npc.getAttribute("data-name")]["index"] == npcDialogs[npc.getAttribute("data-name")]["msgs"].length - 1) {
                    npcDialogs[npc.getAttribute("data-name")]["index"] = 0;
                }
                else npcDialogs[npc.getAttribute("data-name")]["index"]++;
            }
        });
    }
    else if (event.keyCode === 13) {
        if (ongoingDialog) return;
        diyalog(0);
        document.querySelectorAll("[data-npc]").forEach(npc => {
            if (touches(char, npc)) {
                diyalog(npcDialogs[npc.getAttribute("data-name")]["msgs"][npcDialogs[npc.getAttribute("data-name")]["index"]]);
                if (npcDialogs[npc.getAttribute("data-name")]["index"] == npcDialogs[npc.getAttribute("data-name")]["msgs"].length - 1) {
                    npcDialogs[npc.getAttribute("data-name")]["index"] = 0;
                }
                else npcDialogs[npc.getAttribute("data-name")]["index"]++;
                // İlave
                if (npc.getAttribute("data-name") == "Rehber") {
                    gorevTamam("ilk-sohbet");
                }
            }
        });
    }
    if ([49, 50, 51, 52, 53].includes(event.keyCode)) {
        document.querySelectorAll(".envanter .slot").forEach((slot, index) => {
            if (index != event.keyCode - 49) slot.removeAttribute("active");
            else slot.setAttribute("active", true);
        });
    }
});

diyalog("Şehre hoşgeldin, WASD tuşları ile hareket et ve çevreyi tanı! Space tuşu ile diyalogları geçebilirsin.".replaceAll(" ", "\x0a"));