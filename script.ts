interface Palindrome {
    id: number;
    input: string;
    date: string;
    time: string;
    isPalindrome: boolean;
}

let wordList: Palindrome[] = JSON.parse(localStorage.getItem("palindromeList") || "[]");

const btn = document.getElementById("checkButton") as HTMLButtonElement;
const inputField = document.getElementById("text") as HTMLInputElement;
const resultDiv = document.getElementById("resultText") as HTMLElement;
const tableBody = document.getElementById("wordTableBody") as HTMLElement;
const filterSelect = document.getElementById("filter") as HTMLSelectElement;

// Function to check palindrome
const checkPalindrome = () => {
    if (inputField.value.trim() === "") {
        alert("Input cannot be empty");
        return;
    }

    const inputText = inputField.value.trim();
    const cleanedInput = inputText.toLowerCase().replace(/[^a-z0-9]/g, ""); // Remove special characters
    const isPalindrome = cleanedInput === cleanedInput.split("").reverse().join("");

    const newEntry: Palindrome = {
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
    resultDiv.innerHTML = `
        <p class="p-2 text-lg font-semibold ${
            isPalindrome ? "bg-green-500" : "bg-red-500"
        } text-white rounded">${inputText} ${
        isPalindrome ? "is a palindrome ✅" : "is not a palindrome ❌"
    }</p>`;
    inputField.value=""
};

// Function to update local storage
const updateLocalStorage = () => {
    localStorage.setItem("palindromeList", JSON.stringify(wordList));
};

// Function to display words in the table
const displayWords = () => {
    tableBody.innerHTML = ""; // Clear table before updating

    const filterValue = filterSelect.value;
    const filteredList = wordList.filter((word) => {
        if (filterValue === "palindrome") return word.isPalindrome;
        if (filterValue === "non-palindrome") return !word.isPalindrome;
        return true; // "all" case
    });

    filteredList.forEach((word, index) => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-600";

        row.innerHTML = `
            <td class="p-3">${index + 1}</td>  <!-- ✅ Serial Number -->
            <td class="p-3">${word.input}</td>
            <td class="p-3">${word.date}</td>
            <td class="p-3">${word.time || "N/A"}</td>  <!-- ✅ Fix for undefined time -->
            <td class="p-3 ${word.isPalindrome ? "text-green-400" : "text-red-400"}">
                ${word.isPalindrome ? "Palindrome ✅" : "Not a palindrome ❌"}
            </td>
            <td class="p-3">
                <button onclick="removeWord(${word.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Remove
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
};


// Function to remove a word
const removeWord = (id: number) => {
    wordList = wordList.filter((word) => word.id !== id);
    updateLocalStorage();
    displayWords();
    resultDiv.innerHTML=""
};

// Event Listeners
btn.addEventListener("click", checkPalindrome);
filterSelect.addEventListener("change", displayWords);

// Load words from local storage when the page loads
window.onload = displayWords;

// Make `removeWord` function globally accessible for button clicks
(window as any).removeWord = removeWord;
