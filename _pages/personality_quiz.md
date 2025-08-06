---
layout: page
title: Personality Quiz
include_in_header: true
description: "Understand yourself with our sign-up less, free Big 5 personality test. Discover your personality and optionally import your results into Qtpi!"
keywords: ["personality quiz", "personality quiz", "free quiz", "personality type", "self-discovery"]
tags: ["personality", "dating", "relationships", "self-discovery", "personality quiz", "compatibility", "online dating", "self-awareness", "personal growth"]
category: "personality"
---

# Discover Your Personality
Discover your unique personality profile with a scientifically rigorous Big 5 personality quiz - **completely free** and no strings attached, **no email or signup** required! Knowing yourself is the first step to successful dating, and this quiz can help you learn more about your strengths, weaknesses, and what you're looking for in a partner. Plus, if you're interested in joining [**Qtpi**](https://qtpi.app), you can easily import your quiz results to get started - no need to retake the quiz! By understanding yourself better, you'll be more confident and prepared to find meaningful connections with others.

<script>
  window.quizData = {
    scaleColors: {{ site.data.personality_data.scale_colors | jsonify }}
  };
</script>
<script src="{{ '/assets/js/personality_quiz.js' | relative_url }}"></script>

<div id="quiz-container">
  <div id="quiz">
    <form id="quiz-form">
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
              <td>{{ question.text }}</td>
              <td><input type="radio" name="q{{ forloop.index0 }}" value="1" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index0 }}" value="2" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index0 }}" value="3" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index0 }}" value="4" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
              <td><input type="radio" name="q{{ forloop.index0 }}" value="5" data-scale="{{ question.scale }}" data-direction="{{ question.direction }}"></td>
            </tr>
          {% endfor %}
        </tbody>
      </table>
      <button type="submit">Get Results</button>
    </form>

    <div id="quiz-error" style="margin-top: 1em;"></div>

    <p style="margin-top: 1em;">
      <a href="https://ipip.ori.org/new_ipip-50-item-scale.htm" target="_blank">Big Five Personality Quiz Reference</a>
    </p>
  </div>
</div>

<div style="margin-top: 3em;">
  <h3>What the Traits Mean</h3>
  </div>