document.addEventListener('DOMContentLoaded', (event) => {
    var udery = 0; //Počet úderů
    var konecHry = false; //konec hry
    var casovac = 30; //časovač
    var interval = setInterval(odpoctiCas, 1000); // Interval pro časovač, který volá funkci odpoctiCas

    //zobrazení krtka na náhodné pozici
    function zobrazKrtka() {
        if (konecHry) return; //Pokud hra skončila, nic nedělat
        var x = Math.random() * (document.getElementById('wrapper').clientWidth - 250); //Náhodná x pozice
        var y = Math.random() * (document.getElementById('wrapper').clientHeight - 188); //Náhodná y pozice
        document.querySelector('.krtek').style.opacity = 1; //Zobrazit krtka
        document.querySelector('.krtek').style.top = y + 'px';
        document.querySelector('.krtek').style.left = x + 'px';
        setTimeout(() => {
            document.querySelector('.krtek').style.opacity = 0; //Skrýt krtka po 1 sekundě
            setTimeout(zobrazKrtka, Math.random() * 3000); //Nastavit opětovné zobrazení krtka po náhodném čase
        }, 1000); //Doba, po kterou je krtek viditelný
    }

    //kliknutí na krtka
    document.querySelector('.krtek').addEventListener('click', function() {
        if (konecHry) return; //Pokud hra skončila, nedělat nic
        document.querySelector('.krtek').style.opacity = 0; //Skrýt krtka
        document.getElementById('skore').innerHTML = ++udery; //Zvýšit skóre a zobrazit
    });

    //tlačítko restart
    document.getElementById('restart').addEventListener('click', function() {
        casovac = 30; //Reset časovače
        udery = 0; //Reset skóre
        document.getElementById('skore').innerHTML = udery; //Aktualizovat skóre na 0
        konecHry = false; //Reset konecHry
        clearInterval(interval); //Zastavit stávající interval časovače
        interval = setInterval(odpoctiCas, 1000); //Spustit nový interval časovače
        document.getElementById('casovac').innerHTML = casovac; //Aktualizovat zobrazení časovače
        zobrazKrtka(); //Znovu zobrazit krtka
    });

    //Funkce pro odpočet času
    function odpoctiCas() {
        if (casovac <= 0) {
            konecHry = true; //Pokud časovač dosáhl nuly, nastavit konecHry na true
            document.getElementById('casovac').innerHTML = "Konec hry"; //Zobrazit konec hry
            clearInterval(interval); //Zastavit interval časovače
            return;
        }
        document.getElementById('casovac').innerHTML = (casovac < 10 ? "0:0" : "0:") + casovac--; //Aktualizovat zobrazení časovače
    }

    zobrazKrtka(); //zobrazení krtka
});
