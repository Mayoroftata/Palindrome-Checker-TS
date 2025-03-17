var wordList = JSON.parse(localStorage.getItem("palindromeList") || "[]");
var btn = document.getElementById("checkButton");
var inputField = document.getElementById("text");
var resultDiv = document.getElementById("resultText");
var tableBody = document.getElementById("wordTableBody");
var filterSelect = document.getElementById("filter");
// Function to check palindrome
var checkPalindrome = function () {
    if (inputField.value.trim() === "") {
        alert("Input cannot be empty");
        return;
    }
    var inputText = inputField.value.trim();
    var cleanedInput = inputText.toLowerCase().replace(/[^a-z0-9]/g, ""); // Remove special characters
    var isPalindrome = cleanedInput === cleanedInput.split("").reverse().join("");
    var newEntry = {
        id: Date.now(), // Unique ID
        input: inputText,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        isPalindrome: isPalindrome,
    };
    wordList.push(newEntry);
    updateLocalStorage();
    displayWords();
    // Show result message
    resultDiv.innerHTML = "\n        <p class=\"p-2 text-lg font-semibold ".concat(isPalindrome ? "bg-green-500" : "bg-red-500", " text-white rounded\">").concat(inputText, " ").concat(isPalindrome ? "is a palindrome ✅" : "is not a palindrome ❌", "</p>");
    inputField.value = "";
};
// Function to update local storage
var updateLocalStorage = function () {
    localStorage.setItem("palindromeList", JSON.stringify(wordList));
};
// Function to display words in the table
var displayWords = function () {
    tableBody.innerHTML = ""; // Clear table before updating
    var filterValue = filterSelect.value;
    var filteredList = wordList.filter(function (word) {
        if (filterValue === "palindrome")
            return word.isPalindrome;
        if (filterValue === "non-palindrome")
            return !word.isPalindrome;
        return true; // "all" case
    });
    filteredList.forEach(function (word, index) {
        var row = document.createElement("tr");
        row.className = "border-b border-gray-600";
        row.innerHTML = "\n            <td class=\"p-3\">".concat(index + 1, "</td>  <!-- \u2705 Serial Number -->\n            <td class=\"p-3\">").concat(word.input, "</td>\n            <td class=\"p-3\">").concat(word.date, "</td>\n            <td class=\"p-3\">").concat(word.time || "N/A", "</td>  <!-- \u2705 Fix for undefined time -->\n            <td class=\"p-3 ").concat(word.isPalindrome ? "text-green-400" : "text-red-400", "\">\n                ").concat(word.isPalindrome ? "Palindrome ✅" : "Not a palindrome ❌", "\n            </td>\n            <td class=\"p-3\">\n                <button onclick=\"removeWord(").concat(word.id, ")\" class=\"bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded\">\n                    Remove\n                </button>\n            </td>\n        ");
        tableBody.appendChild(row);
    });
};
// Function to remove a word
var removeWord = function (id) {
    wordList = wordList.filter(function (word) { return word.id !== id; });
    updateLocalStorage();
    displayWords();
    resultDiv.innerHTML = "";
};
// Event Listeners
btn.addEventListener("click", checkPalindrome);
filterSelect.addEventListener("change", displayWords);
// Load words from local storage when the page loads
window.onload = displayWords;
// Make `removeWord` function globally accessible for button clicks
window.removeWord = removeWord;
