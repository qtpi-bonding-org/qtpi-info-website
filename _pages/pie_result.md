---
layout: page
---

{% assign pie_code = page.code %}
{% assign pie_result = site.data.personality_data.pie_personalities[pie_code] %}
{% assign trait_explanations = site.data.personality_data.trait_explanations %}
{% assign trait_name_map = site.data.personality_data.trait_name_map %}

{% if pie_result %}
  {% assign code_letters = pie_code | split: '-' %}
  
  {% assign open_name = trait_name_map['Open vs Traditional'].positive %}
  {% assign traditional_name = trait_name_map['Open vs Traditional'].negative %}
  {% assign disciplined_name = trait_name_map['Disciplined vs Spontaneous'].positive %}
  {% assign spontaneous_name = trait_name_map['Disciplined vs Spontaneous'].negative %}
  {% assign social_name = trait_name_map['Social vs Reserved'].positive %}
  {% assign reserved_name = trait_name_map['Social vs Reserved'].negative %}
  {% assign easygoing_name = trait_name_map['Easygoing vs Assertive'].positive %}
  {% assign assertive_name = trait_name_map['Easygoing vs Assertive'].negative %}
  {% assign calm_name = trait_name_map['Calm vs Passionate'].positive %}
  {% assign passionate_name = trait_name_map['Calm vs Passionate'].negative %}

  {% assign pie_type_lower = pie_result.pieType | downcase %}
  {% assign filename = pie_type_lower | replace: ' ', '_' | append: '.svg' %}

  {% assign trait_list_html = "" %}
  
  {% if code_letters[0] == 'O' %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: open_name | append: '** person.</li>' %}
  {% else %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: traditional_name | append: '** person.</li>' %}
  {% endif %}
  
  {% if code_letters[1] == 'D' %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: disciplined_name | append: '** person.</li>' %}
  {% else %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: spontaneous_name | append: '** person.</li>' %}
  {% endif %}

  {% if code_letters[2] == 'O' %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: social_name | append: '** person.</li>' %}
  {% else %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: reserved_name | append: '** person.</li>' %}
  {% endif %}
  
  {% if code_letters[3] == 'E' %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: easygoing_name | append: '** person.</li>' %}
  {% else %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: assertive_name | append: '** person.</li>' %}
  {% endif %}
  
  {% if code_letters[4] == 'C' %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: calm_name | append: '** person.</li>' %}
  {% else %}
    {% assign trait_list_html = trait_list_html | append: '<li>You are a **' | append: passionate_name | append: '** person.</li>' %}
  {% endif %}

  <div class="result-container" style="margin-top: 3em;">
    <h2>You are a {{ pie_result.pieType }}!</h2>
    <img src="https://assets.qtpi.app/cutie_pie/{{ filename }}" alt="{{ pie_result.pieType }}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 1rem;">
    <p><em>"{{ pie_result.reasoning }}"</em></p>
    <p>{{ pie_result.blurb }}</p>
    <hr>
    <h3>Your Personality Code: {{ pie_result.code }}</h3>
    <ul>
      {{ trait_list_html }}
    </ul>
    <h4>Your Trait Scores</h4>
    <canvas id="score-bar-chart" width="400" height="200"></canvas>
    <p><strong>Share your results:</strong></p>
    <div style="margin-bottom: 10px;">
        {% comment %} This URL is now the current page URL with query parameters attached. {% endcomment %}
        <input id="share-url" type="text" value="{{ site.url }}{{ page.url }}{{ page.query_string }}" readonly style="width: 100%; padding: 5px;">
    </div>
    <p>
        {% assign share_text = 'I got ' | append: pie_result.pieType | append: ' on the pie personality quiz! See your result: ' | append: site.url | append: page.url | append: page.query_string %}
        <a href="https://twitter.com/intent/tweet?text={{ share_text | url_encode }}" target="_blank" class="fa-stack">
            <i class="fa-brands fa-x-twitter fa-stack-1x"></i>
        </a>
        <a href="https://bsky.app/intent/compose?text={{ share_text | url_encode }}" target="_blank" class="fa-stack">
            <i class="fa-brands fa-bluesky fa-stack-1x"></i>
        </a>
        <a href="https://www.threads.net/share?text={{ share_text | url_encode }}" target="_blank" class="fa-stack">
            <i class="fa-brands fa-threads fa-stack-1x"></i>
        </a>
        <a href="https://mastodon.social/share?text={{ share_text | url_encode }}" target="_blank" class="fa-stack">
            <i class="fa-brands fa-mastodon fa-stack-1x"></i>
        </a>
        <a href="javascript:void(0);" onclick="navigator.clipboard.writeText('{{ site.url }}{{ page.url }}{{ page.query_string }}'); alert('Link copied!');" title="Copy link"><i class="fa-solid fa-copy"></i> Copy</a>
    </p>
  </div>
{% else %}
  <p>Result not found. Please take the <a href="/quiz">quiz</a> to get your result.</p>
{% endif %}

{% comment %} Inject quiz questions data for the client-side chart script {% endcomment %}
<script>
    window.quizQuestionsData = [
    {% for question in site.data.personality_quiz.questions %}
        { scale: "{{ question.scale }}", direction: "{{ question.direction }}" }{% unless forloop.last %},{% endunless %}
    {% endfor %}
    ];
</script>

{% comment %} Load the chart-rendering script {% endcomment %}
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="{{ '/assets/js/pie_result_script.js' | relative_url }}"></script>