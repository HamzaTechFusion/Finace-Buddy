document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("calculateButton").addEventListener("click", function() {
        // Get and validate inputs
        const paymentHistory = parseInt(document.getElementById("paymentHistory").value) || 0;
        const creditUtilization = parseInt(document.getElementById("creditUtilization").value) || 0;
        const accountAge = parseInt(document.getElementById("accountAge").value) || 0;
        const creditTypes = parseInt(document.getElementById("creditTypes").value) || 0;
        const creditInquiries = parseInt(document.getElementById("creditInquiries").value) || 0;

       
        if (!validateInputs(paymentHistory, creditUtilization, accountAge, creditTypes, creditInquiries)) {
            return;
        }

       
        const rawScore =
            (paymentHistory * 0.35) +
            ((100 - creditUtilization) * 0.30) +
            (Math.min(accountAge, 15) * 0.15) + 
            (Math.min(creditTypes, 5) * 0.10) + 
            ((10 - Math.min(creditInquiries, 10)) * 0.10);

        
        const finalScore = Math.round(((rawScore / 68.75) * 550) + 300);

        
        saveScore(finalScore, {
            paymentHistory,
            creditUtilization,
            accountAge,
            creditTypes,
            creditInquiries
        });

        
        displayResults(finalScore);
        
        
        const tips = [];
        if (paymentHistory < 100) tips.push("Improve your payment history by paying bills on time.");
        if (creditUtilization > 30) tips.push("Lower your credit utilization to below 30%.");
        if (accountAge < 15) tips.push("Keep older accounts open to improve account age.");
        if (creditTypes < 5) tips.push("Diversify your credit by adding different types.");
        if (creditInquiries > 2) tips.push("Avoid too many recent credit inquiries.");

        const tipsList = document.getElementById("improvementTips");
        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join("") || "<li>You're doing great!</li>";
    });

    
    function validateInputs(paymentHistory, creditUtilization, accountAge, creditTypes, creditInquiries) {
        if (paymentHistory < 0 || paymentHistory > 100 || 
            creditUtilization < 0 || creditUtilization > 100) {
            alert('Payment History and Credit Utilization must be percentages (0-100).');
            return false;
        }
        if (accountAge < 0 || creditTypes < 0 || creditInquiries < 0) {
            alert('Please enter valid positive numbers for all fields.');
            return false;
        }
        return true;
    }

    function displayResults(score) {
        const scoreResult = document.getElementById("scoreResult");
        const scoreMessage = document.getElementById("scoreMessage");
        
        scoreResult.textContent = `Your credit score is ${score}`;
        
        if (score >= 750) {
            scoreMessage.textContent = "Excellent credit score!";
            scoreMessage.style.color = "green";
        } else if (score >= 650) {
            scoreMessage.textContent = "Good credit score!";
            scoreMessage.style.color = "blue";
        } else if (score >= 550) {
            scoreMessage.textContent = "Fair credit score!";
            scoreMessage.style.color = "orange";
        } else {
            scoreMessage.textContent = "Poor credit score!";
            scoreMessage.style.color = "red";
        }
    }

    function saveScore(score, inputs) {
        const scoreHistory = JSON.parse(localStorage.getItem('creditScoreHistory')) || [];
        const scoreData = {
            date: new Date().toISOString(),
            score: score,
            inputs: inputs
        };
        scoreHistory.push(scoreData);
        localStorage.setItem('creditScoreHistory', JSON.stringify(scoreHistory));
    }

    // Dropdown menu handler
    document.querySelector(".dropbtn").addEventListener("click", function(e) {
        e.preventDefault();
        const dropdownContent = this.nextElementSibling;
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });
}); 
