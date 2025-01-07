// Inicializace proměnných
var theNum = 0; // Proměnná pro ukládání náhodně vygenerovaného čísla
var counter = 0; // Počítadlo pokusů
var db; // Proměnná pro databázi (není použita v tomto kódu)
var name; // Proměnná pro jméno (není použita v tomto kódu)

// Funkce pro generování náhodného čísla
function nahodneCislo() {
  theNum = Math.floor(Math.random() * 100 + 1); // Generuje náhodné číslo od 1 do 100
}

// Nastavení události "keyup" na vstupní pole, aby po stisknutí klávesy Enter byl spuštěn odhad čísla
var input = document.getElementById("numInput"); // Získání vstupního pole pomocí ID
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) { // Kontrola, zda je stisknuta klávesa Enter
    event.preventDefault(); // Zabránění výchozí akci (odeslání formuláře)
    document.getElementById("guessButton").click(); // Simulace kliknutí na tlačítko pro odhad čísla
  }
});

// Funkce pro ověření odhadnutého čísla
function hadejCislo() {
  counter++; // Inkrementace počítadla pokusů
  document.getElementById("counter").innerHTML = counter; // Aktualizace počtu pokusů na stránce

  var numIn = 0; // Proměnná pro uložení čísla z vstupního pole
  numIn = document.getElementById("numInput").value; // Získání hodnoty z vstupního pole

  // Porovnání odhadnutého čísla s generovaným číslem
  if (numIn > theNum) { // Pokud je odhad vyšší než generované číslo
    document.getElementById("theIcon").className = "fas fa-arrow-down"; // Změna ikony na šipku dolů
    document.body.style.backgroundColor = "red"; // Změna barvy pozadí na červenou
  } else if (numIn < theNum) { // Pokud je odhad nižší než generované číslo
    document.getElementById("theIcon").className = "fas fa-arrow-up"; // Změna ikony na šipku nahoru
    document.body.style.backgroundColor = "red"; // Změna barvy pozadí na červenou
  } else if (numIn == theNum) { // Pokud je odhad správný
    document.getElementById("theIcon").className = "fas fa-check-circle"; // Změna ikony na zaškrtlé kolečko
    document.getElementById("theGuessing").style.display = "none"; // Skrytí části pro zadávání čísla
    document.getElementById("correctNum").innerHTML = theNum; // Zobrazení správného čísla
    document.getElementById("congo").style.display = "block"; // Zobrazení gratulace
    document.body.style.backgroundColor = "limegreen"; // Změna barvy pozadí na zelenou
  }
  document.getElementById("numInput").value = ""; // Vymazání vstupního pole po odhadu čísla
} 
