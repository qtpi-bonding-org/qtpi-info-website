---
layout: page
title: Personality Quiz
include_in_header: true
---

<script src="{{ '/assets/js/quiz.js' | relative_url }}"></script>

<div id="quiz-container">
  <h2>Discover Your Personality Pie </h2>
  <div id="quiz">
    <form id="quiz-form">
      <ol>
        {% for question in site.data.questions %}
          <li>{{ question }}
            <div>
              {% assign index = forloop.index %}
              <label><input type="radio" name="q{{ index }}" value="1"> Very Inaccurate</label>
              <label><input type="radio" name="q{{ index }}" value="2"> Moderately Inaccurate</label>
              <label><input type="radio" name="q{{ index }}" value="3"> Neither</label>
              <label><input type="radio" name="q{{ index }}" value="4"> Moderately Accurate</label>
              <label><input type="radio" name="q{{ index }}" value="5"> Very Accurate</label>
            </div>
          </li>
        {% endfor %}
      </ol>
      <button type="submit">Get Results</button>
    </form>

    <div id="result"></div>
  </div>
</div>
