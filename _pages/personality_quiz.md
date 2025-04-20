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
            <th>Questions</th>
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

    <div id="result"></div>
  </div>
</div>
