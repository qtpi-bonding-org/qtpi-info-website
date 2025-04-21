---
layout: page
title: Personality Quiz
include_in_header: true
---

<script src="{{ '/assets/js/quiz.js' | relative_url }}"></script>

<div id="quiz-container">
  <h2>Discover Your Personality Pie</h2>
  <div id="quiz">
    <form id="quiz-form">
      <!-- Table for the quiz -->
      <table>
        <thead>
          <tr>
            <th>Question/Answer</th>
            <th>{{ site.data.personality_quiz.answers[1] }}</th>
            <th>{{ site.data.personality_quiz.answers[2] }}</th>
            <th>{{ site.data.personality_quiz.answers[3] }}</th>
            <th>{{ site.data.personality_quiz.answers[4] }}</th>
            <th>{{ site.data.personality_quiz.answers[5] }}</th>
          </tr>
        </thead>
        <tbody>
          {% for question in site.data.personality_quiz.questions %}
            <tr>
              <!-- Question Text -->
              <td>{{ question.text }}</td>

              <!-- Radio buttons with data attributes for scale and direction -->
              <td><input type="radio" name="q{{ forloop.index }}" value="1" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index }}" value="2" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index }}" value="3" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index }}" value="4" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index }}" value="5" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
            </tr>
          {% endfor %}
        </tbody>
      </table>

      <!-- Submit button -->
      <button type="submit">Get Results</button>
    </form>

    <p style="margin-top: 1em;">
      <a href="https://ipip.ori.org/new_ipip-50-item-scale.htm" target="_blank">Big Five Personality Quiz Reference</a>
    </p>
  </div>
</div>

<!-- Trait Explanations -->
<div style="margin-top: 3em;">
  <h3>What the Traits Mean</h3>

  <p><strong>Extraversion</strong><br>
  This describes how outgoing and energetic you are. High extraversion means you're social and thrive around people, while low extraversion means you’re more reserved and enjoy solitude or small groups.</p>

  <p><strong>Agreeableness</strong><br>
  This reflects how compassionate and cooperative you are. High agreeableness means you're kind, empathetic, and eager to help others. Lower levels might mean you're more analytical, skeptical, or blunt.</p>

  <p><strong>Conscientiousness</strong><br>
  This is about how organized and responsible you are. High conscientiousness means you’re disciplined, reliable, and like planning. Low levels suggest a more spontaneous, flexible, and easygoing approach.</p>

  <p><strong>Emotional Stability</strong><br>
  This refers to how well you handle stress. High emotional stability means you're calm and resilient. Lower levels suggest you may experience mood swings, anxiety, or get overwhelmed more easily.</p>

  <p><strong>Intellect / Imagination (Openness)</strong><br>
  This measures creativity, curiosity, and willingness to explore new ideas. High levels indicate you're imaginative and open to new experiences, while lower levels suggest you prefer routine and familiarity.</p>
</div>

<!-- Results will be shown here at the very bottom -->
<div id="result" style="margin-top: 3em;"></div>
