document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let score = 0;

        // Gather answers
        const answers = {
            q1: document.querySelector('input[name="q1"]:checked')?.value,
            q2: document.querySelector('input[name="q2"]:checked')?.value,
            q3: document.querySelector('input[name="q3"]:checked')?.value,
        };

        // Calculate the score based on answers (customize this as per your needs)
        if (answers.q1 === 'Red') score += 1;
        if (answers.q2 === 'Dog') score += 1;
        if (answers.q3 === 'Beach') score += 1;

        // Determine result
        let resultText = '';
        if (score === 3) {
            resultText = 'You are a beach lover!';
        } else if (score === 2) {
            resultText = 'You are an adventurous person!';
        } else {
            resultText = 'You are a nature enthusiast!';
        }

        // Display result
        document.getElementById('result').innerText = resultText;
    });
});
