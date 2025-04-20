document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Initialize scores for each trait
        const scores = {
            "Extraversion": 0,
            "Agreeableness": 0,
            "Conscientiousness": 0,
            "Emotional Stability": 0,
            "Intellect/Imagination": 0
        };

        // Loop through each question
        const questions = form.querySelectorAll('tr');  // Assuming each <tr> is a question

        questions.forEach((tr, i) => {
            // Get the radio buttons for this question
            const radios = tr.querySelectorAll('input[type="radio"]');

            radios.forEach((radio) => {
                // Get scale and direction from the radio button attributes
                const scale = radio.getAttribute('data-scale');
                const direction = radio.getAttribute('data-direction');

                // Check if this radio button is selected
                if (radio.checked) {
                    // Get the value of the selected radio button (1-5)
                    let value = parseInt(radio.value, 10);

                    // Invert score if the direction is negative
                    if (direction === '-') value = -value;

                    // Add the value to the appropriate scale
                    if (scale) {
                        scores[scale] += value;
                    }
                }
            });
        });

        // Optional: Normalize or visualize scores
        let output = `<h3>Your Results</h3><ul>`;
        for (const trait in scores) {
            output += `<li><strong>${trait}:</strong> ${scores[trait]}</li>`;
        }
        output += `</ul>`;

        resultDiv.innerHTML = output;
    });
});
