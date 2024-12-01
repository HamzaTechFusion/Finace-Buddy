document.getElementById("calculateButton").addEventListener("click", function () 
{
    const paymentHistory = parseInt(document.getElementById("paymentHistory").value) || 0;
    const creditUtilization = parseInt(document.getElementById("creditUtilization").value) || 0;
    const accountAge = parseInt(document.getElementById("accountAge").value) || 0;
    const creditTypes = parseInt(document.getElementById("creditTypes").value) || 0;
    const creditInquiries = parseInt(document.getElementById("creditInquiries").value) || 0;

    const rawScore =
        (paymentHistory * 0.35) +
        ((100 - creditUtilization) * 0.30) +
        (Math.min(accountAge, 15) * 0.15) + 
        (Math.min(creditTypes, 5) * 0.10) + 
        ((10 - Math.min(creditInquiries, 10)) * 0.10); 

    const scaledScore = Math.round(((rawScore / 68.75) * 550) + 300);

    document.getElementById("scoreResult").textContent = `Your credit score is ${scaledScore}`;

    const scoreMessage = document.getElementById("scoreMessage");
    if (scaledScore >= 750) {
        scoreMessage.textContent = "Excellent credit score!";
        scoreMessage.style.color = "green";
    } else if (scaledScore >= 650) {
        scoreMessage.textContent = "Good credit score!";
        scoreMessage.style.color = "blue";
    } else if (scaledScore >= 550) {
        scoreMessage.textContent = "Fair credit score!";
        scoreMessage.style.color = "orange";
    } else {
        scoreMessage.textContent = "Poor credit score!";
        scoreMessage.style.color = "red";
    }

    const tips = [];
    if (paymentHistory < 100) tips.push("Improve your payment history by paying bills on time.");
    if (creditUtilization > 30) tips.push("Lower your credit utilization to below 30%.");
    if (accountAge < 15) tips.push("Keep older accounts open to improve account age.");
    if (creditTypes < 5) tips.push("Diversify your credit by adding different types.");
    if (creditInquiries > 2) tips.push("Avoid too many recent credit inquiries.");

    const tipsList = document.getElementById("improvementTips");
    tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join("") || "<li>You're doing great!</li>";
});
